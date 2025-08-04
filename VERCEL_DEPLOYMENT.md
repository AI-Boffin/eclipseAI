# Vercel Deployment Guide

## Quick Fix for Environment Variables

The error you're seeing is because the environment variables are not configured in your Vercel deployment. Here's how to fix it:

### 1. Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_OPENAI_API_KEY=your-openai-api-key
VITE_SENDGRID_API_KEY=your-sendgrid-api-key
```

### 2. Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **Project URL** and **anon public** key

### 3. Redeploy

After adding the environment variables:
1. Go to **Deployments** in Vercel
2. Click **Redeploy** on your latest deployment

## Alternative: Use Mock Data for Development

If you want to test the app without setting up Supabase immediately, the app will now use mock data when environment variables are missing. You'll see a warning in the console:

```
⚠️ Supabase environment variables not configured. Using mock data for development.
```

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | Yes |
| `VITE_OPENAI_API_KEY` | OpenAI API key for AI features | Optional |
| `VITE_SENDGRID_API_KEY` | SendGrid API key for emails | Optional |

## Development vs Production

- **Development**: App will use mock data if env vars are missing
- **Production**: You should always configure environment variables

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in Vercel
- Make sure the values are correct (not placeholder values)
- Redeploy after adding environment variables

### Error: "Failed to load resource: 404"
- This is likely a missing favicon or other static asset
- Check that all imports are correct
- Verify that the build is successful

### App shows mock data
- This is expected if environment variables are not configured
- Configure Supabase environment variables to use real data
- The app will work with mock data for testing the UI

## Next Steps

1. **Set up Supabase**:
   - Create a Supabase project
   - Run the database migrations
   - Add the environment variables

2. **Configure APIs** (Optional):
   - OpenAI for AI features
   - SendGrid for email sending

3. **Test the app**:
   - The app will work with mock data
   - Add real data by configuring environment variables 