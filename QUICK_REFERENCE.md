# StudySync MongoDB - Quick Reference

## 3-Minute Setup

### Step 1: MongoDB Atlas
\`\`\`
1. Go to mongodb.com/cloud/atlas
2. Sign up → Create cluster (M0 free)
3. Create user: username/password
4. Get connection string (replace username/password)
\`\`\`

### Step 2: Environment Variables
\`\`\`bash
# .env.local (local development)
MONGODB_URI=mongodb+srv://snehalprajapatiit19_db_user:LPn1yAmq8IIWrtPO@studysync.8vvdxdo.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=studysync
JWT_SECRET=your-secret-key-here
\`\`\`

### Step 3: Vercel Environment
\`\`\`
Vercel Dashboard → Settings → Environment Variables

MONGODB_URI = mongodb+srv://snehalprajapatiit19_db_user:LPn1yAmq8IIWrtPO@studysync.8vvdxdo.mongodb.net/
MONGODB_DB_NAME = studysync
JWT_SECRET = [different from local]
\`\`\`

## API Endpoints Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/register` | ❌ | Create account |
| POST | `/api/auth/login` | ❌ | Login |
| GET | `/api/auth/me` | ✅ | Get user info |
| GET | `/api/tasks` | ✅ | List tasks |
| POST | `/api/tasks` | ✅ | Create task |
| GET | `/api/tasks/:id` | ✅ | Get task |
| PUT | `/api/tasks/:id` | ✅ | Update task |
| DELETE | `/api/tasks/:id` | ✅ | Delete task |
| GET | `/api/sessions` | ✅ | List sessions |
| POST | `/api/sessions` | ✅ | Log session |
| DELETE | `/api/sessions/:id` | ✅ | Delete session |
| GET | `/api/streak` | ✅ | Get streak |
| POST | `/api/streak/check-in` | ✅ | Daily check-in |
| GET | `/api/notify` | ✅ | Get notifications |
| GET | `/api/quotes` | ✅ | Get quote |

## Database Collections

### users
\`\`\`javascript
{
  _id: ObjectId,
  email: "unique@email.com", // UNIQUE INDEX
  password: "hashed",
  name: "John",
  theme: "light" | "dark",
  createdAt: Date
}
\`\`\`

### tasks
\`\`\`javascript
{
  _id: ObjectId,
  userId: ObjectId, // INDEX
  title: "String",
  subject: "String",
  description: "String",
  dueDate: Date | null,
  completed: Boolean,
  createdAt: Date
}
\`\`\`

### sessions
\`\`\`javascript
{
  _id: ObjectId,
  userId: ObjectId, // INDEX
  taskId: ObjectId,
  duration: Number, // minutes
  notes: "String",
  date: Date,
  createdAt: Date
}
\`\`\`

### streaks
\`\`\`javascript
{
  _id: ObjectId,
  userId: ObjectId, // UNIQUE INDEX
  streak: Number,
  lastCheckIn: String, // YYYY-MM-DD
  badges: [3, 7, 14, 30], // milestones earned
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### quotes
\`\`\`javascript
{
  content: "String",
  author: "String",
  cachedAt: Date
}
\`\`\`

## MongoDB Connection Examples

### From Node.js
\`\`\`javascript
import { getDatabase } from "@/lib/mongodb"

const db = await getDatabase()
const collection = db.collection("tasks")
\`\`\`

### Query Examples
\`\`\`javascript
// Find all user tasks
const tasks = await db.collection("tasks")
  .find({ userId: new ObjectId(userId) })
  .toArray()

// Find one task
const task = await db.collection("tasks")
  .findOne({ _id: new ObjectId(id), userId: new ObjectId(userId) })

// Update task
await db.collection("tasks")
  .updateOne({ _id: new ObjectId(id) }, { $set: { completed: true } })

// Delete task
await db.collection("tasks")
  .deleteOne({ _id: new ObjectId(id) })

// Count documents
const count = await db.collection("tasks")
  .countDocuments({ userId: new ObjectId(userId) })
\`\`\`

## Troubleshooting Quick Fixes

| Issue | Fix |
|-------|-----|
| Connection refused | Whitelist IP in MongoDB Atlas → Security → Network Access |
| Auth failed | Check username/password in connection string |
| Collections missing | Create new user/task - collections auto-create |
| Timeout | Increase connection timeout in MongoDB Atlas |
| Data not syncing | Verify JWT_SECRET is set in Vercel |

## Security Reminders

- ❌ Never commit `.env.local`
- ❌ Never share connection string
- ✅ Use strong passwords (16+ chars)
- ✅ Whitelist only needed IPs in production
- ✅ Change JWT_SECRET regularly
- ✅ Monitor MongoDB usage

## Performance Tips

1. **Connection Pooling**: Handled automatically
2. **Indexes**: Already created on userId fields
3. **Query Optimization**: Use specific queries, not scan all
4. **Batch Operations**: Combine multiple ops when possible
5. **Caching**: Quotes already cached for 24 hours

## Monitoring

### Vercel Dashboard
- Logs: Deployments → Function Logs
- Analytics: Analytics tab
- Errors: Alerts section

### MongoDB Atlas
- Collections: Database → Browse Collections
- Stats: Metrics tab
- Usage: Usage tab (free tier: 512 MB storage)

## Useful MongoDB Atlas Links

- [Collections](https://cloud.mongodb.com) - View/edit data
- [Backups](https://cloud.mongodb.com) - Backup management
- [Network](https://cloud.mongodb.com) - IP whitelist
- [Users](https://cloud.mongodb.com) - Database users
- [Performance](https://cloud.mongodb.com) - Query metrics

## Common Commands

\`\`\`bash
# Local testing
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Database
npm install              # Install MongoDB driver
# MongoDB client: mongosh (install separately if needed)

# Deployment
git add .                # Stage changes
git commit -m "msg"      # Commit
git push                 # Push to GitHub
# Then trigger Vercel redeploy
\`\`\`

## File Locations

\`\`\`
lib/
  ├── mongodb.ts         ← Main DB connection
  ├── jwt.ts             ← Token management
  └── bcrypt.ts          ← Password hashing

app/api/
  ├── auth/
  │   ├── register/route.ts
  │   ├── login/route.ts
  │   └── me/route.ts
  ├── tasks/
  │   ├── route.ts       ← GET/POST
  │   └── [id]/route.ts  ← GET/PUT/DELETE
  ├── sessions/
  │   ├── route.ts
  │   └── [id]/route.ts
  ├── streak/
  │   ├── route.ts
  │   └── check-in/route.ts
  ├── notify/route.ts
  └── quotes/route.ts
\`\`\`

## Testing URLs

\`\`\`
Local: http://localhost:3000
Vercel: https://your-project.vercel.app

Auth: POST /api/auth/register, /api/auth/login
Tasks: GET /api/tasks, POST /api/tasks
Sessions: GET /api/sessions, POST /api/sessions
Streak: GET /api/streak, POST /api/streak/check-in
\`\`\`

---

**Last Updated**: January 2025
**Version**: MongoDB Integration v1.0
