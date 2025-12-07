# Complete StudySync MongoDB Setup Guide

## Overview

StudySync now uses **MongoDB Atlas** for all data storage, replacing the old file-based system. This guide will walk you through everything needed to get your app working on Vercel.

## Prerequisites

- A GitHub account
- A Vercel account
- A MongoDB Atlas account (free tier available)

## Part 1: MongoDB Atlas Setup (10 minutes)

### Step 1.1: Create MongoDB Atlas Account
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Sign Up" and create your free account
3. Verify your email address

### Step 1.2: Create a Free Cluster
1. Click "Create" → "Create a Deployment"
2. Select **M0 Free Tier** (unlimited usage, perfect for learning)
3. Choose AWS, Google Cloud, or Azure (doesn't matter for development)
4. Select region closest to you
5. Click "Create Deployment"
6. Wait 5-10 minutes for cluster creation

### Step 1.3: Create Database User
1. In left sidebar: "Security" → "Database Access"
2. Click "Add New Database User"
3. Choose "Username and Password" auth method
4. Enter username: `studysync-user`
5. Enter strong password or auto-generate
6. Click "Add User"

### Step 1.4: Configure Network Access
1. In left sidebar: "Security" → "Network Access"
2. Click "Add IP Address"
3. Select "Allow access from anywhere" (for development only)
4. Click "Confirm"

### Step 1.5: Get Connection String
1. Click "Deployment" → "Database"
2. Click "Connect" button
3. Select "Drivers" → "Node.js"
4. Copy the connection string
5. Replace `<username>` and `<password>` with your credentials

Your string should look like:
\`\`\`
mongodb+srv://studysync-user:YourPassword123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
\`\`\`

## Part 2: Local Development Setup (5 minutes)

### Step 2.1: Update Environment Variables

Create a `.env.local` file in your project root:

\`\`\`
MONGODB_URI=mongodb+srv://snehalprajapatiit19_db_user:LPn1yAmq8IIWrtPO@studysync.8vvdxdo.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=my-super-secret-jwt-key-12345
\`\`\`

### Step 2.2: Install Dependencies

\`\`\`bash
npm install mongodb
\`\`\`

This is already in package.json, so just run:

\`\`\`bash
npm install
\`\`\`

### Step 2.3: Test Locally

\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:3000 and test:
1. Sign up with a new account
2. Create a task
3. Mark it complete
4. Log a study session
5. Check your streak

All data should be saved to MongoDB!

## Part 3: Deploy to Vercel (5 minutes)

### Step 3.1: Push Code to GitHub

\`\`\`bash
git add .
git commit -m "Add MongoDB integration"
git push
\`\`\`

### Step 3.2: Connect Vercel to GitHub

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Click "Import"

### Step 3.3: Add Environment Variables

1. In Vercel, go to "Settings" → "Environment Variables"
2. Add three new variables:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB connection string |
| `MONGODB_DB_NAME` | `studysync` |
| `JWT_SECRET` | Your JWT secret (must be different from local) |

3. Click "Save"

### Step 3.4: Deploy

1. Click "Deploy" button
2. Wait for deployment to complete
3. Visit your live URL

## Part 4: Verify Everything Works

### On Your Live Site

1. **Sign Up**: Create a new account
2. **Create Tasks**: Add a few study tasks
3. **Log Sessions**: Log study time
4. **Mark Complete**: Complete a task
5. **Check Streak**: Visit streak page and check in daily

### In MongoDB Atlas

1. Go to MongoDB Atlas → "Database" 
2. Click "Browse Collections"
3. Expand `studysync` database
4. You should see 4 collections:
   - `users` - your account
   - `tasks` - your tasks
   - `sessions` - logged study time
   - `streaks` - your streak data

## Troubleshooting

### Issue: "Connection refused" on Vercel

**Solution:**
- Make sure IP whitelist includes "0.0.0.0/0" (allow anywhere)
- Verify connection string is correct
- Check that username/password don't have special characters

### Issue: "No collections showing in MongoDB"

**Solution:**
- Collections are created on first use
- Try signing up a new account
- Wait a few seconds and refresh MongoDB Atlas

### Issue: Tasks not showing after signup

**Solution:**
- Check browser console (F12) for errors
- Verify JWT_SECRET is set correctly
- Make sure MONGODB_URI is correct in Vercel environment variables
- Redeploy after changing environment variables

### Issue: "ENOTFOUND" error

**Solution:**
- Check internet connection
- Verify MongoDB connection string
- Make sure cluster is active in MongoDB Atlas

## Important Security Notes

### For Production

1. **Change JWT_SECRET regularly** - it's used to sign tokens
2. **Use strong MongoDB passwords** - at least 16 characters
3. **Restrict IP access** - only allow Vercel IPs in production
4. **Never commit .env.local** - already in .gitignore
5. **Use environment variables** - never hardcode secrets

### Upgrading MongoDB (Optional)

Free M0 tier is perfect for learning. When you scale:

1. Go to MongoDB Atlas → Deployment
2. Click your cluster name
3. Select "Tier" and choose M2 or higher
4. Billing starts, but you get better performance

## What's Different from Old Version?

| Feature | Old (File Storage) | New (MongoDB) |
|---------|-------------------|---------------|
| **Vercel Support** | ❌ Didn't work | ✅ Works perfectly |
| **Data Persistence** | ❌ Lost after request | ✅ Persists forever |
| **Scalability** | ❌ Limited | ✅ Unlimited |
| **Real-time Updates** | ❌ No | ✅ Possible (future) |
| **Multiple Users** | ⚠️ Conflicts | ✅ Fully supported |

## Next Steps

After everything works:

1. **Add more features** - likes, comments, sharing
2. **Set up monitoring** - track app performance
3. **Configure backups** - MongoDB does this automatically
4. **Optimize queries** - add MongoDB indexes as needed

## Support

If you encounter issues:

1. Check [MongoDB Documentation](https://docs.mongodb.com/)
2. Check [Vercel Troubleshooting](https://vercel.com/docs/troubleshooting)
3. Review browser console for error messages
4. Check server logs in Vercel dashboard

Happy studying! 🎓
