export class EclipseAPIService {
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(clientId: string, clientSecret: string, baseUrl: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.baseUrl = baseUrl;
  }

  private async authenticate(): Promise<void> {
    try {
      // Mock OAuth 2.0 flow - replace with actual Eclipse API endpoints
      const response = await fetch(`${this.baseUrl}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        this.accessToken = data.access_token;
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('Eclipse API authentication failed:', error);
      // For demo purposes, use mock token
      this.accessToken = 'mock_access_token';
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (response.status === 401) {
        // Token expired, re-authenticate
        await this.authenticate();
        return this.makeRequest(endpoint, options);
      }

      return response;
    } catch (error) {
      console.error('Eclipse API request failed:', error);
      // Return mock data for demo
      return this.getMockResponse(endpoint);
    }
  }

  private getMockResponse(endpoint: string): Promise<Response> {
    const mockData = {
      '/candidates': {
        data: [
          {
            id: '1',
            name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@email.com',
            phone: '+44 7700 900123',
            specialization: 'Cardiology',
            experience: 8,
            location: 'London, UK',
            lastActive: '2024-01-15T10:30:00Z',
            status: 'active',
            compliance: { dbs: true, rightToWork: true, registration: true }
          },
          {
            id: '2',
            name: 'Dr. Michael Chen',
            email: 'michael.chen@email.com',
            phone: '+44 7700 900124',
            specialization: 'Emergency Medicine',
            experience: 12,
            location: 'Manchester, UK',
            lastActive: '2024-01-14T15:45:00Z',
            status: 'active',
            compliance: { dbs: true, rightToWork: true, registration: false }
          }
        ]
      },
      '/jobs': {
        data: [
          {
            id: '1',
            title: 'Consultant Cardiologist',
            client: 'Royal London Hospital',
            location: 'London, UK',
            type: 'permanent',
            specialization: 'Cardiology',
            salary: '£80,000 - £120,000',
            description: 'Exciting opportunity for an experienced Cardiologist...',
            requirements: ['GMC Registration', 'CCT in Cardiology', '5+ years experience'],
            postedDate: '2024-01-10T09:00:00Z',
            status: 'open',
            urgency: 'high'
          }
        ]
      }
    };

    const data = mockData[endpoint as keyof typeof mockData] || { data: [] };
    return Promise.resolve(new Response(JSON.stringify(data), { status: 200 }));
  }

  async getCandidates() {
    const response = await this.makeRequest('/candidates');
    return response.json();
  }

  async getJobs() {
    const response = await this.makeRequest('/jobs');
    return response.json();
  }

  async getCandidate(id: string) {
    const response = await this.makeRequest(`/candidates/${id}`);
    return response.json();
  }

  async getJob(id: string) {
    const response = await this.makeRequest(`/jobs/${id}`);
    return response.json();
  }

  async sendEmail(to: string, subject: string, body: string) {
    const response = await this.makeRequest('/emails', {
      method: 'POST',
      body: JSON.stringify({ to, subject, body }),
    });
    return response.json();
  }
}