-- Update the profiles table to include all doctor profile fields
-- Run this SQL in your Supabase SQL editor

-- Add additional columns to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS specialization text,
ADD COLUMN IF NOT EXISTS experience text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS clinic text,
ADD COLUMN IF NOT EXISTS qualifications text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS registration_number text,
ADD COLUMN IF NOT EXISTS about text,
ADD COLUMN IF NOT EXISTS avatar text;

-- Update the updated_at trigger to work properly
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure the trigger exists for updated_at
DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles;
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add RLS (Row Level Security) policies if not already present
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read their own profile
CREATE POLICY IF NOT EXISTS "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy to allow users to update their own profile
CREATE POLICY IF NOT EXISTS "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy to allow users to insert their own profile
CREATE POLICY IF NOT EXISTS "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
