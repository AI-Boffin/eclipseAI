export class OpenAIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, data: any) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('OpenAI API request failed:', error);
      throw error;
    }
  }

  async summarizeCV(cvText: string): Promise<string> {
    const prompt = `
      Analyze this candidate CV and provide a professional summary in exactly 3 bullet points.
      Focus on: specialization, key experience, and standout qualifications.
      Keep each point concise and impactful.
      
      CV Content:
      ${cvText}
    `;

    const response = await this.makeRequest('/chat/completions', {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a medical recruitment expert specializing in candidate assessment.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.3,
    });

    return response.choices[0].message.content;
  }

  async parseJobEmail(prompt: string): Promise<any> {
    const response = await this.makeRequest('/chat/completions', {
      model: 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert at parsing NHS recruitment emails. Always respond with valid JSON. Use standard NHS grades like Consultant, ST1-ST8, SHO, FY1-FY2, etc.' 
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 800,
      temperature: 0.2,
    });

    try {
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Failed to parse JSON response:', error);
      throw new Error('Invalid JSON response from OpenAI');
    }
  }

  async matchCandidateToJob(cvText: string, jobDescription: string): Promise<{ score: number; reasoning: string; matchedSkills: string[]; gaps: string[] }> {
    const prompt = `
      Match this candidate CV to the job description. Provide:
      1. Match score (0-100)
      2. Brief reasoning for the score
      3. List of matched skills/qualifications
      4. List of potential gaps or missing requirements
      
      Candidate CV:
      ${cvText}
      
      Job Description:
      ${jobDescription}
      
      Respond in JSON format:
      {
        "score": number,
        "reasoning": "string",
        "matchedSkills": ["skill1", "skill2"],
        "gaps": ["gap1", "gap2"]
      }
    `;

    const response = await this.makeRequest('/chat/completions', {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a medical recruitment expert. Always respond with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.2,
    });

    try {
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      // Fallback if JSON parsing fails
      return {
        score: 50,
        reasoning: 'Unable to process match analysis',
        matchedSkills: [],
        gaps: []
      };
    }
  }

  async generateOutreachEmail(candidateName: string, jobTitle: string, clientName: string, jobDetails: string): Promise<string> {
    const prompt = `
      Write a professional, personalized outreach email to invite a medical professional to apply for a position.
      
      Details:
      - Candidate: ${candidateName}
      - Job Title: ${jobTitle}
      - Client: ${clientName}
      - Job Details: ${jobDetails}
      
      The email should be:
      - Professional but warm
      - Highlight why they'd be a good fit
      - Include next steps
      - Keep it concise (under 200 words)
    `;

    const response = await this.makeRequest('/chat/completions', {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a professional medical recruitment consultant writing personalized outreach emails.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  }
}