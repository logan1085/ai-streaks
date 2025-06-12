-- Learning templates table
CREATE TABLE learning_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  difficulty_level TEXT DEFAULT 'beginner',
  total_lessons INTEGER DEFAULT 0,
  estimated_days INTEGER DEFAULT 7,
  chat_history JSONB, -- Store the original chat that created this template
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Individual lessons within a template
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES learning_templates(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  lesson_title TEXT NOT NULL,
  lesson_content JSONB NOT NULL, -- Store lesson structure (questions, explanations, etc.)
  lesson_type TEXT DEFAULT 'practice', -- practice, review, test, etc.
  estimated_duration INTEGER DEFAULT 10, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(template_id, day_number)
);

-- User progress on lessons
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  template_id UUID REFERENCES learning_templates(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started', -- not_started, in_progress, completed, mastered
  score INTEGER DEFAULT 0, -- percentage score
  attempts INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- in seconds
  completed_at TIMESTAMP WITH TIME ZONE,
  last_attempted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, lesson_id)
);

-- User's active learning paths
CREATE TABLE user_learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES learning_templates(id) ON DELETE CASCADE,
  current_day INTEGER DEFAULT 1,
  streak_count INTEGER DEFAULT 0,
  last_lesson_date DATE,
  is_active BOOLEAN DEFAULT true,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, template_id)
);

-- Enable Row Level Security
ALTER TABLE learning_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_paths ENABLE ROW LEVEL SECURITY;

-- Policies for learning_templates
CREATE POLICY "Users can manage their own templates" ON learning_templates
  FOR ALL USING (auth.uid() = user_id);

-- Policies for lessons (users can read lessons from their templates)
CREATE POLICY "Users can read lessons from their templates" ON lessons
  FOR SELECT USING (
    template_id IN (
      SELECT id FROM learning_templates WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create lessons for their templates" ON lessons
  FOR INSERT WITH CHECK (
    template_id IN (
      SELECT id FROM learning_templates WHERE user_id = auth.uid()
    )
  );

-- Policies for lesson_progress
CREATE POLICY "Users can manage their own progress" ON lesson_progress
  FOR ALL USING (auth.uid() = user_id);

-- Policies for user_learning_paths
CREATE POLICY "Users can manage their own learning paths" ON user_learning_paths
  FOR ALL USING (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX idx_learning_templates_user_id ON learning_templates(user_id);
CREATE INDEX idx_lessons_template_id ON lessons(template_id);
CREATE INDEX idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_template_id ON lesson_progress(template_id);
CREATE INDEX idx_user_learning_paths_user_id ON user_learning_paths(user_id);
CREATE INDEX idx_user_learning_paths_active ON user_learning_paths(user_id, is_active); 