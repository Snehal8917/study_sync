# MongoDB Setup Guide for StudySync

## Why MongoDB?

MongoDB replaces the file-based JSON storage that doesn't work on Vercel. It provides:
- **Persistent cloud storage** on Vercel (no more ephemeral filesystem issues)
- **Scalability** as your app grows
- **Better performance** than file operations
- **Easy deployment** with MongoDB Atlas (free tier available)

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Sign Up" and create a free account
3. Verify your email

## Step 2: Create a Free Cluster

1. After signing in, click "Create a Deployment"
2. Select **M0 (Free Tier)** - unlimited free usage
3. Choose your preferred cloud provider (AWS, Google Cloud, or Azure)
4. Select the region closest to you
5. Click "Create Deployment"
6. Wait for the cluster to be created (5-10 minutes)

## Step 3: Set Up Database Access

1. In the left sidebar, click "Security" → "Database Access"
2. Click "Add New Database User"
3. Select "Username and Password"
4. Enter a username (e.g., `studysync-user`)
5. Enter a strong password or auto-generate one
6. Click "Add User"

## Step 4: Configure Network Access

1. In the left sidebar, click "Security" → "Network Access"
2. Click "Add IP Address"
3. Select "Allow access from anywhere" (for development)
4. Click "Confirm"

## Step 5: Get Your Connection String

1. Click "Deployment" → "Database" in the left sidebar
2. Click the "Connect" button next to your cluster
3. Select "Drivers"
4. Copy the connection string
5. Replace `<username>` and `<password>` with your credentials
6. The string looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

## Step 6: Add Environment Variables

Add these to your Vercel project:

### Local Development (.env.local)
\`\`\`
MONGODB_URI=mongodb+srv://snehalprajapatiit19_db_user:LPn1yAmq8IIWrtPO@studysync.8vvdxdo.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=studysync
JWT_SECRET=your-super-secret-jwt-key-change-this
\`\`\`

### Vercel Deployment
1. Go to your Vercel project → Settings → Environment Variables
2. Add:
   - Key: `MONGODB_URI`
   - Value: Your MongoDB connection string
3. Add:
   - Key: `MONGODB_DB_NAME`
   - Value: `studysync`
4. Add:
   - Key: `JWT_SECRET`
   - Value: Your JWT secret
5. Click "Save" and redeploy

## Step 7: Verify Setup

After deploying to Vercel:
1. Go to your app and try to sign up
2. If successful, go back to MongoDB Atlas
3. Click "Databases" and view your `studysync` database
4. You should see collections: `users`, `tasks`, `sessions`, `streaks`

## Troubleshooting

### Connection Error: "ECONNREFUSED"
- Make sure your IP address is whitelisted in Network Access
- Verify your connection string is correct
- Check that your username and password don't have special characters that need escaping

### Collections Not Created
- Collections are created automatically on first use
- If not, try signing up a new user to trigger creation

### Still Using File Storage?
- Clear your `lib/storage.ts` imports
- Make sure all API routes import from `lib/mongodb.ts`
- Redeploy to Vercel

## Next Steps

Once MongoDB is set up:
1. **Local Development**: Run `npm run dev` and test all features
2. **Deploy**: Push to GitHub/Vercel
3. **Verify**: Check MongoDB Atlas to see your data

## Security Notes

- Never commit `.env.local` to GitHub (it's in `.gitignore`)
- Use strong, unique passwords for database users
- Consider restricting IP addresses in production
- Rotate credentials regularly
- Keep JWT_SECRET secret and change it often
\`\`\`

```markdown file="" isHidden
