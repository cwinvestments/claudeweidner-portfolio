-- Migration: Create admin dashboard tables
-- Run this in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for encryption functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'development' CHECK (status IN ('live', 'development', 'paused')),
  urls JSONB DEFAULT '{}'::jsonb,
  credentials JSONB DEFAULT '{}'::jsonb,  -- Will be encrypted at application level
  tech_stack TEXT[] DEFAULT '{}',
  description TEXT,
  notes TEXT,
  monthly_cost DECIMAL(10, 2) DEFAULT 0,
  revenue DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for projects table
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) - Disable for server-side access only
-- Since this is a private admin dashboard accessed via server-side API routes,
-- we'll handle auth at the application level with JWT

-- Grant usage to authenticated role (if using Supabase Auth later)
-- For now, we'll use the service role key for all operations

-- Comments for documentation
COMMENT ON TABLE admin_users IS 'Admin users for the portfolio dashboard';
COMMENT ON TABLE projects IS 'Portfolio projects with URLs, credentials, and financial data';
COMMENT ON COLUMN projects.credentials IS 'Encrypted JSON containing sensitive login information';
COMMENT ON COLUMN projects.urls IS 'JSON object with production_url, staging_url, github_repo, etc.';
