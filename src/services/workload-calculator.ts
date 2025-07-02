import type { RecruitmentAgent, Job, Candidate, WorkloadCalculation } from '../types';

export class WorkloadCalculatorService {
  
  /**
   * Calculate comprehensive workload score for an agent
   */
  static calculateWorkload(
    agent: RecruitmentAgent, 
    assignedJobs: Job[], 
    managedCandidates: Candidate[]
  ): WorkloadCalculation {
    
    const weights = {
      activeJobs: 25,        // 25% weight
      candidatesManaged: 20, // 20% weight  
      urgentTasks: 30,       // 30% weight (highest priority)
      responseTime: 15,      // 15% weight
      capacity: 10           // 10% weight
    };

    // 1. Active Jobs Score (0-100)
    const activeJobsScore = Math.min(
      (assignedJobs.filter(job => job.status === 'open').length / agent.capacity.maxActiveJobs) * 100,
      100
    );

    // 2. Candidates Managed Score (0-100)
    const candidatesScore = Math.min(
      (managedCandidates.filter(c => c.status === 'active').length / agent.capacity.maxCandidates) * 100,
      100
    );

    // 3. Urgent Tasks Score (0-100)
    const urgentJobs = assignedJobs.filter(job => job.urgency === 'high' && job.status === 'open');
    const urgentScore = Math.min(urgentJobs.length * 20, 100); // Each urgent job = 20 points

    // 4. Response Time Score (0-100)
    const responseTimeScore = Math.min(
      (agent.metrics.avgResponseTime / 24) * 100, // 24 hours = 100%
      100
    );

    // 5. Calculate weighted total
    const totalScore = Math.round(
      (activeJobsScore * weights.activeJobs / 100) +
      (candidatesScore * weights.candidatesManaged / 100) +
      (urgentScore * weights.urgentTasks / 100) +
      (responseTimeScore * weights.responseTime / 100)
    );

    // Determine status and recommendation
    const { status, recommendation } = this.getWorkloadStatus(totalScore, agent);

    return {
      totalScore,
      breakdown: {
        activeJobs: Math.round(activeJobsScore),
        candidatesManaged: Math.round(candidatesScore),
        urgentTasks: Math.round(urgentScore),
        responseTime: Math.round(responseTimeScore)
      },
      status,
      recommendation
    };
  }

  /**
   * Determine workload status and recommendations
   */
  private static getWorkloadStatus(score: number, agent: RecruitmentAgent): {
    status: 'available' | 'moderate' | 'busy' | 'overloaded';
    recommendation: string;
  } {
    if (score >= 90) {
      return {
        status: 'overloaded',
        recommendation: `${agent.name} is overloaded. Consider redistributing urgent tasks or reducing new assignments.`
      };
    } else if (score >= 70) {
      return {
        status: 'busy',
        recommendation: `${agent.name} is at high capacity. Only assign urgent or high-priority tasks.`
      };
    } else if (score >= 40) {
      return {
        status: 'moderate',
        recommendation: `${agent.name} has moderate workload. Can take on new assignments.`
      };
    } else {
      return {
        status: 'available',
        recommendation: `${agent.name} has capacity for new assignments and urgent tasks.`
      };
    }
  }

  /**
   * Find the best agent for a new job based on workload and expertise
   */
  static findBestAgent(
    job: Job,
    agents: RecruitmentAgent[],
    allJobs: Job[],
    allCandidates: Candidate[]
  ): RecruitmentAgent | null {
    
    // Filter eligible agents
    const eligibleAgents = agents.filter(agent => {
      if (!agent.isActive) return false;
      
      // Check specialization match
      const hasSpecialization = agent.specializations.some(spec => 
        spec.toLowerCase() === job.specialization?.toLowerCase() ||
        spec.toLowerCase() === 'general'
      );
      
      // Check grade compatibility
      const hasGrade = !job.grade || agent.grades.includes(job.grade);
      
      // Check location (simplified - could use geolocation)
      const hasLocation = agent.locations.some(loc => 
        job.location?.toLowerCase().includes(loc.toLowerCase())
      );
      
      return hasSpecialization && hasGrade && (hasLocation || agent.locations.includes('Remote'));
    });

    if (eligibleAgents.length === 0) return null;

    // Calculate scores for each eligible agent
    const agentScores = eligibleAgents.map(agent => {
      const agentJobs = allJobs.filter(j => j.assignedAgent === agent.id);
      const agentCandidates = allCandidates.filter(c => c.assignedAgent === agent.id);
      
      const workloadCalc = this.calculateWorkload(agent, agentJobs, agentCandidates);
      
      // Scoring factors
      let score = 0;
      
      // 1. Workload availability (40% weight) - lower workload = higher score
      score += (100 - workloadCalc.totalScore) * 0.4;
      
      // 2. Specialization match (30% weight)
      const exactSpecMatch = agent.specializations.includes(job.specialization);
      score += exactSpecMatch ? 30 : 15;
      
      // 3. Location proximity (20% weight)
      const exactLocationMatch = agent.locations.some(loc => 
        job.location?.toLowerCase().includes(loc.toLowerCase())
      );
      score += exactLocationMatch ? 20 : 10;
      
      // 4. Urgency handling (10% weight)
      if (job.urgency === 'high' && agent.preferences.urgencyWeighting >= 7) {
        score += 10;
      }
      
      return { agent, score, workloadCalc };
    });

    // Sort by score (highest first) and return best agent
    agentScores.sort((a, b) => b.score - a.score);
    
    return agentScores[0]?.agent || null;
  }

  /**
   * Get workload distribution across all agents
   */
  static getTeamWorkloadDistribution(
    agents: RecruitmentAgent[],
    allJobs: Job[],
    allCandidates: Candidate[]
  ) {
    const distribution = agents.map(agent => {
      const agentJobs = allJobs.filter(j => j.assignedAgent === agent.id);
      const agentCandidates = allCandidates.filter(c => c.assignedAgent === agent.id);
      
      return {
        agent,
        workload: this.calculateWorkload(agent, agentJobs, agentCandidates),
        activeJobs: agentJobs.filter(j => j.status === 'open').length,
        activeCandidates: agentCandidates.filter(c => c.status === 'active').length
      };
    });

    const teamStats = {
      averageWorkload: Math.round(
        distribution.reduce((sum, d) => sum + d.workload.totalScore, 0) / distribution.length
      ),
      overloadedAgents: distribution.filter(d => d.workload.status === 'overloaded').length,
      availableAgents: distribution.filter(d => d.workload.status === 'available').length,
      totalActiveJobs: distribution.reduce((sum, d) => sum + d.activeJobs, 0),
      totalActiveCandidates: distribution.reduce((sum, d) => sum + d.activeCandidates, 0)
    };

    return { distribution, teamStats };
  }

  /**
   * Suggest workload rebalancing
   */
  static suggestRebalancing(
    agents: RecruitmentAgent[],
    allJobs: Job[],
    allCandidates: Candidate[]
  ): Array<{
    type: 'redistribute_job' | 'redistribute_candidate' | 'urgent_support';
    from: string;
    to: string;
    item: string;
    reason: string;
  }> {
    const suggestions: Array<{
      type: 'redistribute_job' | 'redistribute_candidate' | 'urgent_support';
      from: string;
      to: string;
      item: string;
      reason: string;
    }> = [];

    const { distribution } = this.getTeamWorkloadDistribution(agents, allJobs, allCandidates);
    
    const overloaded = distribution.filter(d => d.workload.status === 'overloaded');
    const available = distribution.filter(d => d.workload.status === 'available');

    // Suggest redistributions
    overloaded.forEach(overloadedAgent => {
      const agentJobs = allJobs.filter(j => 
        j.assignedAgent === overloadedAgent.agent.id && 
        j.status === 'open' && 
        j.urgency !== 'high'
      );

      agentJobs.slice(0, 2).forEach(job => {
        const suitableAgent = available.find(availAgent => 
          availAgent.agent.specializations.includes(job.specialization) ||
          availAgent.agent.specializations.includes('General')
        );

        if (suitableAgent) {
          suggestions.push({
            type: 'redistribute_job',
            from: overloadedAgent.agent.name,
            to: suitableAgent.agent.name,
            item: job.title,
            reason: `Rebalance workload - ${overloadedAgent.agent.name} is overloaded (${overloadedAgent.workload.totalScore}%)`
          });
        }
      });
    });

    return suggestions;
  }
}