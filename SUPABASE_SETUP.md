# 🎯 SUPABASE SETUP GUIDE

## How to Get Your DATABASE_URL

### Step 1: Create a Supabase Account
1. Go to https://supabase.com
2. Click "Sign Up" 
3. Use your email or GitHub account
4. Verify your email

### Step 2: Create a New Project
1. Click "New Project"
2. Enter project name: `lrn-auto-festival`
3. Choose Region: **Singapore** (closest to Africa) or your preference
4. Create a strong database password and save it
5. Click "Create new project" (takes 2-3 minutes)

### Step 3: Get Your Connection String
Once your project is created:

1. In the left sidebar, click **Settings** → **Database**
2. Look for "Connection String" section
3. Select **URI** (not connection pooler yet)
4. Copy the connection string that looks like:
   ```
   postgresql://postgres:[YOUR_PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

### Step 4: Replace Placeholder
The URL contains a placeholder `[YOUR_PASSWORD]` - replace it with your actual database password from Step 2.

Example:
```
postgresql://postgres:MySecurePassword123@db.xxxxx.supabase.co:5432/postgres
```

### Step 5: Update Your .env.local
1. Open `.env.local` in VS Code
2. Replace this line:
   ```env
   DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/ilorin_auto_fest"
   ```
   
   With:
   ```env
   DATABASE_URL="postgresql://postgres:YourActualPassword@db.xxxxx.supabase.co:5432/postgres"
   ```

3. Save the file

### Step 6: Get API Keys
Back in Supabase dashboard:

1. Click **Project Settings** (gear icon) → **API**
2. Copy these values to `.env.local`:

   - **NEXT_PUBLIC_SUPABASE_URL** = Project URL (e.g., `https://xxxxx.supabase.co`)
   - **NEXT_PUBLIC_SUPABASE_ANON_KEY** = `anon` (public) key
   - **SUPABASE_SERVICE_ROLE_KEY** = `service_role` (private) key

Updated `.env.local` should look like:
```env
DATABASE_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key_here"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"
```

### Step 7: Test Connection
1. In terminal, run:
   ```bash
   npm run prisma:push
   ```
   
2. If successful, you'll see:
   ```
   ✓ Database synced
   ```

3. Then run:
   ```bash
   npm run dev
   ```

Your app will now be connected to Supabase!

---

## ⚠️ Security Reminder
- ✅ `.env.local` is in `.gitignore` (safe - won't be committed)
- ✅ Never share your database password
- ✅ Service role key is private (don't expose to frontend)
- ✅ Anon key is safe for frontend (already prefixed with `NEXT_PUBLIC_`)

---

## 🎯 Quick Supabase Dashboard Navigation

| Task | Path |
|------|------|
| Connection String | Settings → Database → Connection String |
| API Keys | Settings → API |
| SQL Editor | SQL Editor (top left) |
| Database Tables | Table Editor |
| Real-time | Database → Replication |

---

## Troubleshooting

**Q: Connection refused?**
- A: Check password is correct and copied completely

**Q: Wrong credentials?**
- A: In Supabase Settings → Database, click "Reset Database Password" and try again

**Q: Still not working?**
- A: Try the "Connection Pooler" option instead of "Direct" in Connection String dropdown

---

**You're 10 minutes away from a live database! 🚀**
