# Eclipse AI - Medical Recruitment Assistant

A comprehensive AI-powered medical recruitment platform that automates email processing, candidate matching, and communication workflows.

## 🚀 Features

### Core Functionality
- **Email Job Processing**: Automatically extracts job details from NHS recruitment emails
- **AI-Powered Candidate Matching**: Matches candidates to jobs using advanced AI algorithms
- **Agent Assignment**: Intelligently assigns jobs to recruitment agents based on specializations
- **Compliance Management**: Tracks and requests required compliance documents
- **Email Approval System**: AI-generated emails require agent approval before sending
- **Response Management**: AI generates responses to doctor replies for agent review

### Key Workflows

#### 1. Email Job Processing
- Monitors NHS email accounts for job opportunities
- Uses AI to extract job details (title, location, requirements, urgency)
- Automatically assigns jobs to appropriate recruitment agents
- Matches candidates to jobs based on specialization and experience

#### 2. Doctor Communication
- **Job Opportunities**: AI generates personalized job opportunity emails
- **Compliance Requests**: Automatically identifies missing compliance documents and sends requests
- **Response Management**: AI creates responses to doctor replies for agent approval

#### 3. Agent Approval System
- All AI-generated emails require agent approval before sending
- Agents can edit, approve, or reject emails
- Full audit trail of all communications
- Confidence scoring for AI responses

#### 4. Compliance Tracking
- Tracks DBS checks, right to work, GMC registration
- Identifies missing compliance documents for specific jobs
- Sends automated compliance requests to candidates
- Updates candidate profiles when compliance is received

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key
- SendGrid API key (for email sending)

### 1. Clone and Install
```bash
git clone <repository-url>
cd eclipseAI
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key

# SendGrid Configuration
VITE_SENDGRID_API_KEY=your_sendgrid_api_key

# Email Configuration
VITE_EMAIL_HOST=imap.gmail.com
VITE_EMAIL_PORT=993
VITE_EMAIL_USER=your_email@domain.com
VITE_EMAIL_PASSWORD=your_app_password
```

### 3. Database Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your_project_ref

# Run migrations
supabase db push
```

### 4. Start Development Server
```bash
npm run dev
```

## 📋 Complete Workflow

### Step 1: Email Processing
1. **Fetch Emails**: System monitors NHS email accounts for job opportunities
2. **AI Extraction**: Uses OpenAI to extract job details from email content
3. **Job Creation**: Creates job records in the database
4. **Agent Assignment**: Automatically assigns jobs to appropriate agents

### Step 2: Candidate Matching
1. **AI Matching**: Uses candidate profiles and job requirements for matching
2. **Score Generation**: Provides match scores and reasoning
3. **Priority Assignment**: Assigns priority levels based on match quality

### Step 3: Communication Workflow
1. **Email Generation**: AI creates personalized emails for candidates
2. **Agent Review**: All emails go to approval queue for agent review
3. **Approval Process**: Agents can edit, approve, or reject emails
4. **Email Sending**: Approved emails are sent via SendGrid

### Step 4: Compliance Management
1. **Document Tracking**: System tracks compliance status for each candidate
2. **Missing Documents**: Identifies missing compliance for specific jobs
3. **Request Generation**: AI creates compliance request emails
4. **Status Updates**: Updates candidate profiles when documents are received

### Step 5: Response Management
1. **Doctor Replies**: System monitors for responses from doctors
2. **AI Response**: AI generates appropriate responses to doctor replies
3. **Agent Approval**: All AI responses require agent approval
4. **Confidence Scoring**: AI provides confidence scores for responses

## 🔧 Configuration

### Email Integration
- Configure IMAP settings for NHS email monitoring
- Set up SendGrid for outgoing emails
- Configure email templates and signatures

### AI Configuration
- OpenAI API key for email generation and parsing
- Adjust temperature and token limits for different use cases
- Configure fallback responses for API failures

### Agent Settings
- Set agent specializations and locations
- Configure workload limits and preferences
- Define approval workflows and notifications

## 📊 Database Schema

### Core Tables
- `recruitment_agents`: Agent profiles and specializations
- `candidates`: Doctor profiles and compliance status
- `jobs`: Job opportunities from emails
- `email_jobs`: Processed email records
- `candidate_matches`: AI-generated job-candidate matches
- `doctor_emails`: Communication history and approval status

### Key Relationships
- Jobs are assigned to agents based on specializations
- Candidates are matched to jobs using AI algorithms
- All communications require agent approval
- Compliance status is tracked per candidate

## 🚀 Deployment

### Production Setup
1. **Environment Variables**: Configure all API keys and database connections
2. **Email Configuration**: Set up production email accounts
3. **Database**: Run migrations on production database
4. **Build**: `npm run build`
5. **Deploy**: Deploy to your preferred hosting platform

### Monitoring
- Email processing status
- AI response quality metrics
- Agent approval times
- Compliance document tracking
- System performance metrics

## 🔒 Security

- All emails require agent approval before sending
- Sensitive data is encrypted in transit and at rest
- Row-level security enabled on all database tables
- Audit trails for all communications
- API key management and rotation

## 📈 Performance

- Optimized database queries with proper indexing
- Caching for frequently accessed data
- Background processing for email monitoring
- Rate limiting for API calls
- Error handling and fallback mechanisms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the database schema
- Test with the provided sample data
- Contact the development team

---

**Note**: This is a comprehensive medical recruitment platform that requires proper configuration of email services, AI APIs, and database connections to function fully. The mock data provided allows for testing the interface and workflows.
