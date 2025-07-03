export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      recruitment_agents: {
        Row: {
          id: string
          name: string
          email: string
          specializations: string[]
          grades: string[]
          locations: string[]
          is_active: boolean
          workload_percentage: number
          capacity: Json
          metrics: Json
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          specializations?: string[]
          grades?: string[]
          locations?: string[]
          is_active?: boolean
          workload_percentage?: number
          capacity?: Json
          metrics?: Json
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          specializations?: string[]
          grades?: string[]
          locations?: string[]
          is_active?: boolean
          workload_percentage?: number
          capacity?: Json
          metrics?: Json
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      candidates: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          specialization: string
          experience_years: number
          location: string | null
          cv_summary: string | null
          status: string
          compliance: Json
          grade: string | null
          assigned_agent_id: string | null
          last_active: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          specialization: string
          experience_years?: number
          location?: string | null
          cv_summary?: string | null
          status?: string
          compliance?: Json
          grade?: string | null
          assigned_agent_id?: string | null
          last_active?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          specialization?: string
          experience_years?: number
          location?: string | null
          cv_summary?: string | null
          status?: string
          compliance?: Json
          grade?: string | null
          assigned_agent_id?: string | null
          last_active?: string
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          title: string
          client: string
          location: string
          type: string
          specialization: string
          salary: string | null
          description: string | null
          requirements: string[]
          status: string
          urgency: string
          grade: string | null
          source: string
          assigned_agent_id: string | null
          posted_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          client: string
          location: string
          type?: string
          specialization: string
          salary?: string | null
          description?: string | null
          requirements?: string[]
          status?: string
          urgency?: string
          grade?: string | null
          source?: string
          assigned_agent_id?: string | null
          posted_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          client?: string
          location?: string
          type?: string
          specialization?: string
          salary?: string | null
          description?: string | null
          requirements?: string[]
          status?: string
          urgency?: string
          grade?: string | null
          source?: string
          assigned_agent_id?: string | null
          posted_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      email_jobs: {
        Row: {
          id: string
          subject: string
          from_email: string
          to_email: string
          body: string
          received_date: string
          processed: boolean
          job_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          subject: string
          from_email: string
          to_email: string
          body: string
          received_date?: string
          processed?: boolean
          job_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          subject?: string
          from_email?: string
          to_email?: string
          body?: string
          received_date?: string
          processed?: boolean
          job_id?: string | null
          created_at?: string
        }
      }
      candidate_matches: {
        Row: {
          id: string
          candidate_id: string
          job_id: string
          score: number
          reasoning: string | null
          matched_skills: string[]
          gaps: string[]
          priority: string
          assigned_agent_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          candidate_id: string
          job_id: string
          score: number
          reasoning?: string | null
          matched_skills?: string[]
          gaps?: string[]
          priority?: string
          assigned_agent_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          candidate_id?: string
          job_id?: string
          score?: number
          reasoning?: string | null
          matched_skills?: string[]
          gaps?: string[]
          priority?: string
          assigned_agent_id?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}