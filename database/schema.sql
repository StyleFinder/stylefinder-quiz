-- StyleFinder Quiz Database Schema
-- This creates tables for storing quiz submissions and results

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Quiz submissions table
CREATE TABLE quiz_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- User information
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,

  -- Timestamps
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Quiz responses (stored as JSONB for flexibility)
  section1_responses JSONB NOT NULL,
  section2_responses JSONB NOT NULL,

  -- Calculated results
  scores JSONB NOT NULL, -- {"A": 10, "B": 5, "C": 8, ...}
  primary_style VARCHAR(50) NOT NULL,
  primary_score INTEGER NOT NULL,
  secondary_style VARCHAR(50) NOT NULL,
  secondary_score INTEGER NOT NULL,
  supporting_style VARCHAR(50) NOT NULL,
  supporting_score INTEGER NOT NULL,

  -- Email status tracking
  email_sent BOOLEAN DEFAULT FALSE,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  email_error TEXT,
  email_retry_count INTEGER DEFAULT 0,

  -- Additional metadata
  ip_address VARCHAR(45),
  user_agent TEXT,
  session_id VARCHAR(255),

  -- Indexing
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_quiz_submissions_email ON quiz_submissions(user_email);
CREATE INDEX idx_quiz_submissions_submitted_at ON quiz_submissions(submitted_at DESC);
CREATE INDEX idx_quiz_submissions_email_sent ON quiz_submissions(email_sent);
CREATE INDEX idx_quiz_submissions_primary_style ON quiz_submissions(primary_style);

-- Email queue table for retry mechanism
CREATE TABLE email_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID REFERENCES quiz_submissions(id) ON DELETE CASCADE,

  -- Email details
  recipient_email VARCHAR(255) NOT NULL,
  email_type VARCHAR(50) NOT NULL DEFAULT 'coach_notification',
  email_data JSONB NOT NULL,

  -- Status tracking
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, sent, failed
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,

  -- Error tracking
  last_error TEXT,
  last_attempt_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  sent_at TIMESTAMP WITH TIME ZONE
);

-- Index for email queue processing
CREATE INDEX idx_email_queue_status ON email_queue(status, scheduled_for);
CREATE INDEX idx_email_queue_submission ON email_queue(submission_id);

-- Admin access logs
CREATE TABLE admin_access_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  admin_email VARCHAR(255),
  action VARCHAR(100) NOT NULL,
  submission_id UUID REFERENCES quiz_submissions(id) ON DELETE SET NULL,
  ip_address VARCHAR(45),
  user_agent TEXT
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_quiz_submissions_updated_at
  BEFORE UPDATE ON quiz_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- View for admin dashboard
CREATE VIEW quiz_results_summary AS
SELECT
  qs.id,
  qs.user_name,
  qs.user_email,
  qs.submitted_at,
  qs.primary_style,
  qs.primary_score,
  qs.secondary_style,
  qs.secondary_score,
  qs.supporting_style,
  qs.supporting_score,
  qs.email_sent,
  qs.email_sent_at,
  CASE
    WHEN qs.email_sent = true THEN 'Sent'
    WHEN eq.status = 'processing' THEN 'Processing'
    WHEN eq.status = 'failed' AND eq.attempts >= eq.max_attempts THEN 'Failed - Max Retries'
    WHEN eq.status = 'failed' THEN 'Failed - Retrying'
    WHEN eq.status = 'pending' THEN 'Queued'
    ELSE 'Not Sent'
  END as email_status,
  eq.attempts as email_attempts,
  eq.last_error as email_last_error
FROM quiz_submissions qs
LEFT JOIN email_queue eq ON eq.submission_id = qs.id AND eq.email_type = 'coach_notification'
ORDER BY qs.submitted_at DESC;

-- Function to get recent submissions
CREATE OR REPLACE FUNCTION get_recent_submissions(
  p_limit INTEGER DEFAULT 100,
  p_days INTEGER DEFAULT 7
)
RETURNS TABLE (
  id UUID,
  user_name VARCHAR,
  user_email VARCHAR,
  submitted_at TIMESTAMP WITH TIME ZONE,
  primary_style VARCHAR,
  email_status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    qs.id,
    qs.user_name,
    qs.user_email,
    qs.submitted_at,
    qs.primary_style,
    CASE
      WHEN qs.email_sent = true THEN 'Sent'
      ELSE 'Failed'
    END as email_status
  FROM quiz_submissions qs
  WHERE qs.submitted_at >= CURRENT_TIMESTAMP - INTERVAL '1 day' * p_days
  ORDER BY qs.submitted_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;