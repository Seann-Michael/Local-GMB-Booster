# Local SEO Ranker - Deployment Guide

## 🏗️ Infrastructure Architecture

### Production Environment
- **Frontend Hosting**: Netlify CDN
- **Backend Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Serverless Functions**: Netlify Functions
- **Domain Management**: Netlify DNS
- **SSL Certificates**: Automatic via Netlify

### Domain Configuration
```
mylocalseoranker.com          → WordPress Marketing Site
app.mylocalseoranker.com      → React Web Application
api.mylocalseoranker.com      → API Gateway (Netlify Functions)
```

## 🚀 Netlify Deployment

### Build Configuration
```toml
# netlify.toml
[build]
  command = "npm run build:client"
  functions = "netlify/functions"
  publish = "dist/spa"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[functions]
  external_node_modules = ["express", "@supabase/supabase-js"]
  node_bundler = "esbuild"
  included_files = ["shared/**"]

# API Routes
[[redirects]]
  force = true
  from = "/api/*"
  status = 200
  to = "/.netlify/functions/api/:splat"

# SPA Routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  conditions = {Role = ["user"]}

# Security Headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://maps.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://api.twilio.com; frame-src 'none';"

# Cache Control
[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
```

### Environment Variables (Netlify)
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google APIs
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
GOOGLE_PLACES_API_KEY=your-places-key

# Twilio Configuration
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
SENDGRID_API_KEY=your-sendgrid-key

# Application URLs
VITE_APP_URL=https://app.mylocalseoranker.com
VITE_API_URL=https://app.mylocalseoranker.com/api

# Security
JWT_SECRET=your-jwt-secret
WEBHOOK_SECRET=your-webhook-secret
ENCRYPTION_KEY=your-encryption-key

# External Services
OPENAI_API_KEY=your-openai-key
ANALYTICS_ID=your-analytics-id
```

### Deployment Commands
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Link to Netlify site
netlify link

# Set environment variables
netlify env:set VITE_SUPABASE_URL "https://your-project.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key"

# Deploy to production
netlify deploy --prod
```

## 🗄️ Supabase Configuration

### Database Setup
```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Core tables
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'business_owner',
  is_2fa_enabled BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  category TEXT,
  google_place_id TEXT,
  address JSONB,
  business_hours JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  type TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE,
  assigned_to UUID REFERENCES users(id)
);

-- Add indexes for performance
CREATE INDEX idx_businesses_owner_id ON businesses(owner_id);
CREATE INDEX idx_projects_business_id ON projects(business_id);
CREATE INDEX idx_projects_status ON projects(status);
```

### Row Level Security (RLS)
```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- User policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Business policies
CREATE POLICY "Business owners can manage their businesses" ON businesses
  FOR ALL USING (auth.uid() = owner_id);

-- Project policies
CREATE POLICY "Project access through business ownership" ON projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = projects.business_id 
      AND businesses.owner_id = auth.uid()
    )
  );
```

### Storage Buckets
```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('business-media', 'business-media', true),
  ('project-files', 'project-files', false),
  ('user-avatars', 'user-avatars', true);

-- Storage policies
CREATE POLICY "Business media access" ON storage.objects
  FOR ALL USING (bucket_id = 'business-media');

CREATE POLICY "Project files access" ON storage.objects
  FOR ALL USING (
    bucket_id = 'project-files' AND
    auth.role() = 'authenticated'
  );
```

### Database Functions
```sql
-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 🔧 Local Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- VS Code (recommended)

### Setup Steps
```bash
# 1. Clone repository
git clone https://github.com/your-org/local-seo-ranker.git
cd local-seo-ranker

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env.local

# 4. Configure environment variables
# Edit .env.local with your API keys

# 5. Start development server
npm run dev

# 6. Open browser
open http://localhost:8080
```

### Development Environment Variables
```env
# .env.local
VITE_SUPABASE_URL=https://your-dev-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-dev-anon-key
VITE_GOOGLE_MAPS_API_KEY=your-maps-key
VITE_APP_URL=http://localhost:8080
VITE_API_URL=http://localhost:8080/api

# For testing Twilio (optional)
TWILIO_ACCOUNT_SID=your-test-sid
TWILIO_AUTH_TOKEN=your-test-token
```

## 🧪 Testing & Quality Assurance

### Testing Setup
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Type checking
npm run typecheck

# Linting
npm run lint

# Format code
npm run format
```

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] TypeScript compilation successful
- [ ] No ESLint errors
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificate valid
- [ ] Performance benchmarks met
- [ ] Security scan passed

## 📊 Monitoring & Logging

### Application Monitoring
```javascript
// Error tracking setup
import { initSentry } from './lib/monitoring';

initSentry({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Performance monitoring
import { trackPerformance } from './lib/analytics';

trackPerformance({
  route: window.location.pathname,
  loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart
});
```

### Log Aggregation
```bash
# Netlify Function logs
netlify functions:invoke api --logs

# Supabase logs
# Access via Supabase Dashboard > Logs
```

### Health Checks
```javascript
// Health check endpoint
export const handler = async (event, context) => {
  try {
    // Check database connection
    const { data, error } = await supabase.from('users').select('id').limit(1);
    
    if (error) throw error;
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          database: 'up',
          storage: 'up',
          auth: 'up'
        }
      })
    };
  } catch (error) {
    return {
      statusCode: 503,
      body: JSON.stringify({
        status: 'unhealthy',
        error: error.message
      })
    };
  }
};
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test
      - run: npm run typecheck
      - run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './dist/spa'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🔐 Security Configuration

### Supabase Security
```sql
-- Enable audit logging
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  user_id UUID,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (table_name, operation, user_id, old_values, new_values)
  VALUES (
    TG_TABLE_NAME,
    TG_OP,
    auth.uid(),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
```

### Backup Strategy
```bash
# Database backups (automated via Supabase)
# Point-in-time recovery available
# Daily automated backups retained for 7 days

# Code backups
# Git repository with multiple remotes
# GitHub (primary) + GitLab (mirror)

# File storage backups
# Supabase Storage with automatic replication
# Cross-region backup strategy
```

## 📞 Support & Troubleshooting

### Common Issues

**Build Failures**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Netlify cache
netlify build --clear-cache
```

**Database Connection Issues**
```bash
# Check Supabase status
curl https://status.supabase.com

# Verify environment variables
netlify env:list
```

**Performance Issues**
```bash
# Analyze bundle size
npm run build:analyze

# Check lighthouse scores
lighthouse https://app.mylocalseoranker.com
```

### Emergency Procedures
1. **Service Down**: Check status.mylocalseoranker.com
2. **Database Issues**: Contact Supabase support
3. **CDN Issues**: Contact Netlify support
4. **Security Incident**: security@mylocalseoranker.com

---

**Last Updated**: January 2024  
**Version**: 2.0.0  
**Maintained By**: DevOps Team
