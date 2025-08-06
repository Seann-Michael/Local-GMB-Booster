# Local SEO Ranker - Technical Documentation

## 🚀 System Overview

Local SEO Ranker is a comprehensive SEO management platform designed to help businesses and agencies improve their local search visibility and manage their online presence effectively.

### Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase + Netlify Functions
- **Hosting**:
  - Web App: `app.mylocalseoranker.com` (Netlify + Supabase)
  - Marketing Site: `mylocalseoranker.com` (WordPress)
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth with 2FA
- **Maps**: Google Maps API
- **Communications**: Twilio (SMS + Email)
- **Integrations**: Webhooks, RSS Feeds, API Gateway

## 🌐 Domain Architecture

### Production Domains

- **Main Marketing Site**: `mylocalseoranker.com` (WordPress)
- **Web Application**: `app.mylocalseoranker.com` (React SPA)
- **API Endpoint**: `app.mylocalseoranker.com/api/*`

### Environment Configuration

```bash
# Production
VITE_APP_URL=https://app.mylocalseoranker.com
VITE_API_URL=https://app.mylocalseoranker.com/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
VITE_TWILIO_ACCOUNT_SID=your-twilio-sid
```

## 📊 Tech Stack

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Query + Context API
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Radix UI + shadcn/ui

### Backend & Infrastructure

- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth + 2FA
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Realtime
- **Functions**: Netlify Functions
- **CDN**: Netlify CDN
- **Email/SMS**: Twilio

### External APIs & Services

- **Maps**: Google Maps API
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Communications**: Twilio SendGrid + SMS
- **Analytics**: Custom analytics implementation
- **SEO Tools**: Custom SEO analysis tools

## 🔧 Installation & Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Google Maps API key
- Twilio account
- Netlify account

### Local Development Setup

1. **Clone Repository**

   ```bash
   git clone https://github.com/your-org/local-seo-ranker.git
   cd local-seo-ranker
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**
   Create `.env.local`:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
   VITE_TWILIO_ACCOUNT_SID=your-twilio-sid
   VITE_TWILIO_AUTH_TOKEN=your-twilio-token
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

### Production Deployment

1. **Build Application**

   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   ```bash
   netlify deploy --prod
   ```

## 📁 Project Structure

```
local-seo-ranker/
├── client/                 # Frontend React application
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Agency/       # Agency-specific components
│   │   └── GoogleMaps/   # Google Maps components
│   ├─�� hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   ├── pages/            # Page components
│   ├── types/            # TypeScript type definitions
│   └── App.tsx           # Main app component
├── server/               # Backend server code
│   └── routes/           # API route handlers
├── netlify/             # Netlify functions
│   └── functions/       # Serverless functions
├── shared/              # Shared types/utilities
├── docs/                # Technical documentation
└── public/              # Static assets
```

## 🔐 Authentication & Security

### Two-Factor Authentication (2FA)

- **Implementation**: TOTP-based 2FA
- **Backup Codes**: Recovery codes for account access
- **Enforcement**: Required for admin roles
- **Providers**: Supabase Auth + custom 2FA implementation

### Security Features

- **Session Management**: Secure JWT tokens
- **CSRF Protection**: Anti-CSRF tokens
- **XSS Prevention**: Input sanitization
- **SQL Injection Protection**: Parameterized queries
- **Rate Limiting**: API request throttling
- **Audit Logging**: Complete activity tracking

## 🗄️ Database Schema

### Core Tables

- `users` - User accounts and profiles
- `businesses` - Business profiles and information
- `projects` - SEO projects and campaigns
- `locations` - Business locations and addresses
- `reviews` - Customer reviews and ratings
- `analytics` - SEO performance metrics
- `audit_logs` - System activity tracking

### User Roles

- `super_admin` - Platform administration
- `agency_admin` - Agency management
- `business_owner` - Business account management
- `staff` - Limited access users

## 📡 API Documentation

See [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) for complete API reference.

### Authentication Endpoints

- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - Session termination
- `POST /api/auth/register` - User registration
- `POST /api/auth/2fa/enable` - Enable 2FA
- `POST /api/auth/2fa/verify` - Verify 2FA token

### Business Management

- `GET /api/businesses` - List businesses
- `POST /api/businesses` - Create business
- `PUT /api/businesses/:id` - Update business
- `DELETE /api/businesses/:id` - Delete business

### SEO Tools

- `POST /api/seo/analyze` - SEO analysis
- `GET /api/seo/rankings` - Search rankings
- `POST /api/seo/optimize` - SEO optimization

## 🔗 Integrations

### Google Maps API

- **Business Locations**: Address validation and mapping
- **Local Search**: Nearby business discovery
- **Reviews**: Google Business Profile integration
- **Analytics**: Location-based performance metrics

### Twilio Integration

- **SMS Notifications**: Review alerts and reminders
- **Email Communications**: Automated email campaigns
- **2FA Verification**: SMS-based authentication
- **Customer Communications**: Direct messaging

### Webhook System

- **Incoming Webhooks**: External service integrations
- **Outgoing Webhooks**: Event notifications
- **Security**: Signature verification
- **Retry Logic**: Automatic failure handling

### RSS Feeds

- **Content Syndication**: Blog post distribution
- **SEO Updates**: Search algorithm changes
- **Industry News**: Local SEO news aggregation
- **Custom Feeds**: Business-specific content

## 📊 Data Variables & Models

### User Model

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "agency_admin" | "business_owner" | "staff";
  created_at: string;
  updated_at: string;
  last_login: string;
  is_2fa_enabled: boolean;
  avatar_url?: string;
  phone?: string;
}
```

### Business Model

```typescript
interface Business {
  id: string;
  name: string;
  description?: string;
  address: Address;
  phone: string;
  email: string;
  website?: string;
  category: string;
  google_place_id?: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
}
```

### Project Model

```typescript
interface Project {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  status: "active" | "paused" | "completed" | "draft";
  type: "seo_audit" | "local_optimization" | "content_marketing";
  created_at: string;
  updated_at: string;
  due_date?: string;
  assigned_to?: string;
}
```

## 🚀 Deployment

### Netlify Configuration

```toml
[build]
  command = "npm run build:client"
  functions = "netlify/functions"
  publish = "dist/spa"

[functions]
  external_node_modules = ["express"]
  node_bundler = "esbuild"

[[redirects]]
  force = true
  from = "/api/*"
  status = 200
  to = "/.netlify/functions/api/:splat"
```

### Supabase Configuration

- **Database**: PostgreSQL with RLS enabled
- **Storage**: File uploads and media management
- **Auth**: User authentication and session management
- **Real-time**: Live updates and notifications

## 📈 Monitoring & Analytics

### Performance Monitoring

- **Core Web Vitals**: Page speed optimization
- **Error Tracking**: Automatic error reporting
- **Uptime Monitoring**: Service availability tracking
- **User Analytics**: Usage patterns and behavior

### SEO Metrics

- **Search Rankings**: Keyword position tracking
- **Local Visibility**: Map pack appearances
- **Review Monitoring**: Customer feedback tracking
- **Competitor Analysis**: Comparative performance

## 🔧 Development

### Code Standards

- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality gates

### Testing

- **Unit Tests**: Component and utility testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: User journey validation
- **Performance Tests**: Load and stress testing

## 📞 Support

### Technical Support

- **Documentation**: Comprehensive guides and API docs
- **Community**: Discord/Slack community support
- **Enterprise**: Dedicated support channels
- **Issues**: GitHub issue tracking

### Contact Information

- **Email**: support@mylocalseoranker.com
- **Phone**: 1-800-SEO-RANK
- **Website**: https://mylocalseoranker.com/support
- **Status Page**: https://status.mylocalseoranker.com

---

**Version**: 2.0.0  
**Last Updated**: January 2024  
**License**: Proprietary - All Rights Reserved
