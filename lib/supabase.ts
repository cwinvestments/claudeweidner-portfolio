import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use service role key for admin operations (server-side only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

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

export interface ProjectCredentials {
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
