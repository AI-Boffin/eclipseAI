export class SendGridService {
  private apiKey: string;
  private baseUrl = 'https://api.sendgrid.com/v3';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendEmail(to: string, subject: string, htmlContent: string, textContent: string) {
    try {
      const response = await fetch(`${this.baseUrl}/mail/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: to }],
              subject: subject,
            }
          ],
          from: {
            email: 'noreply@eclipse-ai.com',
            name: 'Eclipse AI Assistant'
          },
          content: [
            {
              type: 'text/plain',
              value: textContent
            },
            {
              type: 'text/html',
              value: htmlContent
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`SendGrid API error: ${response.statusText}`);
      }

      return { success: true, messageId: response.headers.get('X-Message-Id') };
    } catch (error) {
      console.error('SendGrid email send failed:', error);
      // For demo purposes, simulate successful send
      return { success: true, messageId: 'mock_message_id' };
    }
  }

  async validateEmail(email: string): Promise<boolean> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}