# Database Setup Guide - Persistent Storage for Quiz Results

This guide explains how to set up persistent database storage for StyleFinder Quiz results using Supabase.

## Why Database Storage?

Previously, quiz results were only stored in memory and lost when the serverless function terminated. With database storage:

- ✅ **All quiz results are permanently saved**
- ✅ **Email failures don't lose data**
- ✅ **Admin dashboard to view and manage results**
- ✅ **Automatic email retry mechanism**
- ✅ **Export results to CSV**
- ✅ **Search and filter capabilities**

## Setup Instructions

### Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project (free tier includes):
   - 500MB database
   - 50,000 monthly active users
   - 2GB bandwidth

### Step 2: Run Database Migration

1. In Supabase Dashboard, go to **SQL Editor**
2. Copy the entire contents of `/database/schema.sql`
3. Run the migration to create all tables

### Step 3: Get Supabase Credentials

1. In Supabase Dashboard, go to **Settings → API**
2. Copy these values:
   - **Project URL**: `https://[your-project].supabase.co`
   - **Anon/Public Key**: For client-side access
   - **Service Role Key**: For server-side operations (keep secret!)

### Step 4: Configure Environment Variables

Add to your `.env.local` (development) and Vercel Dashboard (production):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Admin Dashboard
ADMIN_TOKEN=create-a-secure-token-here

# Email Retry Cron (optional)
CRON_SECRET=create-a-cron-secret-here
```

### Step 5: Deploy to Vercel

1. Push changes to GitHub
2. In Vercel Dashboard, add all environment variables
3. Deploy the application
4. Cron job will automatically run every 5 minutes for email retries

## Features

### 1. Automatic Data Persistence

Every quiz submission is automatically saved with:
- User information (name, email)
- Complete quiz responses (all 73 questions)
- Calculated style results and scores
- Email delivery status
- Submission metadata (IP, timestamp, etc.)

### 2. Admin Dashboard

Access at `/admin` with features:
- View all quiz submissions
- Search by email
- Filter by date range
- See style results and scores
- Check email delivery status
- Retry failed emails
- Export to CSV

### 3. Email Retry System

Failed emails are automatically:
- Added to retry queue
- Attempted up to 3 times
- Processed every 5 minutes via cron
- Tracked with error messages

### 4. Data Recovery

To recover lost quiz data:

```sql
-- Get recent submissions
SELECT * FROM quiz_submissions
ORDER BY submitted_at DESC
LIMIT 100;

-- Find specific user's results
SELECT * FROM quiz_submissions
WHERE user_email ILIKE '%user@example.com%';

-- Check email queue status
SELECT * FROM email_queue
WHERE status != 'sent'
ORDER BY created_at DESC;
```

## Admin Dashboard Usage

### Access the Dashboard

1. Navigate to `https://your-domain.vercel.app/admin`
2. Enter your admin token (from ADMIN_TOKEN env variable)
3. View and manage all quiz submissions

### Dashboard Features

- **View Results**: See all quiz submissions with scores
- **Email Status**: Check if coach emails were sent
- **Retry Emails**: Manually retry failed email deliveries
- **Export Data**: Download results as CSV
- **Search**: Find submissions by email address

### Manual Email Retry

For immediate retry of failed emails:

```bash
curl -X POST https://your-domain.vercel.app/api/cron/process-email-queue \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Database Schema Overview

### Tables Created

1. **quiz_submissions**: Main table storing all quiz data
2. **email_queue**: Queue for email retry mechanism
3. **admin_access_logs**: Audit trail for admin actions
4. **quiz_results_summary**: View for easy dashboard queries

### Data Retention

- Free tier: Unlimited storage up to 500MB
- No automatic deletion
- Manual cleanup if needed via SQL

## Monitoring

### Check System Health

```bash
# View recent submissions
curl https://your-domain.vercel.app/api/health?detailed=true \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Database Queries

In Supabase SQL Editor:

```sql
-- Daily submission count
SELECT DATE(submitted_at), COUNT(*)
FROM quiz_submissions
GROUP BY DATE(submitted_at)
ORDER BY DATE(submitted_at) DESC;

-- Email success rate
SELECT
  COUNT(*) FILTER (WHERE email_sent = true) as sent,
  COUNT(*) FILTER (WHERE email_sent = false) as failed,
  COUNT(*) as total
FROM quiz_submissions;

-- Pending email retries
SELECT * FROM email_queue
WHERE status = 'pending'
AND attempts < max_attempts;
```

## Troubleshooting

### Database Connection Issues

1. Verify Supabase URL and keys are correct
2. Check if tables exist (run migration if needed)
3. Ensure service role key is used for admin operations

### Email Still Not Sending

1. Check email queue: `SELECT * FROM email_queue WHERE submission_id = 'xxx'`
2. Verify SMTP credentials are correct
3. Check Vercel Function logs for errors
4. Manually trigger retry via admin dashboard

### Admin Dashboard Not Loading

1. Verify ADMIN_TOKEN is set in environment
2. Check browser console for errors
3. Ensure Supabase client can connect

## Cost Considerations

### Supabase Free Tier Limits
- 500MB database storage
- 2GB bandwidth/month
- 50,000 monthly active users
- Pauses after 7 days of inactivity

### Upgrade When Needed
- Pro plan ($25/month): 8GB database, 50GB bandwidth
- Scale as your quiz volume grows

## Security Notes

1. **Never expose SUPABASE_SERVICE_ROLE_KEY** in client code
2. **Use strong ADMIN_TOKEN** for dashboard access
3. **Enable Row Level Security (RLS)** in production
4. **Regular backups** via Supabase dashboard

## Support

For issues with:
- **Database setup**: Check Supabase documentation
- **Admin dashboard**: Review `/admin` page code
- **Email retries**: Check cron job logs in Vercel

The system is now fully persistent and production-ready!