import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging (only in development)
if (import.meta.env.DEV) {
  console.log('Environment variables check:');
  console.log('VITE_SUPABASE_URL:', supabaseUrl);
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'EXISTS' : 'MISSING');
}

// Check if we have valid environment variables
const hasValidEnvVars = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' && 
  supabaseAnonKey !== 'your-anon-key';

let supabase: any;
let supabaseHelpers: any;

if (!hasValidEnvVars) {
  console.warn('⚠️ Supabase environment variables not configured. Using mock data for development.');
  
  // Create mock client for development
  supabase = {
    auth: {
      signUp: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null }, error: null }),
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: { user: null }, error: null })
    },
    from: () => ({
      select: () => ({ order: () => ({ data: [], error: null }) }),
      insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
      update: () => ({ eq: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }) })
    }),
    channel: () => ({
      on: () => ({ subscribe: () => ({ data: null, error: null }) })
    })
  };
  
  supabaseHelpers = {
    async signUp() { return { data: { user: null }, error: null }; },
    async signIn() { return { data: { user: null }, error: null }; },
    async signOut() { return { error: null }; },
    async getCurrentUser() { return null; },
    async getAgents() { return { data: [], error: null }; },
    async getAgent() { return { data: null, error: null }; },
    async updateAgent() { return { data: null, error: null }; },
    async getCandidates() { return { data: [], error: null }; },
    async getCandidate() { return { data: null, error: null }; },
    async createCandidate() { return { data: null, error: null }; },
    async updateCandidate() { return { data: null, error: null }; },
    async getJobs() { return { data: [], error: null }; },
    async getJob() { return { data: null, error: null }; },
    async createJob() { return { data: null, error: null }; },
    async updateJob() { return { data: null, error: null }; },
    async getCandidateMatches() { return { data: [], error: null }; },
    async createCandidateMatch() { return { data: null, error: null }; },
    async getEmailJobs() { return { data: [], error: null }; },
    async createEmailJob() { return { data: null, error: null }; },
    async updateEmailJob() { return { data: null, error: null }; },
    async getDashboardStats() { return { candidates: [], jobs: [], matches: [] }; },
    subscribeToTable() { return { data: null, error: null }; }
  };
} else {
  // Create real Supabase client
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });

  // Helper functions for common operations
  supabaseHelpers = {
    // Authentication helpers
    async signUp(email: string, password: string) {
      return await supabase.auth.signUp({ email, password });
    },

    async signIn(email: string, password: string) {
      return await supabase.auth.signInWithPassword({ email, password });
    },

    async signOut() {
      return await supabase.auth.signOut();
    },

    async getCurrentUser() {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },

    // Recruitment Agents
    async getAgents() {
      return await supabase
        .from('recruitment_agents')
        .select('*')
        .order('name');
    },

    async getAgent(id: string) {
      return await supabase
        .from('recruitment_agents')
        .select('*')
        .eq('id', id)
        .single();
    },

    async updateAgent(id: string, updates: any) {
      return await supabase
        .from('recruitment_agents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    },

    // Candidates
    async getCandidates() {
      return await supabase
        .from('candidates')
        .select(`
          *,
          assigned_agent:recruitment_agents(name, email)
        `)
        .order('created_at', { ascending: false });
    },

    async getCandidate(id: string) {
      return await supabase
        .from('candidates')
        .select(`
          *,
          assigned_agent:recruitment_agents(name, email)
        `)
        .eq('id', id)
        .single();
    },

    async createCandidate(candidate: any) {
      return await supabase
        .from('candidates')
        .insert(candidate)
        .select()
        .single();
    },

    async updateCandidate(id: string, updates: any) {
      return await supabase
        .from('candidates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    },

    // Jobs
    async getJobs() {
      return await supabase
        .from('jobs')
        .select(`
          *,
          assigned_agent:recruitment_agents(name, email)
        `)
        .order('created_at', { ascending: false });
    },

    async getJob(id: string) {
      return await supabase
        .from('jobs')
        .select(`
          *,
          assigned_agent:recruitment_agents(name, email)
        `)
        .eq('id', id)
        .single();
    },

    async createJob(job: any) {
      return await supabase
        .from('jobs')
        .insert(job)
        .select()
        .single();
    },

    async updateJob(id: string, updates: any) {
      return await supabase
        .from('jobs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    },

    // Candidate Matches
    async getCandidateMatches() {
      return await supabase
        .from('candidate_matches')
        .select(`
          *,
          candidate:candidates(name, email, specialization),
          job:jobs(title, client, location),
          assigned_agent:recruitment_agents(name, email)
        `)
        .order('score', { ascending: false });
    },

    async createCandidateMatch(match: any) {
      return await supabase
        .from('candidate_matches')
        .insert(match)
        .select()
        .single();
    },

    // Email Jobs
    async getEmailJobs() {
      return await supabase
        .from('email_jobs')
        .select('*')
        .order('received_date', { ascending: false });
    },

    async createEmailJob(emailJob: any) {
      return await supabase
        .from('email_jobs')
        .insert(emailJob)
        .select()
        .single();
    },

    async updateEmailJob(id: string, updates: any) {
      return await supabase
        .from('email_jobs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    },

    // Dashboard queries
    async getDashboardStats() {
      const [candidatesResult, jobsResult, matchesResult] = await Promise.all([
        supabase.from('candidates').select('status'),
        supabase.from('jobs').select('status, urgency'),
        supabase.from('candidate_matches').select('score')
      ]);

      return {
        candidates: candidatesResult.data || [],
        jobs: jobsResult.data || [],
        matches: matchesResult.data || []
      };
    },

    // Real-time subscriptions
    subscribeToTable(table: string, callback: (payload: any) => void) {
      return supabase
        .channel(`${table}_changes`)
        .on('postgres_changes', 
          { event: '*', schema: 'public', table }, 
          callback
        )
        .subscribe();
    }
  };
}

export { supabase, supabaseHelpers };