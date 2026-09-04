-- Secure Networking Tracker schema for Neon Postgres + Data API.
-- Run this in the Neon SQL editor after enabling Managed Better Auth and the Data API.

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_session_jwt;

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL DEFAULT auth.user_id(),
  name text NOT NULL CHECK (length(btrim(name)) > 0),
  company text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT '',
  where_met text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION set_contacts_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS contacts_set_updated_at ON contacts;
CREATE TRIGGER contacts_set_updated_at
BEFORE UPDATE ON contacts
FOR EACH ROW
EXECUTE FUNCTION set_contacts_updated_at();

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS contacts_select_own_rows ON contacts;
CREATE POLICY contacts_select_own_rows
ON contacts
FOR SELECT
TO authenticated
USING (auth.user_id() = user_id);

DROP POLICY IF EXISTS contacts_insert_own_rows ON contacts;
CREATE POLICY contacts_insert_own_rows
ON contacts
FOR INSERT
TO authenticated
WITH CHECK (auth.user_id() = user_id);

DROP POLICY IF EXISTS contacts_update_own_rows ON contacts;
CREATE POLICY contacts_update_own_rows
ON contacts
FOR UPDATE
TO authenticated
USING (auth.user_id() = user_id)
WITH CHECK (auth.user_id() = user_id);

DROP POLICY IF EXISTS contacts_delete_own_rows ON contacts;
CREATE POLICY contacts_delete_own_rows
ON contacts
FOR DELETE
TO authenticated
USING (auth.user_id() = user_id);

CREATE INDEX IF NOT EXISTS contacts_user_id_created_at_idx
ON contacts (user_id, created_at DESC);
