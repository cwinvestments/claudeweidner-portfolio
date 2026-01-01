-- Migration: Create expenses table for tracking recurring costs
-- Run this in Supabase SQL Editor
--
-- SAFE: This migration only CREATES a new table. It does NOT modify or delete
-- any existing tables in your database.

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,  -- Nullable for general expenses
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Hosting', 'Database', 'Domain', 'API', 'Software', 'Other')),
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly', 'one-time')),
  next_billing_date DATE,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_expenses_project_id ON expenses(project_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_is_active ON expenses(is_active);

-- Create updated_at trigger for expenses
DROP TRIGGER IF EXISTS update_expenses_updated_at ON expenses;
CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE expenses IS 'Recurring and one-time expenses for portfolio projects';
COMMENT ON COLUMN expenses.project_id IS 'Optional link to a project, NULL for general business expenses';
COMMENT ON COLUMN expenses.billing_cycle IS 'monthly, yearly, or one-time payment';
COMMENT ON COLUMN expenses.amount IS 'Cost amount in the billing cycle (monthly amount for monthly, yearly amount for yearly)';
