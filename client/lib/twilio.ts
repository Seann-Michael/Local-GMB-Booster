// Client-side Twilio service for SMS functionality

interface SMSData {
  to: string;
  message: string;
  campaignId?: string;
  businessId?: string;
}

interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

interface ReviewRequestData {
  to: string;
  businessName: string;
  customerName?: string;
  reviewLink: string;
  businessId?: string;
}

interface TwilioStatus {
  configured: boolean;
  hasPhoneNumber: boolean;
}

class TwilioService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || '/api';
  }

  // Send SMS message
  async sendSMS(smsData: SMSData): Promise<SMSResult> {
    try {
      const response = await fetch(`${this.baseUrl}/twilio/sms/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(smsData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('SMS send error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send SMS',
      };
    }
  }

  // Send review request SMS
  async sendReviewRequest(reviewData: ReviewRequestData): Promise<SMSResult> {
    try {
      const response = await fetch(`${this.baseUrl}/twilio/review-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Review request SMS error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send review request',
      };
    }
  }

  // Test Twilio connection
  async testConnection(): Promise<{ success: boolean; error?: string; accountInfo?: any }> {
    try {
      const response = await fetch(`${this.baseUrl}/twilio/test`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Twilio test error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection test failed',
      };
    }
  }

  // Check Twilio configuration status
  async getStatus(): Promise<TwilioStatus & { success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/twilio/status`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Twilio status error:', error);
      return {
        success: false,
        configured: false,
        hasPhoneNumber: false,
        error: error instanceof Error ? error.message : 'Failed to check status',
      };
    }
  }

  // Send 2FA code via SMS
  async send2FACode(phoneNumber: string, code: string): Promise<SMSResult> {
    const message = `Your verification code is: ${code}. This code expires in 10 minutes.`;
    
    return this.sendSMS({
      to: phoneNumber,
      message,
      campaignId: '2fa_verification',
    });
  }

  // Send appointment reminder
  async sendAppointmentReminder(
    phoneNumber: string,
    businessName: string,
    appointmentDate: string,
    customerName?: string
  ): Promise<SMSResult> {
    const message = `Hi ${customerName || 'there'}! This is a reminder about your appointment with ${businessName} on ${appointmentDate}. See you soon!`;
    
    return this.sendSMS({
      to: phoneNumber,
      message,
      campaignId: 'appointment_reminder',
    });
  }

  // Send project completion notification
  async sendProjectCompletionNotification(
    phoneNumber: string,
    businessName: string,
    projectName: string,
    customerName?: string
  ): Promise<SMSResult> {
    const message = `Hi ${customerName || 'there'}! Your project "${projectName}" with ${businessName} has been completed. Thank you for choosing us!`;
    
    return this.sendSMS({
      to: phoneNumber,
      message,
      campaignId: 'project_completion',
    });
  }

  // Format phone number for Twilio (E.164 format)
  formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const digits = phoneNumber.replace(/\D/g, '');
    
    // Add +1 for US numbers if not present
    if (digits.length === 10) {
      return `+1${digits}`;
    } else if (digits.length === 11 && digits.startsWith('1')) {
      return `+${digits}`;
    }
    
    // Return as-is if already formatted or international
    return phoneNumber.startsWith('+') ? phoneNumber : `+${digits}`;
  }

  // Validate phone number format
  isValidPhoneNumber(phoneNumber: string): boolean {
    const formatted = this.formatPhoneNumber(phoneNumber);
    // Basic E.164 validation
    return /^\+[1-9]\d{1,14}$/.test(formatted);
  }
}

// Export singleton instance
export const twilioService = new TwilioService();

// Export types
export type { SMSData, SMSResult, ReviewRequestData, TwilioStatus };
