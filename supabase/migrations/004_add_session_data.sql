-- Add session_data field to lesson_progress table to store tutoring conversations
ALTER TABLE lesson_progress 
ADD COLUMN session_data JSONB DEFAULT NULL;

-- Add comment to explain the field
COMMENT ON COLUMN lesson_progress.session_data IS 'Stores the complete tutoring session conversation and context for future AI reference'; 