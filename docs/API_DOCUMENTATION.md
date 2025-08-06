# Local SEO Ranker - API Documentation

## 🔗 Base URL
- **Production**: `https://app.mylocalseoranker.com/api`
- **Development**: `http://localhost:8080/api`

## 🔐 Authentication

All API requests require authentication using JWT tokens obtained through the authentication endpoints.

### Headers
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
X-API-Key: <optional_api_key>
```

### Rate Limiting
- **Standard Users**: 1000 requests/hour
- **Premium Users**: 5000 requests/hour
- **Enterprise**: 10000 requests/hour

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": ["Email is required", "Password must be at least 8 characters"]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🔑 Authentication Endpoints

### POST /api/auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "remember_me": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "refresh_token_here",
    "expires_in": 3600,
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "business_owner",
      "is_2fa_enabled": true
    }
  }
}
```

### POST /api/auth/2fa/verify
Verify 2FA code during login.

**Request Body:**
```json
{
  "login_token": "temporary_login_token",
  "code": "123456"
}
```

### POST /api/auth/register
Register new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "business_name": "Local Business LLC",
  "phone": "+1234567890"
}
```

### POST /api/auth/logout
Logout user and invalidate tokens.

### POST /api/auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refresh_token": "refresh_token_here"
}
```

## 🏢 Business Management

### GET /api/businesses
List all businesses for authenticated user.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `search` (string): Search term
- `category` (string): Business category filter
- `status` (string): Business status filter

**Response:**
```json
{
  "success": true,
  "data": {
    "businesses": [
      {
        "id": "business-uuid",
        "name": "Local Restaurant",
        "description": "Fine dining establishment",
        "address": {
          "street": "123 Main St",
          "city": "Anytown",
          "state": "CA",
          "zip": "12345",
          "country": "US"
        },
        "phone": "+1234567890",
        "email": "info@restaurant.com",
        "website": "https://restaurant.com",
        "category": "restaurant",
        "google_place_id": "ChIJXXXXXXXXXXXXXX",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

### POST /api/businesses
Create new business.

**Request Body:**
```json
{
  "name": "New Business",
  "description": "Business description",
  "address": {
    "street": "456 Oak Ave",
    "city": "Business City",
    "state": "CA",
    "zip": "54321",
    "country": "US"
  },
  "phone": "+1987654321",
  "email": "contact@newbusiness.com",
  "website": "https://newbusiness.com",
  "category": "retail"
}
```

### GET /api/businesses/:id
Get specific business details.

### PUT /api/businesses/:id
Update business information.

### DELETE /api/businesses/:id
Delete business (soft delete).

## 📊 SEO Analysis

### POST /api/seo/analyze
Perform comprehensive SEO analysis.

**Request Body:**
```json
{
  "business_id": "business-uuid",
  "url": "https://business.com",
  "keywords": ["local restaurant", "fine dining", "best food"],
  "location": {
    "city": "Anytown",
    "state": "CA",
    "country": "US"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overall_score": 78,
    "analysis": {
      "on_page": {
        "score": 85,
        "issues": ["Missing meta description", "Low keyword density"],
        "recommendations": ["Add meta description", "Optimize keyword usage"]
      },
      "local_seo": {
        "score": 72,
        "google_my_business": {
          "claimed": true,
          "complete": false,
          "missing_fields": ["business_hours", "photos"]
        },
        "citations": {
          "count": 15,
          "consistent": 12,
          "inconsistent": 3
        }
      },
      "technical": {
        "score": 90,
        "page_speed": 85,
        "mobile_friendly": true,
        "ssl_certificate": true
      }
    },
    "analyzed_at": "2024-01-15T10:30:00Z"
  }
}
```

### GET /api/seo/rankings
Get keyword ranking data.

**Query Parameters:**
- `business_id` (string): Business ID
- `keywords` (string[]): Keywords to check
- `location` (string): Location for local search
- `start_date` (string): Start date (ISO 8601)
- `end_date` (string): End date (ISO 8601)

### POST /api/seo/optimize
Generate SEO optimization recommendations.

## 📍 Location & Maps

### GET /api/locations/search
Search for business locations using Google Places API.

**Query Parameters:**
- `query` (string): Search query
- `location` (string): Center point for search
- `radius` (number): Search radius in meters
- `type` (string): Place type filter

### POST /api/locations/validate
Validate and standardize address.

**Request Body:**
```json
{
  "address": {
    "street": "123 Main Street",
    "city": "Anytown",
    "state": "CA",
    "zip": "12345"
  }
}
```

### GET /api/locations/:place_id/details
Get detailed information about a Google Place.

## ⭐ Reviews Management

### GET /api/reviews
Get reviews for business.

**Query Parameters:**
- `business_id` (string): Business ID
- `source` (string): Review source (google, yelp, facebook)
- `rating` (number): Filter by rating
- `start_date` (string): Start date
- `end_date` (string): End date

### POST /api/reviews/import
Import reviews from external sources.

### POST /api/reviews/respond
Respond to customer review.

**Request Body:**
```json
{
  "review_id": "review-uuid",
  "response": "Thank you for your feedback...",
  "public": true
}
```

### GET /api/reviews/analytics
Get review analytics and insights.

## 📞 Communications (Twilio Integration)

### POST /api/communications/sms/send
Send SMS message via Twilio.

**Request Body:**
```json
{
  "to": "+1234567890",
  "message": "Your review request link: https://...",
  "business_id": "business-uuid"
}
```

### POST /api/communications/email/send
Send email via Twilio SendGrid.

**Request Body:**
```json
{
  "to": "customer@example.com",
  "subject": "Thank you for your visit",
  "template": "review_request",
  "variables": {
    "business_name": "Local Restaurant",
    "customer_name": "John Doe"
  }
}
```

### GET /api/communications/templates
Get available message templates.

### POST /api/communications/campaigns
Create communication campaign.

## 🔗 Webhooks

### POST /api/webhooks/register
Register webhook endpoint.

**Request Body:**
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["review.created", "business.updated"],
  "secret": "webhook_secret_key"
}
```

### GET /api/webhooks
List registered webhooks.

### DELETE /api/webhooks/:id
Delete webhook registration.

### Webhook Events
Available webhook events:
- `review.created` - New review received
- `review.updated` - Review response added
- `business.updated` - Business information changed
- `seo.analysis.completed` - SEO analysis finished
- `ranking.changed` - Keyword ranking changed

### Webhook Payload Example
```json
{
  "event": "review.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "review": {
      "id": "review-uuid",
      "business_id": "business-uuid",
      "rating": 5,
      "text": "Great service!",
      "author": "Customer Name",
      "source": "google",
      "created_at": "2024-01-15T10:30:00Z"
    }
  },
  "signature": "sha256=signature_hash"
}
```

## 📰 RSS Feeds

### GET /api/rss/feeds
List available RSS feeds.

### POST /api/rss/subscribe
Subscribe to RSS feed.

**Request Body:**
```json
{
  "url": "https://example.com/feed.xml",
  "category": "seo_news",
  "business_id": "business-uuid"
}
```

### GET /api/rss/items
Get RSS feed items.

### POST /api/rss/parse
Parse and import RSS feed content.

## 📈 Analytics & Reporting

### GET /api/analytics/dashboard
Get dashboard analytics data.

**Query Parameters:**
- `business_id` (string): Business ID
- `start_date` (string): Start date
- `end_date` (string): End date
- `metrics` (string[]): Specific metrics to include

### GET /api/analytics/rankings
Get ranking analytics.

### GET /api/analytics/reviews
Get review analytics.

### GET /api/analytics/traffic
Get website traffic analytics.

### POST /api/reports/generate
Generate custom report.

**Request Body:**
```json
{
  "business_id": "business-uuid",
  "type": "monthly_seo_report",
  "format": "pdf",
  "email_to": "client@example.com",
  "include_sections": ["rankings", "reviews", "recommendations"]
}
```

## 👥 User Management

### GET /api/users
List users (admin only).

### POST /api/users
Create new user (admin only).

### GET /api/users/:id
Get user details.

### PUT /api/users/:id
Update user information.

### POST /api/users/:id/2fa/enable
Enable 2FA for user.

### POST /api/users/:id/invite
Send user invitation.

## 🔒 Security Features

### Two-Factor Authentication (2FA)
- **TOTP Support**: Time-based one-time passwords
- **Backup Codes**: Recovery codes for account access
- **QR Code Generation**: Easy setup with authenticator apps

### API Security
- **Rate Limiting**: Request throttling per user/IP
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Parameterized queries
- **XSS Prevention**: Input sanitization and output encoding

### Audit Logging
All API requests are logged with:
- User ID and IP address
- Request method and endpoint
- Request/response data (sensitive data masked)
- Timestamp and execution time

## 🚨 Error Codes

| Code | Description |
|------|-------------|
| `AUTHENTICATION_REQUIRED` | Missing or invalid authentication |
| `AUTHORIZATION_FAILED` | Insufficient permissions |
| `VALIDATION_ERROR` | Invalid request data |
| `RESOURCE_NOT_FOUND` | Requested resource doesn't exist |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_SERVER_ERROR` | Unexpected server error |
| `SERVICE_UNAVAILABLE` | External service unavailable |
| `PAYMENT_REQUIRED` | Subscription upgrade needed |

## 📞 Support

### API Support
- **Documentation**: https://docs.mylocalseoranker.com
- **Status Page**: https://status.mylocalseoranker.com
- **Support Email**: api-support@mylocalseoranker.com
- **Community**: https://community.mylocalseoranker.com

### SDK & Libraries
- **JavaScript/TypeScript**: `@mylocalseoranker/js-sdk`
- **Python**: `mylocalseoranker-python`
- **PHP**: `mylocalseoranker/php-sdk`
- **Postman Collection**: Available in documentation

---

**API Version**: v2.0  
**Last Updated**: January 2024  
**Support**: api-support@mylocalseoranker.com
