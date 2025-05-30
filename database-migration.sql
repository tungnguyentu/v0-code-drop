-- CodeDrop Database Migration: Add Owner Code System
-- Run this script on your Supabase database to add owner management functionality

-- Add owner code column for snippet management
ALTER TABLE pastes ADD COLUMN IF NOT EXISTS owner_code VARCHAR(32);

-- Add optional IP tracking column
ALTER TABLE pastes ADD COLUMN IF NOT EXISTS created_ip VARCHAR(45);

-- Add index for better performance on owner code lookups
CREATE INDEX IF NOT EXISTS idx_pastes_owner_code ON pastes(owner_code);

-- Add comments for documentation
COMMENT ON COLUMN pastes.owner_code IS 'Hashed owner code for full snippet management access (edit and delete)';
COMMENT ON COLUMN pastes.created_ip IS 'IP address of the snippet creator (optional)';

-- Note: Existing snippets created before this migration will have NULL values
-- for the owner_code field. These snippets will not be manageable through the 
-- owner system unless manually updated with generated codes. 