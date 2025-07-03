/*
  # Initial Schema for Eclipse AI Assistant

  1. New Tables
    - `recruitment_agents`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `specializations` (text array)
      - `grades` (text array)
      - `locations` (text array)
      - `is_active` (boolean)
      - `workload_percentage` (integer)
      - `capacity` (jsonb)
      - `metrics` (jsonb)
      - `preferences` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `candidates`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `specialization` (text)
      - `experience_years` (integer)
      - `location` (text)
      - `cv_summary` (text)
      - `status` (text)
      - `compliance` (jsonb)
      - `grade` (text)
      - `assigned_agent_id` (uuid, foreign key)
      - `last_active` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `jobs`
      - `id` (uuid, primary key)
      - `title` (text)
      - `client` (text)
      - `location` (text)
      - `type` (text)
      - `specialization` (text)
      - `salary` (text)
      - `description` (text)
      - `requirements` (text array)
      - `status` (text)
      - `urgency` (text)
      - `grade` (text)
      - `source` (text)
      - `assigned_agent_id` (uuid, foreign key)
      - `posted_date` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `email_jobs`
      - `id` (uuid, primary key)
      - `subject` (text)
      - `from_email` (text)
      - `to_email` (text)
      - `body` (text)
      - `received_date` (timestamp)
      - `processed` (boolean)
      - `job_id` (uuid, foreign key)
      - `created_at` (timestamp)

    - `candidate_matches`
      - `id` (uuid, primary key)
      - `candidate_id` (uuid, foreign key)
      - `job_id` (uuid, foreign key)
      - `score` (integer)
      - `reasoning` (text)
      - `matched_skills` (text array)
      - `gaps` (text array)
      - `priority` (text)
      - `assigned_agent_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data
    - Add policies for agents to access their assigned candidates/jobs
*/

-- Create recruitment_agents table
CREATE TABLE IF NOT EXISTS recruitment_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  specializations text[] DEFAULT '{}',
  grades text[] DEFAULT '{}',
  locations text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  workload_percentage integer DEFAULT 0 CHECK (workload_percentage >= 0 AND workload_percentage <= 100),
  capacity jsonb DEFAULT '{
    "maxActiveJobs": 15,
    "maxCandidates": 50,
    "hoursPerWeek": 40
  }'::jsonb,
  metrics jsonb DEFAULT '{
    "activeJobs": 0,
    "candidatesManaged": 0,
    "emailsProcessed": 0,
    "placementsMade": 0,
    "avgResponseTime": 0,
    "weeklyHours": 0,
    "monthlyTargets": {
      "placements": 0,
      "interviews": 0,
      "newCandidates": 0
    },
    "performance": {
      "placementRate": 0,
      "candidateResponseRate": 0,
      "clientSatisfaction": 0
    }
  }'::jsonb,
  preferences jsonb DEFAULT '{
    "urgencyWeighting": 5,
    "locationRadius": 50,
    "autoAssignment": true
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  specialization text NOT NULL,
  experience_years integer DEFAULT 0,
  location text,
  cv_summary text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'placed')),
  compliance jsonb DEFAULT '{
    "dbs": false,
    "rightToWork": false,
    "registration": false
  }'::jsonb,
  grade text,
  assigned_agent_id uuid REFERENCES recruitment_agents(id),
  last_active timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  client text NOT NULL,
  location text NOT NULL,
  type text DEFAULT 'contract' CHECK (type IN ('permanent', 'contract', 'locum')),
  specialization text NOT NULL,
  salary text,
  description text,
  requirements text[] DEFAULT '{}',
  status text DEFAULT 'open' CHECK (status IN ('open', 'filled', 'closed')),
  urgency text DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high')),
  grade text,
  source text DEFAULT 'manual' CHECK (source IN ('manual', 'email', 'eclipse')),
  assigned_agent_id uuid REFERENCES recruitment_agents(id),
  posted_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create email_jobs table
CREATE TABLE IF NOT EXISTS email_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  from_email text NOT NULL,
  to_email text NOT NULL,
  body text NOT NULL,
  received_date timestamptz DEFAULT now(),
  processed boolean DEFAULT false,
  job_id uuid REFERENCES jobs(id),
  created_at timestamptz DEFAULT now()
);

-- Create candidate_matches table
CREATE TABLE IF NOT EXISTS candidate_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  reasoning text,
  matched_skills text[] DEFAULT '{}',
  gaps text[] DEFAULT '{}',
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  assigned_agent_id uuid REFERENCES recruitment_agents(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(candidate_id, job_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_candidates_specialization ON candidates(specialization);
CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(status);
CREATE INDEX IF NOT EXISTS idx_candidates_assigned_agent ON candidates(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_jobs_specialization ON jobs(specialization);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_urgency ON jobs(urgency);
CREATE INDEX IF NOT EXISTS idx_jobs_assigned_agent ON jobs(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_candidate_matches_score ON candidate_matches(score DESC);
CREATE INDEX IF NOT EXISTS idx_email_jobs_processed ON email_jobs(processed);

-- Enable Row Level Security
ALTER TABLE recruitment_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_matches ENABLE ROW LEVEL SECURITY;

-- Create policies for recruitment_agents
CREATE POLICY "Agents can read all agent data"
  ON recruitment_agents
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Agents can update their own data"
  ON recruitment_agents
  FOR UPDATE
  TO authenticated
  USING (auth.email() = email);

-- Create policies for candidates
CREATE POLICY "Agents can read all candidates"
  ON candidates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Agents can update candidates they manage"
  ON candidates
  FOR UPDATE
  TO authenticated
  USING (
    assigned_agent_id IN (
      SELECT id FROM recruitment_agents WHERE email = auth.email()
    )
  );

CREATE POLICY "Agents can insert new candidates"
  ON candidates
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for jobs
CREATE POLICY "Agents can read all jobs"
  ON jobs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Agents can update jobs they manage"
  ON jobs
  FOR UPDATE
  TO authenticated
  USING (
    assigned_agent_id IN (
      SELECT id FROM recruitment_agents WHERE email = auth.email()
    )
  );

CREATE POLICY "Agents can insert new jobs"
  ON jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for email_jobs
CREATE POLICY "Agents can read all email jobs"
  ON email_jobs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Agents can insert email jobs"
  ON email_jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Agents can update email jobs"
  ON email_jobs
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for candidate_matches
CREATE POLICY "Agents can read all matches"
  ON candidate_matches
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Agents can insert matches"
  ON candidate_matches
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Agents can update matches they manage"
  ON candidate_matches
  FOR UPDATE
  TO authenticated
  USING (
    assigned_agent_id IN (
      SELECT id FROM recruitment_agents WHERE email = auth.email()
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_recruitment_agents_updated_at
  BEFORE UPDATE ON recruitment_agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at
  BEFORE UPDATE ON candidates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();