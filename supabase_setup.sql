-- ============================================
-- FieldTrip Club MVP - Supabase Setup
-- ============================================

-- 1. Trips Table
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Trip Members Table (Users who joined trips)
CREATE TABLE IF NOT EXISTS trip_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(trip_id, user_id)
);

-- 3. Trip Comments Table
CREATE TABLE IF NOT EXISTS trip_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  bio TEXT,
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Trips: Anyone can read, only creator can update/delete
CREATE POLICY "Trips are viewable by everyone" ON trips
  FOR SELECT USING (true);

CREATE POLICY "Trips are created by authenticated user" ON trips
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Trips can be updated by creator" ON trips
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Trips can be deleted by creator" ON trips
  FOR DELETE USING (auth.uid() = created_by);

-- Trip Members: Anyone can read, users can join/leave
CREATE POLICY "Trip members are viewable by everyone" ON trip_members
  FOR SELECT USING (true);

CREATE POLICY "Users can join trips" ON trip_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave trips" ON trip_members
  FOR DELETE USING (auth.uid() = user_id);

-- Trip Comments: Anyone can read, authenticated users can comment
CREATE POLICY "Comments are viewable by everyone" ON trip_comments
  FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON trip_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON trip_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON trip_comments
  FOR DELETE USING (auth.uid() = user_id);

-- User Profiles: Anyone can read, users can update own
CREATE POLICY "Profiles are viewable by everyone" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS trips_created_by ON trips(created_by);
CREATE INDEX IF NOT EXISTS trips_date ON trips(date);
CREATE INDEX IF NOT EXISTS trip_members_user_id ON trip_members(user_id);
CREATE INDEX IF NOT EXISTS trip_members_trip_id ON trip_members(trip_id);
CREATE INDEX IF NOT EXISTS trip_comments_trip_id ON trip_comments(trip_id);
CREATE INDEX IF NOT EXISTS trip_comments_user_id ON trip_comments(user_id);
