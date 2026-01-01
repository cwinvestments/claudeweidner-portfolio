-- Migration: Seed initial admin user
-- Run this AFTER creating the tables
--
-- IMPORTANT: The password hash below is for initial setup only.
-- Change the password immediately after first login!
--
-- This creates: cwaffiliateinvestments@gmail.com with a temporary password
-- The actual password will need to be set via the app or replaced here

-- Generate a password hash using bcrypt
-- You'll need to generate this in Node.js:
--
-- const bcrypt = require('bcryptjs');
-- const hash = await bcrypt.hash('your-secure-password', 12);
-- console.log(hash);
--
-- Then replace the placeholder below with the actual hash.

-- Placeholder insert (replace GENERATED_HASH with actual bcrypt hash)
-- INSERT INTO admin_users (email, password_hash)
-- VALUES ('cwaffiliateinvestments@gmail.com', 'GENERATED_HASH')
-- ON CONFLICT (email) DO NOTHING;

-- For now, we'll create the user via the API on first setup
