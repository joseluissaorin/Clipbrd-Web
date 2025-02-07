const productionConfig = {
  // Server Configuration
  server: {
    host: 'https://clipbrdapp.com',
    api: {
      baseUrl: 'https://api.clipbrdapp.com',
      timeout: 10000, // 10 seconds
      retries: 3,
    },
    rateLimit: {
      verifyWindow: 3600, // 1 hour
      verifyMax: 360,     // 360 requests per hour
      failedWindow: 3600, // 1 hour
      failedMax: 10,      // 10 failed attempts per hour
    },
  },

  // Database Configuration
  database: {
    poolSize: 20,
    ssl: true,
    timezone: 'UTC',
  },

  // Cache Configuration
  cache: {
    license: {
      ttl: 3600,  // 1 hour
      maxSize: 10000,
    },
    user: {
      ttl: 300,   // 5 minutes
      maxSize: 1000,
    },
  },

  // Security Configuration
  security: {
    bcryptRounds: 12,
    jwtExpiry: '7d',
    cookieSecure: true,
    corsOrigins: [
      'https://clipbrdapp.com',
      'https://www.clipbrdapp.com',
    ],
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://analytics.umami.is; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.clipbrdapp.com https://api.stripe.com;",
    },
  },

  // Email Configuration
  email: {
    from: 'Clipbrd <noreply@clipbrdapp.com>',
    support: 'support@clipbrdapp.com',
    templates: {
      welcome: 'd-xxxxxxxxxxxxx',
      resetPassword: 'd-xxxxxxxxxxxxx',
      licenseIssued: 'd-xxxxxxxxxxxxx',
      subscriptionCanceled: 'd-xxxxxxxxxxxxx',
    },
  },

  // Monitoring Configuration
  monitoring: {
    sentry: {
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 0.1,
    },
    umami: {
      websiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
      url: process.env.NEXT_PUBLIC_UMAMI_URL,
    },
  },

  // Feature Flags
  features: {
    imageSupport: true,
    multipleDevices: true,
    offlineMode: true,
    apiAccess: true,
  },

  // Error Pages
  errorPages: {
    notFound: '/404',
    serverError: '/500',
    maintenance: '/maintenance',
  },

  // External Services
  services: {
    stripe: {
      webhookTolerance: 300, // 5 minutes
      subscriptionGracePeriod: 86400, // 24 hours
    },
    supabase: {
      realtimeEnabled: false,
      autoRefreshToken: true,
    },
  },

  // Performance Tuning
  performance: {
    pageSizeLimit: 100,
    maxRequestSize: '1mb',
    compressionLevel: 6,
    cacheControl: {
      static: 'public, max-age=31536000, immutable',
      api: 'no-cache, no-store, must-revalidate',
    },
  },
};

export default productionConfig; 