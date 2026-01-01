import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy initialization to avoid build-time errors when env vars aren't available
let _supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdmin) {
    return _supabaseAdmin;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase is not configured. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  }

  _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return _supabaseAdmin;
}

// Export as a getter - use supabaseAdmin in API routes
export const supabaseAdmin = {
  from: (table: string) => getSupabaseAdmin().from(table),
};

// Types for database tables
export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface ProjectUrls {
  production_url?: string;
  staging_url?: string;
  github_repo?: string;
  netlify_dashboard?: string;
  railway_dashboard?: string;
  supabase_dashboard?: string;
  [key: string]: string | undefined;
}

// Service-specific credential types
export interface GitHubCredentials {
  username?: string;
  password?: string; // Personal access token
}

export interface NetlifyCredentials {
  email?: string;
  password?: string;
}

export interface RailwayCredentials {
  email?: string;
  password?: string;
}

export interface SupabaseCredentials {
  email?: string;
  password?: string;
  database_password?: string;
}

export interface GeneralCredential {
  id: string;
  service_name: string;
  url?: string;
  username?: string;
  password?: string;
  notes?: string;
}

export interface ProjectCredentials {
  // Service-specific credentials
  github?: GitHubCredentials;
  netlify?: NetlifyCredentials;
  railway?: RailwayCredentials;
  supabase?: SupabaseCredentials;
  // General credentials for other services
  general?: GeneralCredential[];
  // Legacy fields (for backward compatibility)
  admin_email?: string;
  admin_password?: string;
  api_keys?: Array<{ name: string; key: string }>;
  database_connection_string?: string;
  other?: Array<{ name: string; value: string }>;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  status: 'live' | 'development' | 'paused';
  urls: ProjectUrls;
  credentials: ProjectCredentials;
  tech_stack: string[];
  description: string | null;
  notes: string | null;
  monthly_cost: number;
  revenue: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectInsert {
  name: string;
  slug: string;
  status?: 'live' | 'development' | 'paused';
  urls?: ProjectUrls;
  credentials?: ProjectCredentials;
  tech_stack?: string[];
  description?: string;
  notes?: string;
  monthly_cost?: number;
  revenue?: number;
}

export type ExpenseCategory = 'Hosting' | 'Database' | 'Domain' | 'API' | 'Software' | 'Other';
export type BillingCycle = 'monthly' | 'yearly' | 'one-time';

export interface Expense {
  id: string;
  project_id: string | null;
  name: string;
  category: ExpenseCategory;
  amount: number;
  billing_cycle: BillingCycle;
  next_billing_date: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExpenseInsert {
  project_id?: string | null;
  name: string;
  category: ExpenseCategory;
  amount: number;
  billing_cycle?: BillingCycle;
  next_billing_date?: string | null;
  notes?: string | null;
  is_active?: boolean;
}
