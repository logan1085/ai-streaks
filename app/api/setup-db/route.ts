import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Create api_keys table
    await supabase.rpc('sql', {
      query: `
        CREATE TABLE IF NOT EXISTS api_keys (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          provider TEXT NOT NULL,
          key_name TEXT NOT NULL,
          encrypted_key TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, provider)
        );
        
        CREATE TABLE IF NOT EXISTS user_streaks (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          date DATE NOT NULL,
          message_count INTEGER DEFAULT 0,
          current_streak INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, date)
        );
        
        ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
        ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can manage their own API keys" ON api_keys;
        CREATE POLICY "Users can manage their own API keys" ON api_keys
          FOR ALL USING (auth.uid() = user_id);
        
        DROP POLICY IF EXISTS "Users can manage their own streaks" ON user_streaks;
        CREATE POLICY "Users can manage their own streaks" ON user_streaks
          FOR ALL USING (auth.uid() = user_id);
      `
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ error: 'Failed to setup database' }, { status: 500 })
  }
} 