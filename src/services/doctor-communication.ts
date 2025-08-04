import { SendGridService } from './sendgrid';
import { OpenAIService } from './openai';
import type { Candidate, Job, EmailTemplate, ComplianceDocument } from '../types';

export interface DoctorEmail {
  id: string;
  candidateId: string;
  jobId: string;
  type: 'job_opportunity' | 'compliance_request' | 'interview_invitation';
  subject: string;
  body: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'sent' | 'rejected';
  aiGenerated: boolean;
  agentApproved?: boolean;
  agentNotes?: string;
  sentAt?: string;
  responseReceived?: boolean;
  responseContent?: string;
  createdAt: string;
}

export interface ComplianceDocument {
  id: string;
  name: string;
  description: string;
  required: boolean;
  category: 'identity' | 'qualifications' | 'registration' | 'background' | 'health';
  template?: string;
}

export class DoctorCommunicationService {
  private sendGrid: SendGridService;
  private openAI: OpenAIService;

  constructor(sendGridApiKey: string, openAIKey: string) {
    this.sendGrid = new SendGridService(sendGridApiKey);
    this.openAI = new OpenAIService(openAIKey);
  }

  // Generate job opportunity email using AI
  async generateJobOpportunityEmail(
    candidate: Candidate,
    job: Job,
    agentName: string
  ): Promise<{ subject: string; body: string }> {
    const prompt = `
      Generate a professional job opportunity email for a medical professional.
      
      Candidate: ${candidate.name} - ${candidate.specialization} specialist with ${candidate.experience} years experience
      Job: ${job.title} at ${job.client} in ${job.location}
      Salary: ${job.salary}
      Requirements: ${job.requirements.join(', ')}
      
      The email should:
      1. Be professional and personalized
      2. Highlight why this job matches their profile
      3. Include key job details (location, salary, requirements)
      4. Have a clear call-to-action
      5. Be from the recruitment agent: ${agentName}
      
      Return JSON with "subject" and "body" fields.
    `;

    try {
      const response = await this.openAI.generateEmail(prompt);
      return {
        subject: response.subject,
        body: response.body
      };
    } catch (error) {
      console.error('Error generating job email:', error);
      return this.fallbackJobEmail(candidate, job, agentName);
    }
  }

  // Generate compliance paperwork request
  async generateComplianceRequestEmail(
    candidate: Candidate,
    missingCompliance: string[]
  ): Promise<{ subject: string; body: string }> {
    const prompt = `
      Generate a professional email requesting compliance paperwork from a medical professional.
      
      Candidate: ${candidate.name}
      Missing compliance documents: ${missingCompliance.join(', ')}
      
      The email should:
      1. Be professional and clear
      2. Explain why these documents are needed
      3. Provide clear instructions on how to submit
      4. Include deadline if applicable
      5. Be supportive and helpful
      
      Return JSON with "subject" and "body" fields.
    `;

    try {
      const response = await this.openAI.generateEmail(prompt);
      return {
        subject: response.subject,
        body: response.body
      };
    } catch (error) {
      console.error('Error generating compliance email:', error);
      return this.fallbackComplianceEmail(candidate, missingCompliance);
    }
  }

  // Generate AI response to doctor's reply
  async generateResponseToDoctor(
    doctorEmail: string,
    originalEmail: DoctorEmail,
    doctorResponse: string
  ): Promise<{ subject: string; body: string; confidence: number }> {
    const prompt = `
      Generate a professional response to a doctor's email reply.
      
      Original email context: ${originalEmail.body}
      Doctor's response: ${doctorResponse}
      
      The response should:
      1. Be professional and helpful
      2. Address any questions or concerns
      3. Provide next steps if needed
      4. Maintain the relationship
      
      Return JSON with "subject", "body", and "confidence" (0-100) fields.
    `;

    try {
      const response = await this.openAI.generateResponse(prompt);
      return {
        subject: response.subject,
        body: response.body,
        confidence: response.confidence || 75
      };
    } catch (error) {
      console.error('Error generating response:', error);
      return this.fallbackResponse(doctorResponse);
    }
  }

  // Send email to doctor
  async sendEmailToDoctor(
    to: string,
    subject: string,
    body: string,
    agentName: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const htmlBody = this.convertToHTML(body);
    
    try {
      const result = await this.sendGrid.sendEmail(
        to,
        subject,
        htmlBody,
        body
      );
      
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }
  }

  // Get compliance documents needed for a job
  getRequiredComplianceDocuments(job: Job): ComplianceDocument[] {
    const baseDocuments: ComplianceDocument[] = [
      {
        id: 'dbs',
        name: 'DBS Check',
        description: 'Disclosure and Barring Service check',
        required: true,
        category: 'background'
      },
      {
        id: 'right_to_work',
        name: 'Right to Work',
        description: 'Proof of right to work in the UK',
        required: true,
        category: 'identity'
      },
      {
        id: 'gmc_registration',
        name: 'GMC Registration',
        description: 'General Medical Council registration',
        required: true,
        category: 'registration'
      },
      {
        id: 'cv',
        name: 'Updated CV',
        description: 'Current curriculum vitae',
        required: true,
        category: 'qualifications'
      },
      {
        id: 'references',
        name: 'Professional References',
        description: 'Two professional references',
        required: true,
        category: 'qualifications'
      }
    ];

    // Add job-specific requirements
    if (job.requirements.includes('ACLS')) {
      baseDocuments.push({
        id: 'acls',
        name: 'ACLS Certification',
        description: 'Advanced Cardiovascular Life Support certification',
        required: true,
        category: 'qualifications'
      });
    }

    if (job.requirements.includes('MRCP')) {
      baseDocuments.push({
        id: 'mrcp',
        name: 'MRCP Certificate',
        description: 'Membership of the Royal Colleges of Physicians',
        required: true,
        category: 'qualifications'
      });
    }

    return baseDocuments;
  }

  // Check what compliance documents are missing for a candidate
  getMissingComplianceDocuments(
    candidate: Candidate,
    requiredDocuments: ComplianceDocument[]
  ): ComplianceDocument[] {
    const missing: ComplianceDocument[] = [];

    for (const doc of requiredDocuments) {
      if (doc.id === 'dbs' && !candidate.compliance.dbs) {
        missing.push(doc);
      } else if (doc.id === 'right_to_work' && !candidate.compliance.rightToWork) {
        missing.push(doc);
      } else if (doc.id === 'gmc_registration' && !candidate.compliance.registration) {
        missing.push(doc);
      } else if (!['dbs', 'right_to_work', 'gmc_registration'].includes(doc.id)) {
        // For other documents, assume missing if not explicitly tracked
        missing.push(doc);
      }
    }

    return missing;
  }

  private convertToHTML(text: string): string {
    return text
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^(.*)$/, '<p>$1</p>');
  }

  private fallbackJobEmail(
    candidate: Candidate,
    job: Job,
    agentName: string
  ): { subject: string; body: string } {
    return {
      subject: `Exciting ${job.specialization} Opportunity at ${job.client}`,
      body: `Dear ${candidate.name},

I hope this email finds you well. I'm reaching out because I believe you would be an excellent fit for a ${job.specialization} position we have available.

Position: ${job.title}
Location: ${job.location}
Salary: ${job.salary}
Type: ${job.type}

This role at ${job.client} offers an exciting opportunity to work in a dynamic healthcare environment. Given your ${candidate.experience} years of experience in ${candidate.specialization}, I believe this position aligns perfectly with your expertise.

Key requirements include:
${job.requirements.map(req => `• ${req}`).join('\n')}

Would you be interested in learning more about this opportunity? I'd be happy to discuss the details and answer any questions you might have.

Best regards,
${agentName}
Recruitment Consultant`
    };
  }

  private fallbackComplianceEmail(
    candidate: Candidate,
    missingCompliance: string[]
  ): { subject: string; body: string } {
    return {
      subject: 'Compliance Documentation Required',
      body: `Dear ${candidate.name},

Thank you for your interest in our opportunities. To proceed with your application, we need to collect some additional compliance documentation.

Missing documents:
${missingCompliance.map(doc => `• ${doc}`).join('\n')}

Please provide these documents at your earliest convenience. You can upload them through our secure portal or email them directly to me.

If you have any questions about the required documentation, please don't hesitate to reach out.

Best regards,
Your Recruitment Team`
    };
  }

  private fallbackResponse(doctorResponse: string): { subject: string; body: string; confidence: number } {
    return {
      subject: 'Re: Your Response',
      body: `Thank you for your response. I've noted your feedback and will follow up accordingly.

If you have any additional questions or need further assistance, please don't hesitate to reach out.

Best regards,
Your Recruitment Team`,
      confidence: 60
    };
  }
} 