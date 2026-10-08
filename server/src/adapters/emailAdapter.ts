export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailAdapter {
  sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId: string }>;
}

export class MockEmailAdapter implements EmailAdapter {
  async sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId: string }> {
    console.log(`[EmailAdapter:Dev] Sent email to: ${payload.to} | Subject: "${payload.subject}"`);
    return {
      success: true,
      messageId: `mock-msg-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    };
  }
}

export const emailAdapter: EmailAdapter = new MockEmailAdapter();
