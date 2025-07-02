export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: number;
  location: string;
  cvSummary?: string;
  lastActive: string;
  status: 'active' | 'inactive' | 'placed';
  compliance: {
    dbs: boolean;
    rightToWork: boolean;
    registration: boolean;
  };
  grade?: string;
  assignedAgent?: string;
}

export interface Job {
  id: string;
  title: string;
  client: string;
  location: string;
  type: 'permanent' | 'contract' | 'locum';
  specialization: string;
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
  status: 'open' | 'filled' | 'closed';
  urgency: 'low' | 'medium' | 'high';
  grade?: string;
  source: 'manual' | 'email' | 'eclipse';
  originalEmail?: EmailJob;
  assignedAgent?: string;
  matchedCandidates?: CandidateMatch[];
}

export interface EmailJob {
  id: string;
  subject: string;
  from: string;
  to: string;
  body: string;
  receivedDate: string;
  processed: boolean;
  extractedJob?: Partial<Job>;
}

export interface WorkloadMetrics {
  activeJobs: number;
  candidatesManaged: number;
  emailsProcessed: number;
  placementsMade: number;
  avgResponseTime: number; // hours
  lastActivity: string;
  weeklyHours: number;
  monthlyTargets: {
    placements: number;
    interviews: number;
    newCandidates: number;
  };
  performance: {
    placementRate: number; // percentage
    candidateResponseRate: number;
    clientSatisfaction: number;
  };
}

export interface RecruitmentAgent {
  id: string;
  name: string;
  email: string;
  specializations: string[];
  grades: string[];
  locations: string[];
  isActive: boolean;
  workload: number; // 0-100 percentage
  capacity: {
    maxActiveJobs: number;
    maxCandidates: number;
    hoursPerWeek: number;
  };
  metrics: WorkloadMetrics;
  preferences: {
    urgencyWeighting: number; // 1-10 scale
    locationRadius: number; // miles
    autoAssignment: boolean;
  };
}

export interface CandidateMatch {
  candidateId: string;
  jobId: string;
  score: number;
  reasoning: string;
  matchedSkills: string[];
  gaps: string[];
  assignedAgent?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ApiKeys {
  openai: string;
  eclipseClientId: string;
  eclipseClientSecret: string;
  sendgrid: string;
  emailHost: string;
  emailPort: string;
  emailUser: string;
  emailPassword: string;
}

export interface EmailTemplate {
  subject: string;
  body: string;
  type: 'outreach' | 'interview' | 'placement';
}

export interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  tls: boolean;
  checkInterval: number; // minutes
  nhsDomains: string[];
}

export interface WorkloadCalculation {
  totalScore: number;
  breakdown: {
    activeJobs: number;
    candidatesManaged: number;
    urgentTasks: number;
    responseTime: number;
  };
  status: 'available' | 'moderate' | 'busy' | 'overloaded';
  recommendation: string;
}