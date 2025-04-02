# Firebase to Supabase Migration Guide

This document outlines the steps taken to migrate the application from Firebase to Supabase.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [https://supabase.com/](https://supabase.com/) and sign up for an account
2. Create a new project
3. Note your project URL and anon key

### 2. Configure Supabase in the Application

Update the `/src/supabase.js` file with your project details:

```javascript
import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase project details
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseKey = 'your-anon-key';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
```

### 3. Set Up Database Tables

You'll need to create the following tables in your Supabase project:

#### Bookings Table

Create a table called `bookings` with the following schema:

| Column Name | Type | Default | Description |
|-------------|------|---------|-------------|
| id | uuid | `gen_random_uuid()` | Primary key |
| created_at | timestamp with time zone | `now()` | Creation timestamp |
| name | text | | Customer name |
| email | text | | Customer email |
| phone | text | | Customer phone |
| address | text | | Service address |
| date | timestamp with time zone | | Scheduled service date |
| timeSlot | jsonb | | Selected time slot |
| numWindows | integer | | Number of windows |
| numStories | integer | | Number of stories |
| cleaningType | text | | Type of cleaning |
| additionalServices | jsonb | | Additional selected services |
| quote | jsonb | | Quote details |
| personalDetails | jsonb | | Personal details |
| serviceDetails | jsonb | | Service details |

#### Settings Table

Create a table called `settings` with the following schema:

| Column Name | Type | Default | Description |
|-------------|------|---------|-------------|
| id | text | | Primary key (use 'pricing' for pricing settings) |
| BASE_RATE_PER_WINDOW | real | | Base price per window |
| TWO_STORY_SURCHARGE | real | | Surcharge for two-story buildings |
| INSIDE_CLEANING_SURCHARGE_PER_WINDOW | real | | Inside cleaning surcharge |
| TRACK_CLEANING_RATE | real | | Track cleaning rate |
| SCREEN_CLEANING_RATE | real | | Screen cleaning rate |
| HARD_WATER_RATE | real | | Hard water treatment rate |
| DEFAULT_WINDOW_PER_SQFT | real | | Default windows per square foot |
| last_updated | timestamp with time zone | `now()` | Last update timestamp |

### 4. Set Up Authentication

1. In your Supabase project, go to Authentication > Providers
2. Configure Email authentication
3. Create a user with the same email/password as your Firebase admin user

### 5. Migrate Data (Optional)

If you have existing data in Firebase that you want to migrate:

1. Export data from Firebase (Firestore > Export)
2. Transform the data to match Supabase schema
3. Import into Supabase tables

## What Changed in the Code

1. Replaced Firebase authentication with Supabase authentication
2. Replaced Firestore database operations with Supabase database operations
3. Updated timestamp handling to work with Supabase's format
4. Changed some field names to follow Supabase conventions (e.g., `lastUpdated` → `last_updated`)

## Using RLS (Row Level Security)

For added security, you can implement Row Level Security in Supabase:

### Bookings Table RLS

```sql
-- Only allow logged-in users to view bookings
CREATE POLICY "Enable read access for authenticated users only" 
ON "public"."bookings" FOR SELECT 
TO authenticated 
USING (true);

-- Only allow logged-in users to insert bookings
CREATE POLICY "Enable insert for all users" 
ON "public"."bookings" FOR INSERT 
WITH CHECK (true);

-- Only allow logged-in users to update their own bookings
CREATE POLICY "Enable update for authenticated users only" 
ON "public"."bookings" FOR UPDATE 
TO authenticated 
USING (true);

-- Only allow logged-in users to delete bookings
CREATE POLICY "Enable delete for authenticated users only" 
ON "public"."bookings" FOR DELETE 
TO authenticated 
USING (true);
```

### Settings Table RLS

```sql
-- Only allow logged-in users to view settings
CREATE POLICY "Enable read access for authenticated users only" 
ON "public"."settings" FOR SELECT 
TO authenticated 
USING (true);

-- Only allow logged-in users to modify settings
CREATE POLICY "Enable write access for authenticated users only" 
ON "public"."settings" FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" 
ON "public"."settings" FOR UPDATE 
TO authenticated 
USING (true);
```

## Additional Notes

- Supabase handles dates as ISO strings by default
- You'll need to use the `supabase` client instead of Firebase's `auth` and `db` objects
- Make sure to handle JSON fields properly (e.g., `additionalServices`, `quote`, etc.)