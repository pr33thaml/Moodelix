-- Create profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_preferences table
CREATE TABLE user_preferences (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  timer_durations JSONB DEFAULT '{"focus": 25, "shortBreak": 5, "longBreak": 15}',
  auto_break_settings JSONB DEFAULT '{"enabled": true, "breakDuration": 10, "skipBreaks": false}',
  blur_intensity INTEGER DEFAULT 10,
  wallpaper_brightness TEXT DEFAULT 'normal' CHECK (wallpaper_brightness IN ('darker', 'dark', 'normal', 'bright')),
  sound_effects_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create streak_data table
CREATE TABLE streak_data (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  current_streak INTEGER DEFAULT 0,
  total_focused_hours DECIMAL(10,2) DEFAULT 0,
  daily_goal INTEGER DEFAULT 4,
  today_focused_minutes INTEGER DEFAULT 0,
  last_focus_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create focus_sessions table (for detailed tracking)
CREATE TABLE focus_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  duration_minutes INTEGER NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('focus', 'shortBreak', 'longBreak')),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE streak_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow system to insert profiles during user creation (for trigger)
CREATE POLICY "System can insert profiles during user creation" ON profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow system to insert preferences during user creation (for trigger)
CREATE POLICY "System can insert preferences during user creation" ON user_preferences
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own streak data" ON streak_data
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own streak data" ON streak_data
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own streak data" ON streak_data
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow system to insert streak data during user creation (for trigger)
CREATE POLICY "System can insert streak data during user creation" ON streak_data
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own focus sessions" ON focus_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own focus sessions" ON focus_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user signup
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

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_streak_data_updated_at
  BEFORE UPDATE ON streak_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
