
# 🚀 RENDER DEPLOYMENT GUIDE (Backend)

Your backend code is **ALREADY READY** for Render! 
I checked `server.js` and `package.json`, and everything is perfect:
- ✅ **Port:** Uses `process.env.PORT` (Dynamic)
- ✅ **Start Script:** `"start": "node server.js"` exists
- ✅ **CORS:** Configured for `*` (All origins), which is good for initial testing.

---

### 1️⃣ Push to GitHub
Make sure your latest code is on GitHub.
(If you haven't pushed yet, do it now via VS Code Source Control or Terminal).

### 2️⃣ Go to Render.com
1.  Click **New +** -> **Web Service**.
2.  Connect your GitHub repository (`krishimitra`).
3.  **IMPORTANT:** Select **"Root Directory"** (in Render settings):
    *   Type: `krishimitra/backend`
    *   *(This is crucial because your backend code is inside this folder).*

### 3️⃣ Configure Settings
Fill in these exact values:

| Setting | Value |
| :--- | :--- |
| **Name** | `krishimitra-backend` |
| **Region** | Singapore (or closest to you) |
| **Branch** | `main` |
| **Root Directory** | `krishimitra/backend` |
| **Runtime** | **Node** |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | **Free** |

### 4️⃣ Environment Variables (Advanced)
If you are using a database (PostgreSQL) or secret keys, add them under the **"Environment"** tab in Render:

| Key | Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | (Your secret key) |
| `DB_HOST` | (If using external DB) |

*(If you are just testing using SQLite, note that SQLite data resets on every deploy on Render's free tier. For production, use Render PostgreSQL).*

### 5️⃣ Click "Create Web Service"
Wait 1-2 minutes.
Once live, Render will give you a URL like:
`https://krishimitra-backend.onrender.com`

---
### 🔗 FINAL STEP: Connect Frontend
Copy the new Backend URL from Render.
Go to your **Vercel Project** (Frontend) -> **Settings** -> **Environment Variables**.
Update:
`VITE_BACKEND_URL` = `https://krishimitra-backend.onrender.com`

Redeploy Vercel. Done! 🎉
