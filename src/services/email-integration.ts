import type { EmailJob, Job, RecruitmentAgent, CandidateMatch } from '../types';
import { OpenAIService } from './openai';

export class EmailIntegrationService {
  private openAI: OpenAIService;
  private config: {
    host: string;
    port: number;
    user: string;
    password: string;
    tls: boolean;
  };

  constructor(openAIKey: string, emailConfig: any) {
    this.openAI = new OpenAIService(openAIKey);
    this.config = emailConfig;
  }

  // NHS and healthcare email domains
  private nhsDomains = [
    'nhs.net',
    'nhs.uk',
    'nhsmail.nhs.uk',
    'england.nhs.uk',
    'wales.nhs.uk',
    'scot.nhs.uk',
    'hscni.net'
  ];

  private isNHSEmail(email: string): boolean {
    return this.nhsDomains.some(domain => email.toLowerCase().includes(domain));
  }

  // Mock email fetching (in real implementation, use IMAP)
  async fetchNewEmails(): Promise<EmailJob[]> {
    // Simulate fetching emails from IMAP server
    const mockEmails: EmailJob[] = [
      {
        id: 'email_1',
        subject: 'Urgent: Consultant Cardiologist Required - Royal London Hospital',
        from: 'recruitment@royallondon.nhs.uk',
        to: 'jobs@your-agency.com',
        body: `Dear Recruitment Partner,

We have an urgent requirement for a Consultant Cardiologist at Royal London Hospital.

Position Details:
- Title: Consultant Cardiologist
- Grade: Consultant
- Speciality: Cardiology
- Location: London, UK
- Start Date: ASAP
- Duration: 6 months initially
- Rate: £80-120 per hour
- Requirements: GMC registration, CCT in Cardiology, 5+ years experience

The successful candidate will join our busy cardiology department and provide comprehensive cardiac care including interventional procedures.

Please submit suitable candidates urgently.

Best regards,
NHS Recruitment Team`,
        receivedDate: new Date().toISOString(),
        processed: false
      },
      {
        id: 'email_2',
        subject: 'Emergency Medicine Registrar - Manchester Royal Infirmary',
        from: 'hr@manchester.nhs.uk',
        to: 'jobs@your-agency.com',
        body: `Hello,

We need an Emergency Medicine Registrar for immediate start.

Details:
- Position: Emergency Medicine Registrar
- Grade: ST4-ST6
- Location: Manchester, UK
- Speciality: Emergency Medicine
- Rate: £45-55/hour
- Duration: 3 months
- Requirements: MRCP, Emergency Medicine experience, ACLS

Urgent requirement due to staff shortage.

Thanks,
Manchester Royal Infirmary`,
        receivedDate: new Date(Date.now() - 3600000).toISOString(),
        processed: false
      }
    ];

    return mockEmails.filter(email => this.isNHSEmail(email.from));
  }

  async parseJobFromEmail(email: EmailJob): Promise<Partial<Job>> {
    const prompt = `
      Extract job details from this NHS recruitment email. Return a JSON object with the following structure:
      {
        "title": "job title",
        "specialization": "medical specialization",
        "grade": "medical grade (e.g., Consultant, ST1-ST8, SHO, etc.)",
        "location": "location",
        "salary": "salary/rate information",
        "type": "permanent|contract|locum",
        "urgency": "high|medium|low",
        "requirements": ["requirement1", "requirement2"],
        "description": "brief description"
      }

      Email Subject: ${email.subject}
      Email Body: ${email.body}
      
      Focus on medical terminology and NHS grading systems. If urgency indicators like "urgent", "ASAP", "immediate" are present, set urgency to "high".
    `;

    try {
      const response = await this.openAI.parseJobEmail(prompt);
      return {
        ...response,
        client: this.extractClientFromEmail(email.from),
        source: 'email' as const,
        originalEmail: email,
        postedDate: email.receivedDate,
        status: 'open' as const
      };
    } catch (error) {
      console.error('Error parsing job email:', error);
      return this.fallbackJobParsing(email);
    }
  }

  private extractClientFromEmail(fromEmail: string): string {
    const domain = fromEmail.split('@')[1];
    if (domain.includes('nhs')) {
      // Extract hospital/trust name from domain
      const parts = domain.split('.');
      return parts[0].replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + ' NHS Trust';
    }
    return 'NHS Trust';
  }

  private fallbackJobParsing(email: EmailJob): Partial<Job> {
    // Basic parsing fallback
    const title = email.subject.replace(/^(urgent:|re:|fwd:)/i, '').trim();
    
    return {
      title,
      client: this.extractClientFromEmail(email.from),
      description: email.body.substring(0, 200) + '...',
      source: 'email' as const,
      originalEmail: email,
      postedDate: email.receivedDate,
      status: 'open' as const,
      urgency: email.subject.toLowerCase().includes('urgent') ? 'high' : 'medium'
    };
  }

  assignAgentToJob(job: Job, agents: RecruitmentAgent[]): RecruitmentAgent | null {
    // Filter agents by specialization
    let eligibleAgents = agents.filter(agent => 
      agent.isActive && 
      agent.specializations.some(spec => 
        spec.toLowerCase() === job.specialization?.toLowerCase()
      )
    );

    // If no exact specialization match, get general agents
    if (eligibleAgents.length === 0) {
      eligibleAgents = agents.filter(agent => 
        agent.isActive && 
        agent.specializations.includes('General')
      );
    }

    if (eligibleAgents.length === 0) return null;

    // Filter by grade if specified
    if (job.grade) {
      const gradeFilteredAgents = eligibleAgents.filter(agent =>
        agent.grades.includes(job.grade!)
      );
      if (gradeFilteredAgents.length > 0) {
        eligibleAgents = gradeFilteredAgents;
      }
    }

    // Sort by location proximity (simplified - in reality would use geolocation)
    const sortedAgents = eligibleAgents.sort((a, b) => {
      const aLocationMatch = a.locations.some(loc => 
        job.location?.toLowerCase().includes(loc.toLowerCase())
      );
      const bLocationMatch = b.locations.some(loc => 
        job.location?.toLowerCase().includes(loc.toLowerCase())
      );

      if (aLocationMatch && !bLocationMatch) return -1;
      if (!aLocationMatch && bLocationMatch) return 1;

      // If same location preference, sort by workload
      return a.workload - b.workload;
    });

    return sortedAgents[0];
  }

  async findMatchingCandidates(job: Job, candidates: any[]): Promise<CandidateMatch[]> {
    const matches: CandidateMatch[] = [];

    for (const candidate of candidates) {
      if (candidate.specialization === job.specialization && candidate.status === 'active') {
        try {
          const matchResult = await this.openAI.matchCandidateToJob(
            candidate.cvSummary || `${candidate.name} - ${candidate.specialization} with ${candidate.experience} years experience`,
            job.description || job.title
          );

          matches.push({
            candidateId: candidate.id,
            jobId: job.id,
            score: matchResult.score,
            reasoning: matchResult.reasoning,
            matchedSkills: matchResult.matchedSkills,
            gaps: matchResult.gaps,
            assignedAgent: job.assignedAgent,
            priority: matchResult.score >= 80 ? 'high' : matchResult.score >= 60 ? 'medium' : 'low'
          });
        } catch (error) {
          console.error('Error matching candidate to job:', error);
        }
      }
    }

    return matches.sort((a, b) => b.score - a.score);
  }

  async processEmailJobs(emails: EmailJob[], agents: RecruitmentAgent[], candidates: any[]): Promise<{
    jobs: Job[];
    matches: CandidateMatch[];
    notifications: Array<{ agentId: string; jobId: string; message: string; priority: string }>;
  }> {
    const jobs: Job[] = [];
    const allMatches: CandidateMatch[] = [];
    const notifications: Array<{ agentId: string; jobId: string; message: string; priority: string }> = [];

    for (const email of emails) {
      try {
        const jobData = await this.parseJobFromEmail(email);
        
        const job: Job = {
          id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: jobData.title || 'Untitled Position',
          client: jobData.client || 'NHS Trust',
          location: jobData.location || 'UK',
          type: jobData.type || 'contract',
          specialization: jobData.specialization || 'General',
          salary: jobData.salary || 'Competitive',
          description: jobData.description || email.body,
          requirements: jobData.requirements || [],
          postedDate: jobData.postedDate || email.receivedDate,
          status: 'open',
          urgency: jobData.urgency || 'medium',
          grade: jobData.grade,
          source: 'email',
          originalEmail: email
        };

        // Assign agent
        const assignedAgent = this.assignAgentToJob(job, agents);
        if (assignedAgent) {
          job.assignedAgent = assignedAgent.id;
        }

        // Find matching candidates
        const matches = await this.findMatchingCandidates(job, candidates);
        job.matchedCandidates = matches;
        allMatches.push(...matches);

        jobs.push(job);

        // Create notification for assigned agent
        if (assignedAgent && matches.length > 0) {
          const highPriorityMatches = matches.filter(m => m.priority === 'high').length;
          notifications.push({
            agentId: assignedAgent.id,
            jobId: job.id,
            message: `New ${job.urgency} priority job: ${job.title} with ${matches.length} candidate matches (${highPriorityMatches} high priority)`,
            priority: job.urgency
          });
        }

        // Mark email as processed
        email.processed = true;

      } catch (error) {
        console.error('Error processing email job:', error);
      }
    }

    return { jobs, matches: allMatches, notifications };
  }
}