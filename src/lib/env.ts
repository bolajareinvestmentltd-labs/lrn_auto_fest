// Environment variable validation and types

export const env = {
  // App
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  nodeEnv: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',

  // Supabase
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  databaseUrl: process.env.DATABASE_URL || '',

  // Payment Gateways
  paystack: {
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    secretKey: process.env.PAYSTACK_SECRET_KEY || '',
    webhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET || '',
  },
  flutterwave: {
    publicKey: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || '',
    secretKey: process.env.FLUTTERWAVE_SECRET_KEY || '',
    webhookSecret: process.env.FLUTTERWAVE_WEBHOOK_SECRET || '',
  },

  // Email
  resend: {
    apiKey: process.env.RESEND_API_KEY || '',
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || '',
    adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL || '',
  },

  // Event Configuration
  event: {
    date: process.env.NEXT_PUBLIC_EVENT_DATE || '2026-05-30T00:00:00Z',
    name: process.env.NEXT_PUBLIC_EVENT_NAME || 'Ilorin Automotive Festival 2026',
    location: process.env.NEXT_PUBLIC_EVENT_LOCATION || 'Metropolitan Square, Asadam Road, Ilorin, Nigeria',
    presaleEndDate: process.env.NEXT_PUBLIC_PRESALE_END_DATE || '2026-03-31T23:59:59Z',
  },

  // Debug
  debug: process.env.DEBUG === 'true',
};

// Validate required environment variables in production
if (env.nodeEnv === 'production') {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'DATABASE_URL',
    'NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY',
    'PAYSTACK_SECRET_KEY',
    'RESEND_API_KEY',
  ];

  const missing = requiredVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
