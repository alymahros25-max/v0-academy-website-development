-- =============================================================================
-- CLASSROOM VIDEOS TABLE
-- Stores video lectures and promotional clips for the academy
-- =============================================================================

CREATE TABLE IF NOT EXISTS classroom_videos (
  id BIGSERIAL PRIMARY KEY,
  
  -- Multi-language content (AR/EN/FR)
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_fr TEXT NOT NULL,
  
  description_ar TEXT,
  description_en TEXT,
  description_fr TEXT,
  
  teacher_name_ar TEXT,
  teacher_name_en TEXT,
  teacher_name_fr TEXT,
  
  -- YouTube integration
  youtube_url TEXT NOT NULL, -- Full URL: https://www.youtube.com/watch?v=xxxxx
  youtube_embed_id TEXT NOT NULL UNIQUE, -- Extracted ID: xxxxx
  
  -- Metadata
  category VARCHAR(100), -- e.g., "tajweed", "quran", "arabic", "promotional"
  thumbnail_url TEXT, -- Can be auto-generated from YouTube
  duration_seconds INT,
  
  -- Publishing status
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  
  -- Audit trail
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by BIGINT REFERENCES cms_users(id) ON DELETE SET NULL,
  updated_by BIGINT REFERENCES cms_users(id) ON DELETE SET NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_classroom_videos_published ON classroom_videos(is_published);
CREATE INDEX IF NOT EXISTS idx_classroom_videos_featured ON classroom_videos(is_featured);
CREATE INDEX IF NOT EXISTS idx_classroom_videos_display_order ON classroom_videos(display_order);
CREATE INDEX IF NOT EXISTS idx_classroom_videos_category ON classroom_videos(category);
CREATE INDEX IF NOT EXISTS idx_classroom_videos_embed_id ON classroom_videos(youtube_embed_id);
CREATE INDEX IF NOT EXISTS idx_classroom_videos_created_at ON classroom_videos(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE classroom_videos ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can read published videos
CREATE POLICY "allow_public_read_published_videos" ON classroom_videos
  FOR SELECT USING (is_published = true);

-- RLS Policy: Authenticated users can read all videos (for admin)
CREATE POLICY "allow_authenticated_read_all_videos" ON classroom_videos
  FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policy: Only admins can create/update/delete
-- This should be checked at the API level with proper permissions
CREATE POLICY "allow_admin_manage_videos" ON classroom_videos
  FOR ALL USING (
    auth.uid() IN (
      SELECT auth_user_id FROM cms_users 
      WHERE role_type = 'admin' AND is_active = true
    )
  );
