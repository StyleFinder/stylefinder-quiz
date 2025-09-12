# Production Email Setup Guide

This guide explains how to configure production email delivery for the StyleFinder Quiz application.

## Quick Setup Checklist

- [ ] Choose email provider (Gmail, SendGrid, Mailgun, or AWS SES)
- [ ] Create account and get SMTP credentials
- [ ] Update environment variables in `.env.production`
- [ ] Test email delivery in staging environment
- [ ] Monitor email delivery in production

## Email Provider Options

### Option 1: Gmail (Recommended for small volume)

**Best for:** Small businesses, up to 500 emails/day

**Setup:**
1. Enable 2-factor authentication on your Google account
2. Generate App Password at https://myaccount.google.com/apppasswords
3. Set environment variables:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
COACH_EMAIL=coach@yourdomain.com
```

**Pros:** Free, easy setup, reliable
**Cons:** Daily sending limits, requires 2FA

### Option 2: SendGrid (Recommended for production)

**Best for:** Production applications, scalable email delivery

**Setup:**
1. Create account at https://sendgrid.com (free tier: 100 emails/day)
2. Generate API key at https://app.sendgrid.com/settings/api_keys
3. Set environment variables:

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
COACH_EMAIL=coach@yourdomain.com
```

**Pros:** High deliverability, detailed analytics, scalable
**Cons:** Requires account setup, paid plans for volume

### Option 3: Mailgun

**Best for:** Developers who need API flexibility

**Setup:**
1. Create account at https://mailgun.com (free tier: 100 emails/day)
2. Get SMTP credentials from your domain dashboard
3. Set environment variables:

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-smtp-username
SMTP_PASS=your-mailgun-smtp-password
COACH_EMAIL=coach@yourdomain.com
```

**Pros:** Developer-friendly, good API, reliable
**Cons:** Domain verification required for production

### Option 4: AWS SES

**Best for:** AWS-hosted applications, enterprise use

**Setup:**
1. Set up AWS SES in your AWS Console
2. Verify your sending domain
3. Create SMTP credentials in SES console
4. Set environment variables:

```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASS=your-ses-smtp-password
COACH_EMAIL=coach@yourdomain.com
```

**Pros:** Low cost, integrates with AWS, highly scalable
**Cons:** Complex setup, requires AWS account

## Environment Configuration

Create a `.env.production` file with your chosen provider settings:

```env
# Production Email Configuration
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password

# Required: Coach email address
COACH_EMAIL=coach@yourdomain.com

# Optional: Advanced settings
EMAIL_RATE_LIMIT=100
EMAIL_ENABLED=true
BACKUP_EMAIL=admin@yourdomain.com

# Application URLs
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

## Testing Email Setup

### 1. Test API Endpoint

```bash
curl -X POST https://yourdomain.com/api/submit-quiz \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "Test User",
    "userEmail": "test@example.com",
    "timestamp": "2025-01-12T10:00:00.000Z",
    "section1": {
      "groupA": [true,false,true,false,true,false,true],
      "groupB": [false,false,true,false,false,true,false],
      "groupC": [true,true,false,false,false,true,false],
      "groupD": [false,false,false,true,false,false,false],
      "groupE": [true,true,true,false,true,true,false],
      "groupF": [false,false,false,false,true,false,false],
      "groupG": [true,true,true,true,true,true,false],
      "groupH": [true,false,false,true,false,false,false]
    },
    "section2": {
      "answers": ["a","g","a","c","a","g","e","g","a","c","e","f","g","b","d","a","h"]
    }
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "primaryStyle": "contemporary",
  "message": "Assessment completed successfully. Results have been sent to your style coach."
}
```

### 2. Check Email Delivery

- Verify coach receives detailed results email
- Check spam folder if email doesn't arrive
- Verify email formatting (HTML and text versions)
- Test with multiple quiz submissions

## Production Best Practices

### Security
- Store SMTP credentials in environment variables, never in code
- Use app passwords for Gmail, not regular passwords
- Restrict SMTP credential permissions to sending only
- Enable 2FA on email provider accounts

### Monitoring
- Monitor email delivery rates and failures
- Set up alerts for email delivery issues
- Log email sending attempts and results
- Track bounce rates and spam complaints

### Performance
- Configure appropriate rate limits
- Use connection pooling for high volume
- Implement retry logic for failed sends
- Monitor SMTP response times

### Reliability
- Configure backup email addresses
- Test email failover scenarios
- Monitor email queue sizes
- Set up health checks for email service

## Troubleshooting

### Common Issues

**"Authentication failed" errors:**
- Verify SMTP credentials are correct
- Check if 2FA is enabled (use app passwords)
- Confirm SMTP host and port settings
- Test credentials directly with email provider

**Emails not being received:**
- Check spam/junk folders
- Verify recipient email address
- Check sender domain reputation
- Review email provider delivery logs

**Rate limit exceeded:**
- Adjust EMAIL_RATE_LIMIT setting
- Upgrade email provider plan
- Implement email queuing for high volume
- Monitor usage patterns

**Connection timeouts:**
- Check network connectivity
- Verify SMTP host/port accessibility
- Increase timeout values if needed
- Test from production server environment

### Debug Mode

Set `NODE_ENV=development` to see detailed error logs:

```bash
# View application logs
npm run dev

# Test specific email providers
curl -X POST http://localhost:3001/api/submit-quiz -d @test-data.json
```

## Support

- **Gmail:** https://support.google.com/mail/answer/185833
- **SendGrid:** https://docs.sendgrid.com/for-developers/sending-email/integrations
- **Mailgun:** https://help.mailgun.com/hc/en-us
- **AWS SES:** https://docs.aws.amazon.com/ses/

## Cost Estimates

| Provider | Free Tier | Paid Plans | Best For |
|----------|-----------|------------|----------|
| Gmail | 500/day | N/A | Small business |
| SendGrid | 100/day | $15/month (40K) | Growing apps |
| Mailgun | 100/day | $35/month (50K) | Developers |
| AWS SES | 200/day | $0.10/1000 | Enterprise |

Choose based on your expected quiz volume and budget requirements.