-- Migration: Add clients table and project type to projects
-- Run this in Supabase SQL Editor
--
-- This migration:
-- 1. Creates a new "clients" table
-- 2. Adds "project_type" and "client_id" columns to the "projects" table

-- ============================================================================
-- PART 1: Create clients table
-- ============================================================================

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  website TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
CREATE INDEX IF NOT EXISTS idx_clients_is_active ON clients(is_active);

-- Create updated_at trigger for clients
DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE clients IS 'Clients for client projects';
COMMENT ON COLUMN clients.name IS 'Client name (person or company)';
COMMENT ON COLUMN clients.company IS 'Company name if different from name';
COMMENT ON COLUMN clients.notes IS 'Private notes about the client';

-- ============================================================================
-- PART 2: Update projects table
-- ============================================================================

-- Add project_type column (personal or client)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'project_type'
  ) THEN
    ALTER TABLE projects
    ADD COLUMN project_type TEXT NOT NULL DEFAULT 'personal'
    CHECK (project_type IN ('personal', 'client'));
  END IF;
END $$;

-- Add client_id foreign key column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'client_id'
  ) THEN
    ALTER TABLE projects
    ADD COLUMN client_id UUID REFERENCES clients(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create index for client_id lookups
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_project_type ON projects(project_type);

-- Comments
COMMENT ON COLUMN projects.project_type IS 'Type of project: personal or client';
COMMENT ON COLUMN projects.client_id IS 'Reference to client for client projects';
