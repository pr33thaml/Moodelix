-- Test query to check if profile data is accessible
-- Run this in your Supabase SQL Editor

-- Test 1: Check if profile exists
SELECT id, email, name, image_url FROM profiles WHERE id = 'cd638f34-d450-41e0-adc6-98af1e664c0c';

-- Test 2: Check if user_preferences exists
SELECT id, timer_durations, auto_break_settings FROM user_preferences WHERE id = 'cd638f34-d450-41e0-adc6-98af1e664c0c';

-- Test 3: Check if streak_data exists
SELECT id, current_streak, total_focused_hours FROM streak_data WHERE id = 'cd638f34-d450-41e0-adc6-98af1e664c0c';

-- Test 4: Test the exact query the app is using
SELECT 
  p.*,
  sd.*,
  up.*
FROM profiles p
LEFT JOIN streak_data sd ON p.id = sd.id
LEFT JOIN user_preferences up ON p.id = up.id
WHERE p.id = 'cd638f34-d450-41e0-adc6-98af1e664c0c';

-- Test 5: Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('profiles', 'user_preferences', 'streak_data')
ORDER BY tablename, policyname;
