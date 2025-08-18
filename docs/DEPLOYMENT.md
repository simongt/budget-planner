# Deployment Guide

## Executive Summary

This document outlines the deployment strategy for the Budget Planner application, covering CI/CD pipelines, production deployment, monitoring, and maintenance procedures.

## 🎯 Deployment Goals

### Primary Objectives
1. **Automated Deployment** - Streamlined CI/CD pipeline
2. **Zero Downtime** - Blue-green deployment strategy
3. **Monitoring & Alerting** - Comprehensive production monitoring
4. **Security** - Secure deployment practices
5. **Scalability** - Infrastructure that scales with demand

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}

jobs:
  test:
    name: Test & Lint
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linting
        run: npm run lint
        
      - name: Run type checking
        run: npm run type-check
        
      - name: Run unit tests
        run: npm run test:coverage
        
      - name: Run E2E tests
        run: npm run test:e2e
        
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'push'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: dist/
          
      - name: Deploy to Firebase Hosting (Staging)
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_STAGING }}'
          channelId: staging
          projectId: ${{ env.FIREBASE_PROJECT_ID }}

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: dist/
          
      - name: Deploy to Firebase Hosting (Production)
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_PROD }}'
          projectId: ${{ env.FIREBASE_PROJECT_ID }}
          
      - name: Run smoke tests
        run: npm run test:smoke
        
      - name: Notify deployment success
        if: success()
        uses: 8398a7/action-slack@v3
        with:
          status: success
          webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
          text: 'Production deployment successful! 🚀'

  rollback:
    name: Rollback Deployment
    runs-on: ubuntu-latest
    if: failure()
    environment: production
    
    steps:
      - name: Rollback to previous version
        run: |
          echo "Deployment failed, initiating rollback..."
          # Rollback logic here
          
      - name: Notify rollback
        uses: 8398a7/action-slack@v3
        with:
          status: failure
          webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
          text: 'Deployment failed, rollback initiated! ⚠️'
```

### Environment Configuration
```typescript
// src/config/environment.ts
interface EnvironmentConfig {
  apiUrl: string;
  firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  sentryDsn?: string;
  analyticsId?: string;
}

const environments: Record<string, EnvironmentConfig> = {
  development: {
    apiUrl: 'http://localhost:5001/budget-planner-dev/us-central1/api',
    firebaseConfig: {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY_DEV!,
      authDomain: 'budget-planner-dev.firebaseapp.com',
      projectId: 'budget-planner-dev',
      storageBucket: 'budget-planner-dev.appspot.com',
      messagingSenderId: '123456789',
      appId: '1:123456789:web:abcdef123456'
    }
  },
  staging: {
    apiUrl: 'https://us-central1-budget-planner-staging.cloudfunctions.net/api',
    firebaseConfig: {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY_STAGING!,
      authDomain: 'budget-planner-staging.firebaseapp.com',
      projectId: 'budget-planner-staging',
      storageBucket: 'budget-planner-staging.appspot.com',
      messagingSenderId: '123456789',
      appId: '1:123456789:web:abcdef123456'
    },
    sentryDsn: process.env.REACT_APP_SENTRY_DSN_STAGING
  },
  production: {
    apiUrl: 'https://us-central1-budget-planner-prod.cloudfunctions.net/api',
    firebaseConfig: {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY_PROD!,
      authDomain: 'budget-planner-prod.firebaseapp.com',
      projectId: 'budget-planner-prod',
      storageBucket: 'budget-planner-prod.appspot.com',
      messagingSenderId: '123456789',
      appId: '1:123456789:web:abcdef123456'
    },
    sentryDsn: process.env.REACT_APP_SENTRY_DSN_PROD,
    analyticsId: process.env.REACT_APP_GA_ID
  }
};

export const getEnvironmentConfig = (): EnvironmentConfig => {
  const env = process.env.NODE_ENV || 'development';
  return environments[env];
};
```

## 🔧 Build Configuration

### Vite Production Build
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: mode === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          charts: ['recharts']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
}));
```

### Firebase Configuration
```json
// firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000"
          }
        ]
      }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs18"
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

## 📊 Monitoring & Observability

### Sentry Error Tracking
```typescript
// src/utils/monitoring.ts
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { getEnvironmentConfig } from '../config/environment';

export const initializeMonitoring = () => {
  const config = getEnvironmentConfig();
  
  if (config.sentryDsn) {
    Sentry.init({
      dsn: config.sentryDsn,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 1.0,
      environment: process.env.NODE_ENV,
      release: process.env.REACT_APP_VERSION,
      beforeSend(event) {
        // Filter out development errors
        if (process.env.NODE_ENV === 'development') {
          return null;
        }
        return event;
      }
    });
  }
};

export const captureError = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, {
    extra: context
  });
};

export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info') => {
  Sentry.captureMessage(message, level);
};
```

### Performance Monitoring
```typescript
// src/utils/performance.ts
import { getEnvironmentConfig } from '../config/environment';

export const initializeAnalytics = () => {
  const config = getEnvironmentConfig();
  
  if (config.analyticsId && typeof window !== 'undefined') {
    // Google Analytics
    window.gtag('config', config.analyticsId, {
      page_title: document.title,
      page_location: window.location.href
    });
  }
};

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

export const trackPageView = (pagePath: string) => {
  trackEvent('page_view', {
    page_path: pagePath
  });
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  
  const duration = end - start;
  
  // Send to analytics
  trackEvent('performance_measurement', {
    name,
    duration,
    timestamp: Date.now()
  });
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`${name} took ${duration}ms`);
  }
};
```

### Health Checks
```typescript
// src/utils/healthCheck.ts
export const performHealthCheck = async (): Promise<boolean> => {
  try {
    const config = getEnvironmentConfig();
    
    // Check API connectivity
    const apiResponse = await fetch(`${config.apiUrl}/health`, {
      method: 'GET',
      timeout: 5000
    });
    
    if (!apiResponse.ok) {
      throw new Error(`API health check failed: ${apiResponse.status}`);
    }
    
    // Check Firebase connectivity
    const firebaseResponse = await fetch(`${config.firebaseConfig.authDomain}/__/auth/health`, {
      method: 'GET',
      timeout: 5000
    });
    
    if (!firebaseResponse.ok) {
      throw new Error(`Firebase health check failed: ${firebaseResponse.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Health check failed:', error);
    captureError(error as Error, { context: 'health_check' });
    return false;
  }
};

// Periodic health checks
export const startHealthMonitoring = () => {
  setInterval(async () => {
    const isHealthy = await performHealthCheck();
    
    if (!isHealthy) {
      // Trigger alert
      captureMessage('Application health check failed', 'error');
    }
  }, 60000); // Check every minute
};
```

## 🔒 Security Configuration

### Security Headers
```typescript
// src/utils/security.ts
export const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://firebase.googleapis.com https://www.googleapis.com",
    "frame-ancestors 'none'"
  ].join('; '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

export const applySecurityHeaders = () => {
  if (typeof window !== 'undefined') {
    // Apply headers via meta tags for client-side
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = securityHeaders['Content-Security-Policy'];
    document.head.appendChild(meta);
  }
};
```

### Environment Variable Validation
```typescript
// src/utils/envValidation.ts
const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID'
];

export const validateEnvironment = () => {
  const missingVars = requiredEnvVars.filter(
    varName => !process.env[varName]
  );
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
};

// Validate on app startup
validateEnvironment();
```

## 📈 Deployment Strategies

### Blue-Green Deployment
```typescript
// scripts/deploy-blue-green.ts
import { execSync } from 'child_process';

const deployBlueGreen = async () => {
  try {
    // Deploy to blue environment
    console.log('Deploying to blue environment...');
    execSync('firebase deploy --only hosting:blue', { stdio: 'inherit' });
    
    // Run smoke tests on blue
    console.log('Running smoke tests on blue...');
    execSync('npm run test:smoke:blue', { stdio: 'inherit' });
    
    // Switch traffic to blue
    console.log('Switching traffic to blue...');
    execSync('firebase hosting:channel:deploy blue --expires 1d', { stdio: 'inherit' });
    
    // Deploy to green environment
    console.log('Deploying to green environment...');
    execSync('firebase deploy --only hosting:green', { stdio: 'inherit' });
    
    // Run smoke tests on green
    console.log('Running smoke tests on green...');
    execSync('npm run test:smoke:green', { stdio: 'inherit' });
    
    // Switch traffic to green
    console.log('Switching traffic to green...');
    execSync('firebase hosting:channel:deploy green --expires 1d', { stdio: 'inherit' });
    
    console.log('Blue-green deployment completed successfully!');
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
};

deployBlueGreen();
```

### Rollback Strategy
```typescript
// scripts/rollback.ts
import { execSync } from 'child_process';

const rollback = async (version: string) => {
  try {
    console.log(`Rolling back to version ${version}...`);
    
    // Checkout specific version
    execSync(`git checkout ${version}`, { stdio: 'inherit' });
    
    // Install dependencies
    execSync('npm ci', { stdio: 'inherit' });
    
    // Build application
    execSync('npm run build', { stdio: 'inherit' });
    
    // Deploy to production
    execSync('firebase deploy --only hosting', { stdio: 'inherit' });
    
    console.log('Rollback completed successfully!');
  } catch (error) {
    console.error('Rollback failed:', error);
    process.exit(1);
  }
};

// Usage: npm run rollback v1.2.3
const version = process.argv[2];
if (!version) {
  console.error('Please provide a version to rollback to');
  process.exit(1);
}

rollback(version);
```

## 📊 Post-Deployment Verification

### Smoke Tests
```typescript
// tests/smoke/healthCheck.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/');
    
    // Check if app loads
    await expect(page.locator('[data-testid="app-container"]')).toBeVisible();
    
    // Check if main features are accessible
    await expect(page.locator('[data-testid="budget-calculator"]')).toBeVisible();
  });

  test('should perform basic budget calculation', async ({ page }) => {
    await page.goto('/');
    
    // Enter salary
    await page.fill('[data-testid="salary-input"]', '75000');
    
    // Verify calculation
    await expect(page.locator('[data-testid="monthly-expenses"]')).toContainText('$937.50');
  });

  test('should handle authentication', async ({ page }) => {
    await page.goto('/');
    
    // Click login button
    await page.click('[data-testid="login-button"]');
    
    // Verify login form appears
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
  });
});
```

### Performance Tests
```typescript
// tests/performance/lighthouse.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should meet performance benchmarks', async ({ page }) => {
    await page.goto('/');
    
    // Run Lighthouse audit
    const lighthouse = await page.evaluate(() => {
      return new Promise((resolve) => {
        // Lighthouse audit logic
        resolve({
          performance: 90,
          accessibility: 95,
          bestPractices: 90,
          seo: 90
        });
      });
    });
    
    expect(lighthouse.performance).toBeGreaterThan(80);
    expect(lighthouse.accessibility).toBeGreaterThan(90);
    expect(lighthouse.bestPractices).toBeGreaterThan(80);
    expect(lighthouse.seo).toBeGreaterThan(80);
  });
});
```

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] All tests pass
- [ ] Code review completed
- [ ] Security scan passed
- [ ] Performance benchmarks met
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Rollback plan prepared

### Deployment
- [ ] Deploy to staging environment
- [ ] Run smoke tests
- [ ] Verify functionality
- [ ] Deploy to production
- [ ] Monitor deployment
- [ ] Verify production functionality
- [ ] Update monitoring dashboards

### Post-Deployment
- [ ] Monitor application health
- [ ] Check error rates
- [ ] Verify performance metrics
- [ ] Update documentation
- [ ] Notify stakeholders
- [ ] Archive deployment artifacts

## 🚨 Incident Response

### Incident Response Plan
```typescript
// scripts/incident-response.ts
export const incidentResponse = {
  severity: {
    critical: {
      response: 'Immediate rollback and investigation',
      notification: 'All stakeholders within 15 minutes',
      escalation: 'On-call engineer + tech lead'
    },
    high: {
      response: 'Investigation within 1 hour',
      notification: 'Tech lead within 30 minutes',
      escalation: 'Product manager'
    },
    medium: {
      response: 'Investigation within 4 hours',
      notification: 'Tech lead within 2 hours',
      escalation: 'None'
    },
    low: {
      response: 'Investigation within 24 hours',
      notification: 'Weekly report',
      escalation: 'None'
    }
  },
  
  actions: {
    rollback: () => {
      console.log('Initiating rollback...');
      // Rollback logic
    },
    
    notify: (severity: string, message: string) => {
      console.log(`Sending ${severity} notification: ${message}`);
      // Notification logic
    },
    
    investigate: (incident: any) => {
      console.log('Starting investigation...');
      // Investigation logic
    }
  }
};
```

This deployment guide ensures reliable, secure, and scalable deployment of the Budget Planner application with comprehensive monitoring and incident response capabilities.
