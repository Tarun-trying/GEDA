-- ========================================================
-- GreenSaathi (GEDA Mission LiFE) Supabase Database Schema
-- Run this in your Supabase Project's SQL Editor
-- ========================================================

-- 1. Create Profiles Table (Stores user citizen stats & district)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  district TEXT DEFAULT 'Ahmedabad',
  discom TEXT DEFAULT 'UGVCL',
  total_points INTEGER DEFAULT 0,
  monthly_kwh NUMERIC DEFAULT 0,
  monthly_bill NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Completed Challenges Table
CREATE TABLE IF NOT EXISTS public.user_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  points_earned INTEGER DEFAULT 15,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- 3. Create Electricity Bills Table
CREATE TABLE IF NOT EXISTS public.user_bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  units_kwh NUMERIC NOT NULL,
  bill_amount_inr NUMERIC DEFAULT 0,
  discom TEXT DEFAULT 'UGVCL',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bills ENABLE ROW LEVEL SECURITY;

-- 5. Row Level Security Policies
-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- User Challenges: Users can view and insert their completed challenges
CREATE POLICY "Users can view own challenges" 
  ON public.user_challenges FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenges" 
  ON public.user_challenges FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- User Bills: Users can manage their own bills
CREATE POLICY "Users can view own bills" 
  ON public.user_bills FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bills" 
  ON public.user_bills FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bills" 
  ON public.user_bills FOR DELETE 
  USING (auth.uid() = user_id);

-- 6. Trigger to automatically create a Profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, district, total_points)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Eco Citizen'),
    COALESCE(NEW.raw_user_meta_data->>'district', 'Ahmedabad'),
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if already exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

