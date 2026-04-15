-- Create competitors table
CREATE TABLE competitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create snapshots table
CREATE TABLE snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
    screenshot_url TEXT NOT NULL,
    price_data JSONB,
    change_detected BOOLEAN DEFAULT FALSE,
    category TEXT, -- Price, Design, Product
    description TEXT,
    impact_score INTEGER CHECK (impact_score >= 1 AND impact_score <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Optional but recommended)
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE snapshots ENABLE ROW LEVEL SECURITY;

-- Simple policy for development (allow all for now)
CREATE POLICY "Allow all for now" ON competitors FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON snapshots FOR ALL USING (true);

-- Create Storage bucket for screenshots
INSERT INTO storage.buckets (id, name, public) VALUES ('screenshots', 'screenshots', true) ON CONFLICT DO NOTHING;

-- Allow public access to read screenshots
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'screenshots');

-- Allow anon and authenticated users to insert screenshots
CREATE POLICY "Anon/Auth Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'screenshots');
