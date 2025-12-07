# StudySync Deployment Checklist

Follow this checklist to deploy StudySync with MongoDB to Vercel.

## Pre-Deployment (Local Testing)

- [ ] MongoDB Atlas account created
- [ ] Cluster created and active
- [ ] Database user created with strong password
- [ ] IP whitelist configured (0.0.0.0/0 for development)
- [ ] Connection string copied
- [ ] `.env.local` file created with MongoDB credentials
- [ ] `npm install` completed successfully
- [ ] `npm run dev` runs without errors
- [ ] Can sign up locally ✓
- [ ] Can create tasks locally ✓
- [ ] Can log sessions locally ✓
- [ ] Can mark tasks complete locally ✓
- [ ] Check-in streak works locally ✓

## MongoDB Verification

- [ ] MongoDB Atlas connection test successful
- [ ] Collections created: `users`, `tasks`, `sessions`, `streaks`
- [ ] Sample user data visible in MongoDB Atlas
- [ ] Sample task data visible in MongoDB Atlas

## GitHub Preparation

- [ ] Code committed: `git add .`
- [ ] Commit message clear: `git commit -m "Add MongoDB integration"`
- [ ] Code pushed: `git push`
- [ ] All changes visible on GitHub

## Vercel Deployment

- [ ] GitHub repository connected to Vercel
- [ ] New project created in Vercel
- [ ] Environment variables added:
  - [ ] `MONGODB_URI` = Your connection string
  - [ ] `MONGODB_DB_NAME` = `studysync`
  - [ ] `JWT_SECRET` = Different from local!
- [ ] Environment variables saved
- [ ] Deploy button clicked
- [ ] Deployment completed successfully (no red errors)

## Post-Deployment Testing

- [ ] Live URL accessible and loads
- [ ] Can sign up on live site ✓
- [ ] Email confirmation works (if enabled)
- [ ] Can create tasks on live site ✓
- [ ] Can log sessions on live site ✓
- [ ] Can mark tasks complete on live site ✓
- [ ] Dashboard displays data correctly
- [ ] Streak page works
- [ ] Dark mode toggle works
- [ ] Mobile responsive ✓

## MongoDB Production Verification

- [ ] Data appears in MongoDB Atlas collections
- [ ] Live user account visible in `users` collection
- [ ] Live task data visible in `tasks` collection
- [ ] Live session data visible in `sessions` collection
- [ ] Data persists after page refresh

## Security Review

- [ ] `.env.local` NOT committed to GitHub
- [ ] JWT_SECRET changed from default
- [ ] MongoDB password is strong (16+ characters)
- [ ] Connection string doesn't have hardcoded credentials
- [ ] Only development IP restrictions (0.0.0.0/0)

## Performance Checks

- [ ] Page load time is reasonable (< 3 seconds)
- [ ] No console errors in browser (F12)
- [ ] Network requests complete successfully
- [ ] Database queries are fast

## Documentation

- [ ] Created `.env.example` file
- [ ] Created `MONGODB_SETUP.md`
- [ ] Created `COMPLETE_SETUP.md`
- [ ] Created `DEPLOYMENT_CHECKLIST.md` (this file)
- [ ] README.md mentions MongoDB setup

## Post-Launch Monitoring

- [ ] Set up Vercel alerts for errors
- [ ] Monitor MongoDB usage in Atlas dashboard
- [ ] Check Vercel analytics
- [ ] Review error logs regularly
- [ ] Backup strategy documented

## Optional: Production Hardening

- [ ] Configure MongoDB Atlas IP whitelist (restrict to Vercel IPs only)
- [ ] Set up MongoDB automated backups
- [ ] Enable MongoDB authentication via Vercel
- [ ] Add monitoring/alerting for MongoDB
- [ ] Set up custom domain
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Configure CORS headers

## Success Criteria ✓

All items in this section must be checked:

- [ ] App is live on Vercel
- [ ] Users can sign up and log in
- [ ] Tasks are saved and retrieved correctly
- [ ] Data persists in MongoDB
- [ ] No critical errors in console
- [ ] Mobile experience is good
- [ ] All features work as expected

## If Something Goes Wrong

1. **Check Vercel Logs**: Dashboard → Deployments → Function Logs
2. **Check MongoDB Connection**: Try connecting with MongoDB Compass locally
3. **Verify Environment Variables**: Make sure all three are set in Vercel
4. **Test API Directly**: Use Postman/curl to test endpoints
5. **Check Browser Console**: F12 → Console tab for client errors
6. **Redeploy**: Sometimes a redeploy fixes issues

## Rollback Plan

If deployment breaks:

1. Go to Vercel Dashboard → Deployments
2. Find the previous working deployment
3. Click three dots → "Promote to Production"
4. Previous version is now live again
5. Fix issues locally and redeploy

---

**Deployment Date**: ___________
**Deployed By**: ___________
**Notes**: _________________________________________________________________
