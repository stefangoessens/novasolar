-- Create the bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  date TIMESTAMPTZ,
  timeSlot JSONB,
  numWindows INTEGER,
  numStories INTEGER,
  cleaningType TEXT,
  additionalServices JSONB,
  quote JSONB,
  personalDetails JSONB,
  serviceDetails JSONB
);

-- Create the settings table
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  BASE_RATE_PER_WINDOW REAL,
  TWO_STORY_SURCHARGE REAL,
  INSIDE_CLEANING_SURCHARGE_PER_WINDOW REAL,
  TRACK_CLEANING_RATE REAL,
  SCREEN_CLEANING_RATE REAL,
  HARD_WATER_RATE REAL,
  DEFAULT_WINDOW_PER_SQFT REAL,
  last_updated TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Bookings table RLS policies
CREATE POLICY "Enable read access for all users" 
ON "public"."bookings" FOR SELECT 
USING (true);

CREATE POLICY "Enable insert for all users" 
ON "public"."bookings" FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" 
ON "public"."bookings" FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Enable delete for authenticated users only" 
ON "public"."bookings" FOR DELETE 
TO authenticated 
USING (true);

-- Settings table RLS policies
CREATE POLICY "Enable read access for settings for all users" 
ON "public"."settings" FOR SELECT 
USING (true);

CREATE POLICY "Enable write access for settings for authenticated users only" 
ON "public"."settings" FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable update for settings for authenticated users only" 
ON "public"."settings" FOR UPDATE 
TO authenticated 
USING (true);