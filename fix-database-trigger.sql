-- Fix for "Database error saving new user" issue
-- Run this script in your Supabase SQL Editor

-- First, drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create the improved function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_name TEXT;
  user_avatar_url TEXT;
BEGIN
  -- Safely extract name and avatar_url with fallbacks
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  );
  
  user_avatar_url := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture',
    NULL
  );
  
  -- Insert profile with safe values
  INSERT INTO profiles (id, email, name, image_url)
  VALUES (NEW.id, NEW.email, user_name, user_avatar_url);
  
  -- Insert default preferences
  INSERT INTO user_preferences (id)
  VALUES (NEW.id);
  
  -- Insert default streak data
  INSERT INTO streak_data (id)
  VALUES (NEW.id);
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Add system policies to allow trigger to insert data
-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "System can insert profiles during user creation" ON profiles;
DROP POLICY IF EXISTS "System can insert preferences during user creation" ON user_preferences;
DROP POLICY IF EXISTS "System can insert streak data during user creation" ON streak_data;

-- Create system policies to allow trigger to insert data
CREATE POLICY "System can insert profiles during user creation" ON profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can insert preferences during user creation" ON user_preferences
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can insert streak data during user creation" ON streak_data
  FOR INSERT WITH CHECK (true);
