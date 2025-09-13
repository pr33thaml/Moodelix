-- Dynamic fix for existing user - gets data from auth.users automatically
-- Run this in your Supabase SQL Editor

-- Create missing profile data for existing user
INSERT INTO profiles (id, email, name, image_url)
SELECT 
  id,
  email,
  COALESCE(
    raw_user_meta_data->>'name',
    raw_user_meta_data->>'full_name',
    split_part(email, '@', 1)
  ) as name,
  COALESCE(
    raw_user_meta_data->>'avatar_url',
    raw_user_meta_data->>'picture',
    NULL
  ) as image_url
FROM auth.users 
WHERE id = 'cd638f34-d450-41e0-adc6-98af1e664c0c'
ON CONFLICT (id) DO NOTHING;

-- Create missing user_preferences
INSERT INTO user_preferences (id)
SELECT id FROM auth.users 
WHERE id = 'cd638f34-d450-41e0-adc6-98af1e664c0c'
ON CONFLICT (id) DO NOTHING;

-- Create missing streak_data
INSERT INTO streak_data (id)
SELECT id FROM auth.users 
WHERE id = 'cd638f34-d450-41e0-adc6-98af1e664c0c'
ON CONFLICT (id) DO NOTHING;

-- Verify the data was created
SELECT 
  p.id, 
  p.email, 
  p.name, 
  p.image_url,
  up.timer_durations,
  sd.current_streak
FROM profiles p
LEFT JOIN user_preferences up ON p.id = up.id
LEFT JOIN streak_data sd ON p.id = sd.id
WHERE p.id = 'cd638f34-d450-41e0-adc6-98af1e664c0c';
