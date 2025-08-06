# Local SEO Ranker - External Integrations

## 🌐 Overview

Local SEO Ranker integrates with multiple external services to provide comprehensive SEO management capabilities. This document covers all external integrations, APIs, and services used by the platform.

## 🗺️ Google Maps & Places API

### Configuration
```javascript
// Google Maps Configuration
const GOOGLE_MAPS_CONFIG = {
  apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY,
  libraries: ['places', 'geometry', 'marker'],
  version: '3.55',
  region: 'US',
  language: 'en'
};

// Places API Configuration
const PLACES_API_CONFIG = {
  baseUrl: 'https://maps.googleapis.com/maps/api/place',
  endpoints: {
    search: '/nearbysearch/json',
    details: '/details/json',
    photos: '/photo',
    autocomplete: '/autocomplete/json'
  }
};
```

### Implementation
```typescript
// Google Places Service
class GooglePlacesService {
  async searchBusinesses(params: PlaceSearchParams): Promise<PlaceResult[]> {
    const response = await fetch(`${PLACES_API_CONFIG.baseUrl}/nearbysearch/json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      body: new URLSearchParams({
        key: GOOGLE_MAPS_CONFIG.apiKey,
        location: `${params.lat},${params.lng}`,
        radius: params.radius.toString(),
        type: params.type,
        keyword: params.keyword
      })
    });
    
    return response.json();
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
    const response = await fetch(`${PLACES_API_CONFIG.baseUrl}/details/json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      body: new URLSearchParams({
        key: GOOGLE_MAPS_CONFIG.apiKey,
        place_id: placeId,
        fields: 'name,formatted_address,geometry,photos,reviews,rating,user_ratings_total'
      })
    });
    
    return response.json();
  }
}

// Address Validation Service
class AddressValidationService {
  async validateAddress(address: Address): Promise<ValidationResult> {
    const geocoder = new google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address: address.formatted_address }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          resolve({
            isValid: true,
            standardized: this.parseGoogleResult(results[0]),
            confidence: this.calculateConfidence(results[0])
          });
        } else {
          resolve({
            isValid: false,
            error: status
          });
        }
      });
    });
  }
}
```

### Data Models
```typescript
interface PlaceSearchParams {
  lat: number
  lng: number
  radius: number
  type: string
  keyword?: string
}

interface PlaceResult {
  place_id: string
  name: string
  formatted_address: string
  geometry: {
    location: { lat: number; lng: number }
  }
  rating?: number
  user_ratings_total?: number
  photos?: PlacePhoto[]
  business_status: string
}

interface PlaceDetails extends PlaceResult {
  reviews?: GoogleReview[]
  opening_hours?: OpeningHours
  website?: string
  formatted_phone_number?: string
  international_phone_number?: string
}
```

## 📱 Twilio Integration

### SMS Configuration
```typescript
// Twilio SMS Service
import { Twilio } from 'twilio';

class TwilioSMSService {
  private client: Twilio;

  constructor() {
    this.client = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async sendSMS(params: SMSParams): Promise<SMSResult> {
    try {
      const message = await this.client.messages.create({
        body: params.message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: params.to,
        statusCallback: `${process.env.VITE_API_URL}/webhooks/twilio/sms-status`
      });

      return {
        success: true,
        messageId: message.sid,
        status: message.status
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async send2FACode(phoneNumber: string, code: string): Promise<boolean> {
    const message = `Your Local SEO Ranker verification code is: ${code}. Valid for 10 minutes.`;
    
    const result = await this.sendSMS({
      to: phoneNumber,
      message,
      type: '2fa'
    });

    return result.success;
  }

  async sendReviewRequest(params: ReviewRequestSMS): Promise<boolean> {
    const message = `Hi ${params.customerName}! Thank you for choosing ${params.businessName}. Please share your experience: ${params.reviewLink}`;
    
    const result = await this.sendSMS({
      to: params.phoneNumber,
      message,
      type: 'review_request'
    });

    return result.success;
  }
}
```

### Email Configuration (SendGrid)
```typescript
// SendGrid Email Service
import sgMail from '@sendgrid/mail';

class SendGridEmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendEmail(params: EmailParams): Promise<EmailResult> {
    try {
      const msg = {
        to: params.to,
        from: params.from || 'noreply@mylocalseoranker.com',
        subject: params.subject,
        html: params.htmlContent,
        text: params.textContent,
        templateId: params.templateId,
        dynamicTemplateData: params.templateData,
        trackingSettings: {
          clickTracking: { enable: true },
          openTracking: { enable: true }
        }
      };

      const response = await sgMail.send(msg);
      
      return {
        success: true,
        messageId: response[0].headers['x-message-id']
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async sendReviewRequestEmail(params: ReviewRequestEmail): Promise<boolean> {
    const result = await this.sendEmail({
      to: params.email,
      subject: `Share your experience with ${params.businessName}`,
      templateId: 'd-review-request-template',
      templateData: {
        business_name: params.businessName,
        customer_name: params.customerName,
        review_link: params.reviewLink,
        business_logo: params.businessLogo
      }
    });

    return result.success;
  }

  async send2FAEmail(email: string, code: string): Promise<boolean> {
    const result = await this.sendEmail({
      to: email,
      subject: 'Your Local SEO Ranker verification code',
      templateId: 'd-2fa-email-template',
      templateData: {
        verification_code: code,
        expires_in: '10 minutes'
      }
    });

    return result.success;
  }
}
```

### Webhook Handlers
```typescript
// Twilio Webhook Handler
export const handleTwilioWebhook = async (req: Request, res: Response) => {
  const { MessageSid, MessageStatus, ErrorCode, ErrorMessage } = req.body;

  // Verify webhook signature
  const isValid = twilioClient.validateRequest(
    req.headers['x-twilio-signature'],
    process.env.TWILIO_WEBHOOK_URL,
    req.body
  );

  if (!isValid) {
    return res.status(403).json({ error: 'Invalid signature' });
  }

  // Update message status in database
  await updateSMSStatus(MessageSid, {
    status: MessageStatus,
    errorCode: ErrorCode,
    errorMessage: ErrorMessage,
    updatedAt: new Date()
  });

  // Handle delivery notifications
  if (MessageStatus === 'delivered') {
    await handleSMSDelivered(MessageSid);
  } else if (MessageStatus === 'failed') {
    await handleSMSFailed(MessageSid, ErrorMessage);
  }

  res.status(200).json({ success: true });
};

// SendGrid Webhook Handler
export const handleSendGridWebhook = async (req: Request, res: Response) => {
  const events = req.body;

  for (const event of events) {
    switch (event.event) {
      case 'delivered':
        await handleEmailDelivered(event.sg_message_id);
        break;
      case 'open':
        await handleEmailOpened(event.sg_message_id, event.timestamp);
        break;
      case 'click':
        await handleEmailClicked(event.sg_message_id, event.url);
        break;
      case 'bounce':
        await handleEmailBounced(event.sg_message_id, event.reason);
        break;
    }
  }

  res.status(200).json({ success: true });
};
```

## 🏗️ Supabase Integration

### Database Configuration
```typescript
// Supabase Client Configuration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Server-side Supabase client (admin)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
```

### Authentication Service
```typescript
class SupabaseAuthService {
  async signUp(email: string, password: string, metadata: UserMetadata) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${process.env.VITE_APP_URL}/auth/callback`
      }
    });

    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  async enable2FA(userId: string) {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'Local SEO Ranker'
    });

    if (error) throw error;
    return data;
  }

  async verify2FA(factorId: string, challengeId: string, code: string) {
    const { data, error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId,
      code
    });

    if (error) throw error;
    return data;
  }
}
```

### Real-time Subscriptions
```typescript
class RealtimeService {
  subscribeToBusinessUpdates(businessId: string, callback: (data: any) => void) {
    return supabase
      .channel(`business:${businessId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'businesses',
        filter: `id=eq.${businessId}`
      }, callback)
      .subscribe();
  }

  subscribeToReviews(businessId: string, callback: (data: any) => void) {
    return supabase
      .channel(`reviews:${businessId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'reviews',
        filter: `business_id=eq.${businessId}`
      }, callback)
      .subscribe();
  }

  subscribeToRankings(projectId: string, callback: (data: any) => void) {
    return supabase
      .channel(`rankings:${projectId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'keyword_rankings',
        filter: `project_id=eq.${projectId}`
      }, callback)
      .subscribe();
  }
}
```

### File Storage Service
```typescript
class SupabaseStorageService {
  async uploadBusinessMedia(businessId: string, file: File): Promise<string> {
    const fileName = `${businessId}/${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('business-media')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;
    
    const { data: urlData } = supabase.storage
      .from('business-media')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  }

  async uploadProjectFile(projectId: string, file: File): Promise<string> {
    const fileName = `${projectId}/${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('project-files')
      .upload(fileName, file);

    if (error) throw error;
    return data.path;
  }

  async getSignedUrl(bucket: string, path: string, expiresIn: number = 3600): Promise<string> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) throw error;
    return data.signedUrl;
  }
}
```

## 🚀 Netlify Functions

### Function Configuration
```typescript
// netlify/functions/api.ts
import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';

const app = express();

app.use(cors({
  origin: [
    'https://app.mylocalseoranker.com',
    'http://localhost:8080'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/auth', authRoutes);
app.use('/businesses', businessRoutes);
app.use('/projects', projectRoutes);
app.use('/seo', seoRoutes);
app.use('/reviews', reviewRoutes);
app.use('/communications', communicationRoutes);
app.use('/webhooks', webhookRoutes);
app.use('/analytics', analyticsRoutes);

// Error handling
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('API Error:', error);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    }
  });
});

export const handler = serverless(app);
```

### Environment-specific Configuration
```javascript
// Build hooks for different environments
const buildCommand = process.env.NODE_ENV === 'production' 
  ? 'npm run build:production'
  : 'npm run build:development';

// Function timeout configuration
const functionTimeout = process.env.NODE_ENV === 'production' ? 26 : 10;

// Memory allocation
const functionMemory = process.env.NODE_ENV === 'production' ? 1024 : 512;
```

## 🔗 Webhook System

### Webhook Management Service
```typescript
class WebhookService {
  async registerWebhook(params: WebhookRegistration): Promise<Webhook> {
    // Validate webhook URL
    const isValid = await this.validateWebhookUrl(params.url);
    if (!isValid) {
      throw new Error('Invalid webhook URL');
    }

    // Generate secret
    const secret = this.generateWebhookSecret();

    // Save to database
    const webhook = await supabase
      .from('webhooks')
      .insert({
        business_id: params.businessId,
        url: params.url,
        events: params.events,
        secret,
        is_active: true
      })
      .select()
      .single();

    return webhook.data;
  }

  async deliverWebhook(webhookId: string, event: WebhookEvent, payload: any): Promise<void> {
    const webhook = await this.getWebhook(webhookId);
    if (!webhook || !webhook.is_active) return;

    const delivery: WebhookDelivery = {
      id: generateId(),
      webhook_id: webhookId,
      event: event.type,
      payload,
      attempt_count: 0,
      created_at: new Date().toISOString()
    };

    await this.attemptDelivery(webhook, delivery);
  }

  private async attemptDelivery(webhook: Webhook, delivery: WebhookDelivery): Promise<void> {
    try {
      const signature = this.generateSignature(webhook.secret, JSON.stringify(delivery.payload));
      
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Event': delivery.event,
          'User-Agent': 'LocalSEORanker-Webhooks/1.0',
          ...webhook.headers
        },
        body: JSON.stringify(delivery.payload),
        timeout: 30000
      });

      delivery.response_status = response.status;
      delivery.response_body = await response.text();
      delivery.response_headers = Object.fromEntries(response.headers.entries());

      if (response.ok) {
        delivery.delivered_at = new Date().toISOString();
      } else {
        await this.scheduleRetry(webhook, delivery);
      }
    } catch (error) {
      delivery.response_body = error.message;
      await this.scheduleRetry(webhook, delivery);
    }

    await this.saveDelivery(delivery);
  }

  private generateSignature(secret: string, payload: string): string {
    const crypto = require('crypto');
    return `sha256=${crypto.createHmac('sha256', secret).update(payload).digest('hex')}`;
  }
}
```

### Webhook Event Triggers
```typescript
// Business update webhook
export const triggerBusinessUpdateWebhook = async (businessId: string, changes: any) => {
  const webhooks = await getActiveWebhooks(businessId, 'business.updated');
  
  for (const webhook of webhooks) {
    await webhookService.deliverWebhook(webhook.id, {
      type: 'business.updated',
      timestamp: new Date().toISOString(),
      data: {
        business_id: businessId,
        changes
      }
    });
  }
};

// Review created webhook
export const triggerReviewCreatedWebhook = async (review: Review) => {
  const webhooks = await getActiveWebhooks(review.business_id, 'review.created');
  
  for (const webhook of webhooks) {
    await webhookService.deliverWebhook(webhook.id, {
      type: 'review.created',
      timestamp: new Date().toISOString(),
      data: { review }
    });
  }
};
```

## 📰 RSS Feed Integration

### RSS Parser Service
```typescript
import Parser from 'rss-parser';

class RSSService {
  private parser: Parser;

  constructor() {
    this.parser = new Parser({
      customFields: {
        feed: ['language', 'copyright'],
        item: ['category', 'guid', 'content:encoded']
      }
    });
  }

  async fetchFeed(url: string): Promise<ParsedFeed> {
    try {
      const feed = await this.parser.parseURL(url);
      
      return {
        title: feed.title,
        description: feed.description,
        link: feed.link,
        items: feed.items.map(item => ({
          title: item.title,
          description: item.contentSnippet,
          content: item['content:encoded'] || item.content,
          url: item.link,
          author: item.creator || item.author,
          publishedAt: new Date(item.pubDate || item.isoDate),
          guid: item.guid,
          categories: Array.isArray(item.categories) ? item.categories : []
        }))
      };
    } catch (error) {
      throw new Error(`Failed to parse RSS feed: ${error.message}`);
    }
  }

  async subscribeFeed(params: FeedSubscription): Promise<RSSFeed> {
    // Validate feed URL
    const feedData = await this.fetchFeed(params.url);
    
    // Save to database
    const feed = await supabase
      .from('rss_feeds')
      .insert({
        business_id: params.businessId,
        url: params.url,
        title: feedData.title,
        description: feedData.description,
        category: params.category,
        fetch_frequency: params.frequency || 24,
        is_active: true
      })
      .select()
      .single();

    // Import initial items
    await this.importFeedItems(feed.data.id, feedData.items);

    return feed.data;
  }

  async processFeedUpdates(): Promise<void> {
    const activeFeeds = await supabase
      .from('rss_feeds')
      .select('*')
      .eq('is_active', true)
      .lt('last_fetched', new Date(Date.now() - 60 * 60 * 1000).toISOString()); // 1 hour ago

    for (const feed of activeFeeds.data) {
      try {
        const feedData = await this.fetchFeed(feed.url);
        const newItems = await this.getNewItems(feed.id, feedData.items);
        
        if (newItems.length > 0) {
          await this.importFeedItems(feed.id, newItems);
          await this.notifyFeedUpdates(feed.id, newItems);
        }

        await supabase
          .from('rss_feeds')
          .update({
            last_fetched: new Date().toISOString(),
            item_count: feedData.items.length,
            error_count: 0
          })
          .eq('id', feed.id);
      } catch (error) {
        await supabase
          .from('rss_feeds')
          .update({
            last_fetched: new Date().toISOString(),
            error_count: feed.error_count + 1,
            last_error: error.message
          })
          .eq('id', feed.id);
      }
    }
  }
}
```

### RSS Content Analysis
```typescript
class RSSContentAnalyzer {
  async analyzeFeedItem(item: RSSItem): Promise<ContentAnalysis> {
    // Extract keywords
    const keywords = await this.extractKeywords(item.content || item.description);
    
    // Sentiment analysis
    const sentiment = await this.analyzeSentiment(item.content || item.description);
    
    // Category classification
    const category = await this.classifyContent(item.content || item.description);
    
    // Relevance scoring
    const relevanceScore = await this.calculateRelevance(item, keywords);

    return {
      keywords,
      sentiment,
      category,
      relevanceScore,
      readingTime: this.calculateReadingTime(item.content || item.description),
      wordCount: this.countWords(item.content || item.description)
    };
  }

  private async extractKeywords(text: string): Promise<string[]> {
    // Implement keyword extraction logic
    // Could use natural language processing libraries
    const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const wordFreq = words.reduce((freq, word) => {
      freq[word] = (freq[word] || 0) + 1;
      return freq;
    }, {});
    
    return Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }
}
```

## 🔐 Two-Factor Authentication (2FA)

### TOTP Implementation
```typescript
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

class TwoFactorAuthService {
  async generateSecret(userId: string, email: string): Promise<TwoFactorSetup> {
    const secret = authenticator.generateSecret();
    const serviceName = 'Local SEO Ranker';
    const keyUri = authenticator.keyuri(email, serviceName, secret);
    
    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(keyUri);
    
    // Generate backup codes
    const backupCodes = this.generateBackupCodes();
    
    // Store in database (encrypted)
    await supabase
      .from('user_2fa')
      .upsert({
        user_id: userId,
        secret: this.encrypt(secret),
        backup_codes: backupCodes.map(code => this.encrypt(code)),
        is_enabled: false,
        created_at: new Date().toISOString()
      });

    return {
      secret,
      qrCodeUrl,
      backupCodes,
      keyUri
    };
  }

  async verifyToken(userId: string, token: string): Promise<boolean> {
    const { data } = await supabase
      .from('user_2fa')
      .select('secret')
      .eq('user_id', userId)
      .eq('is_enabled', true)
      .single();

    if (!data) return false;

    const secret = this.decrypt(data.secret);
    return authenticator.verify({ token, secret });
  }

  async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    const { data } = await supabase
      .from('user_2fa')
      .select('backup_codes')
      .eq('user_id', userId)
      .single();

    if (!data) return false;

    const decryptedCodes = data.backup_codes.map(encryptedCode => 
      this.decrypt(encryptedCode)
    );

    const isValid = decryptedCodes.includes(code);

    if (isValid) {
      // Remove used backup code
      const remainingCodes = data.backup_codes.filter(encryptedCode => 
        this.decrypt(encryptedCode) !== code
      );

      await supabase
        .from('user_2fa')
        .update({ backup_codes: remainingCodes })
        .eq('user_id', userId);
    }

    return isValid;
  }

  private generateBackupCodes(): string[] {
    return Array.from({ length: 10 }, () => 
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );
  }

  private encrypt(text: string): string {
    // Implement encryption using your preferred method
    const crypto = require('crypto');
    const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  private decrypt(encryptedText: string): string {
    const crypto = require('crypto');
    const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
```

## 📊 Performance Monitoring

### Integration Health Checks
```typescript
class IntegrationHealthService {
  async checkAllIntegrations(): Promise<HealthStatus> {
    const checks = await Promise.allSettled([
      this.checkSupabase(),
      this.checkGoogleMaps(),
      this.checkTwilio(),
      this.checkSendGrid(),
      this.checkNetlify()
    ]);

    return {
      overall_status: checks.every(check => check.status === 'fulfilled') ? 'healthy' : 'degraded',
      checks: {
        supabase: checks[0],
        google_maps: checks[1],
        twilio: checks[2],
        sendgrid: checks[3],
        netlify: checks[4]
      },
      checked_at: new Date().toISOString()
    };
  }

  private async checkSupabase(): Promise<ServiceHealth> {
    try {
      const start = Date.now();
      const { data, error } = await supabase.from('users').select('id').limit(1);
      const responseTime = Date.now() - start;

      return {
        status: error ? 'unhealthy' : 'healthy',
        response_time: responseTime,
        error: error?.message
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  private async checkGoogleMaps(): Promise<ServiceHealth> {
    try {
      const start = Date.now();
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=test&inputtype=textquery&key=${process.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      const responseTime = Date.now() - start;

      return {
        status: response.ok ? 'healthy' : 'unhealthy',
        response_time: responseTime,
        status_code: response.status
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }
}
```

---

**Integration Version**: 2.0  
**Last Updated**: January 2024  
**Maintained By**: Integration Team
