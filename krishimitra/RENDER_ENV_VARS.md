
# 🔑 RENDER ENVIRONMENT VARIABLES (Backend)

When deploying your Backend on Render, Go to:
**Dashboard -> Your Service -> Environment -> "Add Environment Variable"**

Add these variables to make your backend work securely:

| Variable Name | Value To Enter | Purpose |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Tells Node.js to run in fast, production mode. |
| `JWT_SECRET` | `mySuperSecretKey123!` | Used to encrypt user logins. (Change this to a long random string). |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` | Allows your Frontend to talk to this Backend (CORS security). <br>*(Replace with your actual Vercel URL)* |

---

### ⚠️ OPTIONAL (Only if you have these):

| Variable Name | Value | Purpose |
| :--- | :--- | :--- |
| `DATABASE_URL` | (Auto-provided by Render Postgres) | Only if you added a PostgreSQL database. <br>*(Leave empty if using SQLite for testing)*. |
| `ML_SERVICE_URL` | `https://your-ml-service.onrender.com` | If you deployed the Python ML Service. causes features like AI Chat to work. |

### ✅ CLICK "SAVE CHANGES"
Render will automatically restart your app with these new settings.
