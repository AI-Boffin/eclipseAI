/*
  # Seed Sample Data for Eclipse AI Assistant

  1. Sample Data
    - Insert sample recruitment agents
    - Insert sample candidates
    - Insert sample jobs
    - Insert sample candidate matches

  2. Notes
    - This provides realistic test data for development
    - All data follows the schema constraints
    - Includes various specializations and scenarios
*/

-- Insert sample recruitment agents
INSERT INTO recruitment_agents (
  name, email, specializations, grades, locations, is_active, workload_percentage,
  capacity, metrics, preferences
) VALUES 
(
  'Sarah Mitchell',
  'sarah.mitchell@eclipse-ai.com',
  ARRAY['Cardiology', 'General Medicine'],
  ARRAY['Consultant', 'ST4-ST8'],
  ARRAY['London', 'South East'],
  true,
  65,
  '{
    "maxActiveJobs": 15,
    "maxCandidates": 50,
    "hoursPerWeek": 40
  }'::jsonb,
  '{
    "activeJobs": 12,
    "candidatesManaged": 35,
    "emailsProcessed": 45,
    "placementsMade": 8,
    "avgResponseTime": 4.5,
    "weeklyHours": 38,
    "monthlyTargets": {
      "placements": 10,
      "interviews": 25,
      "newCandidates": 15
    },
    "performance": {
      "placementRate": 85,
      "candidateResponseRate": 78,
      "clientSatisfaction": 92
    }
  }'::jsonb,
  '{
    "urgencyWeighting": 8,
    "locationRadius": 50,
    "autoAssignment": true
  }'::jsonb
),
(
  'James Wilson',
  'james.wilson@eclipse-ai.com',
  ARRAY['Emergency Medicine', 'Acute Care'],
  ARRAY['ST1-ST8', 'SHO'],
  ARRAY['Manchester', 'North West'],
  true,
  45,
  '{
    "maxActiveJobs": 12,
    "maxCandidates": 40,
    "hoursPerWeek": 40
  }'::jsonb,
  '{
    "activeJobs": 8,
    "candidatesManaged": 22,
    "emailsProcessed": 32,
    "placementsMade": 6,
    "avgResponseTime": 3.2,
    "weeklyHours": 35,
    "monthlyTargets": {
      "placements": 8,
      "interviews": 20,
      "newCandidates": 12
    },
    "performance": {
      "placementRate": 90,
      "candidateResponseRate": 82,
      "clientSatisfaction": 88
    }
  }'::jsonb,
  '{
    "urgencyWeighting": 9,
    "locationRadius": 75,
    "autoAssignment": true
  }'::jsonb
),
(
  'Emma Thompson',
  'emma.thompson@eclipse-ai.com',
  ARRAY['Pediatrics', 'General'],
  ARRAY['Consultant', 'ST4-ST8'],
  ARRAY['Birmingham', 'Midlands'],
  true,
  70,
  '{
    "maxActiveJobs": 10,
    "maxCandidates": 35,
    "hoursPerWeek": 35
  }'::jsonb,
  '{
    "activeJobs": 9,
    "candidatesManaged": 28,
    "emailsProcessed": 38,
    "placementsMade": 7,
    "avgResponseTime": 6.1,
    "weeklyHours": 34,
    "monthlyTargets": {
      "placements": 9,
      "interviews": 22,
      "newCandidates": 10
    },
    "performance": {
      "placementRate": 82,
      "candidateResponseRate": 75,
      "clientSatisfaction": 95
    }
  }'::jsonb,
  '{
    "urgencyWeighting": 7,
    "locationRadius": 40,
    "autoAssignment": false
  }'::jsonb
),
(
  'David Chen',
  'david.chen@eclipse-ai.com',
  ARRAY['Radiology', 'Imaging'],
  ARRAY['Consultant', 'ST3-ST8'],
  ARRAY['Edinburgh', 'Scotland'],
  false,
  0,
  '{
    "maxActiveJobs": 8,
    "maxCandidates": 25,
    "hoursPerWeek": 30
  }'::jsonb,
  '{
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
  '{
    "urgencyWeighting": 5,
    "locationRadius": 30,
    "autoAssignment": false
  }'::jsonb
);

-- Insert sample candidates
INSERT INTO candidates (
  name, email, phone, specialization, experience_years, location, cv_summary,
  status, compliance, grade, assigned_agent_id
) VALUES 
(
  'Dr. Sarah Johnson',
  'sarah.johnson@email.com',
  '+44 7700 900123',
  'Cardiology',
  8,
  'London, UK',
  '• Experienced Cardiologist with 8 years in interventional cardiology
• Specialized in complex cardiac procedures and heart failure management
• Published researcher with strong academic background',
  'active',
  '{
    "dbs": true,
    "rightToWork": true,
    "registration": true
  }'::jsonb,
  'Consultant',
  (SELECT id FROM recruitment_agents WHERE email = 'sarah.mitchell@eclipse-ai.com')
),
(
  'Dr. Michael Chen',
  'michael.chen@email.com',
  '+44 7700 900124',
  'Emergency Medicine',
  12,
  'Manchester, UK',
  '• Senior Emergency Medicine physician with 12 years experience
• Expertise in trauma care and critical emergency procedures
• Leadership experience in busy A&E departments',
  'active',
  '{
    "dbs": true,
    "rightToWork": true,
    "registration": false
  }'::jsonb,
  'Consultant',
  (SELECT id FROM recruitment_agents WHERE email = 'james.wilson@eclipse-ai.com')
),
(
  'Dr. Emma Williams',
  'emma.williams@email.com',
  '+44 7700 900125',
  'Pediatrics',
  6,
  'Birmingham, UK',
  '• Pediatric specialist with 6 years in children\'s healthcare
• Experience in neonatal care and pediatric emergency medicine
• Strong communication skills with children and families',
  'placed',
  '{
    "dbs": true,
    "rightToWork": true,
    "registration": true
  }'::jsonb,
  'ST6',
  (SELECT id FROM recruitment_agents WHERE email = 'emma.thompson@eclipse-ai.com')
),
(
  'Dr. Robert Taylor',
  'robert.taylor@email.com',
  '+44 7700 900126',
  'General Medicine',
  4,
  'Leeds, UK',
  '• General Medicine registrar with 4 years NHS experience
• Strong foundation in internal medicine and patient care
• Excellent diagnostic skills and clinical reasoning',
  'active',
  '{
    "dbs": true,
    "rightToWork": true,
    "registration": true
  }'::jsonb,
  'ST4',
  (SELECT id FROM recruitment_agents WHERE email = 'sarah.mitchell@eclipse-ai.com')
),
(
  'Dr. Lisa Anderson',
  'lisa.anderson@email.com',
  '+44 7700 900127',
  'Radiology',
  10,
  'Edinburgh, UK',
  '• Consultant Radiologist with 10 years imaging experience
• Specialized in CT, MRI, and interventional radiology
• Research background in medical imaging technology',
  'active',
  '{
    "dbs": false,
    "rightToWork": true,
    "registration": true
  }'::jsonb,
  'Consultant',
  NULL
);

-- Insert sample jobs
INSERT INTO jobs (
  title, client, location, type, specialization, salary, description,
  requirements, status, urgency, grade, source, assigned_agent_id
) VALUES 
(
  'Consultant Cardiologist',
  'Royal London Hospital',
  'London, UK',
  'permanent',
  'Cardiology',
  '£80,000 - £120,000',
  'We are seeking an experienced Consultant Cardiologist to join our dynamic team. The successful candidate will provide comprehensive cardiac care including diagnostic procedures, interventional cardiology, and patient management.',
  ARRAY['GMC Registration', 'CCT in Cardiology', '5+ years experience', 'Interventional cardiology experience preferred'],
  'open',
  'high',
  'Consultant',
  'manual',
  (SELECT id FROM recruitment_agents WHERE email = 'sarah.mitchell@eclipse-ai.com')
),
(
  'Emergency Medicine Registrar',
  'Manchester Royal Infirmary',
  'Manchester, UK',
  'contract',
  'Emergency Medicine',
  '£45,000 - £55,000',
  'Locum Emergency Medicine Registrar position available for immediate start. Experience in acute care and emergency procedures essential.',
  ARRAY['GMC Registration', 'MRCP or equivalent', 'Emergency medicine experience', 'ACLS certification'],
  'open',
  'medium',
  'ST4-ST6',
  'email',
  (SELECT id FROM recruitment_agents WHERE email = 'james.wilson@eclipse-ai.com')
),
(
  'Pediatric Consultant',
  'Birmingham Children''s Hospital',
  'Birmingham, UK',
  'permanent',
  'Pediatrics',
  '£75,000 - £95,000',
  'Join our pediatric team as a Consultant Pediatrician. You will be responsible for providing high-quality care to children and adolescents.',
  ARRAY['GMC Registration', 'CCT in Pediatrics', 'Child protection training', 'Research experience preferred'],
  'filled',
  'low',
  'Consultant',
  'manual',
  (SELECT id FROM recruitment_agents WHERE email = 'emma.thompson@eclipse-ai.com')
),
(
  'Radiology Consultant',
  'Edinburgh Royal Infirmary',
  'Edinburgh, UK',
  'locum',
  'Radiology',
  '£70 - £90 per hour',
  'Urgent requirement for Consultant Radiologist to cover imaging services. Experience in CT and MRI essential.',
  ARRAY['GMC Registration', 'CCT in Radiology', 'CT/MRI experience', 'Immediate availability'],
  'open',
  'high',
  'Consultant',
  'email',
  NULL
);

-- Insert sample candidate matches
INSERT INTO candidate_matches (
  candidate_id, job_id, score, reasoning, matched_skills, gaps, priority, assigned_agent_id
) VALUES 
(
  (SELECT id FROM candidates WHERE email = 'sarah.johnson@email.com'),
  (SELECT id FROM jobs WHERE title = 'Consultant Cardiologist'),
  92,
  'Excellent match with strong cardiology background and relevant experience. Perfect specialization alignment.',
  ARRAY['Cardiology', 'Clinical Experience', 'GMC Registration', 'Interventional Experience'],
  ARRAY['Specific hospital system experience'],
  'high',
  (SELECT id FROM recruitment_agents WHERE email = 'sarah.mitchell@eclipse-ai.com')
),
(
  (SELECT id FROM candidates WHERE email = 'michael.chen@email.com'),
  (SELECT id FROM jobs WHERE title = 'Emergency Medicine Registrar'),
  88,
  'Strong emergency medicine background with extensive experience. Good fit for registrar position.',
  ARRAY['Emergency Medicine', 'ACLS', 'Trauma Care', 'GMC Registration'],
  ARRAY['Specific trust protocols'],
  'high',
  (SELECT id FROM recruitment_agents WHERE email = 'james.wilson@eclipse-ai.com')
),
(
  (SELECT id FROM candidates WHERE email = 'lisa.anderson@email.com'),
  (SELECT id FROM jobs WHERE title = 'Radiology Consultant'),
  85,
  'Excellent radiology experience with CT/MRI expertise. Location match with Edinburgh.',
  ARRAY['Radiology', 'CT Experience', 'MRI Experience', 'Consultant Level'],
  ARRAY['DBS Check required'],
  'medium',
  NULL
);