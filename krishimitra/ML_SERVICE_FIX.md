# 🚀 ML SERVICE DEPLOYMENT FIX

## ✅ What I Fixed:

### 1. **Simplified requirements.txt**
- Removed problematic dependencies
- Used exact versions that work on Render
- Kept only essential packages

### 2. **Fixed PORT Binding**
```python
port = int(os.environ.get('PORT', 5001))
app.run(host='0.0.0.0', port=port)
```

### 3. **Fixed render.yaml Paths**
```yaml
rootDirectory: krishimitra/ml-service
buildCommand: pip install -r requirements.txt
startCommand: gunicorn --bind 0.0.0.0:$PORT app:app
```

---

## 🛠️ MANUAL REDEPLOY STEPS:

### Step 1: Open Render Dashboard
```
https://dashboard.render.com
```

### Step 2: Delete Old ML Service (If Exists)
1. Click on `krishimitra-ml`
2. Go to "Settings" (bottom left)
3. Scroll to "Danger Zone"
4. Click "Delete Service"
5. Confirm deletion

### Step 3: Create New ML Service
1. Click "New +" → "Web Service"
2. Connect to GitHub repository: `Kanishk2215/krishimitra`
3. Configure:
   - **Name**: `krishimitra-ml`
   - **Root Directory**: `krishimitra/ml-service`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT app:app`
   - **Plan**: `Free`

4. Add Environment Variables:
   - `PORT` = `10000` (Render auto-assigns)
   - `PYTHON_VERSION` = `3.10.0`
   - `OPENAI_API_KEY` = (your key - optional)
   - `ANTHROPIC_API_KEY` = (your key - optional)
   - `ELEVENLABS_API_KEY` = (your key - optional)

5. Click "Create Web Service"

### Step 4: Wait for Deployment (5-10 minutes)
Watch the logs. You should see:
```
✅ Installing dependencies...
✅ Starting gunicorn...
✅ Service live at https://krishimitra-ml-xxxx.onrender.com
```

### Step 5: Test the ML Service
Open in browser:
```
https://krishimitra-ml-xxxx.onrender.com/
```

Expected response:
```json
{
  "status": "KrishiMitra ML Service is running",
  "version": "1.0"
}
```

---

## ⚠️ ALTERNATIVE: Use Blueprint (Automated)

If manual creation is tedious:

1. Go to Render Dashboard
2. Click "New +" → "Blueprint"
3. Select your GitHub repo
4. Render will auto-detect `render.yaml`
5. Click "Apply"

---

## 🧪 TESTING AFTER DEPLOYMENT:

### Test Endpoints:
```bash
# Health Check
curl https://krishimitra-ml-xxxx.onrender.com/

# Crop Recommendation
curl -X POST https://krishimitra-ml-xxxx.onrender.com/recommend \
  -H "Content-Type: application/json" \
  -d '{"soil_type": "Black", "season": "Kharif", "rainfall": 800}'

# Disease Detection (requires image)
# Use Postman or frontend upload
```

---

## 📝 COMMON ERRORS & FIXES:

### Error: "No module named 'flask'"
**Fix**: Ensure `requirements.txt` is in the root directory specified

### Error: "Port already in use"
**Fix**: Use `gunicorn --bind 0.0.0.0:$PORT app:app` (not hardcoded port)

### Error: "Application failed to start"
**Fix**: Check logs for missing dependencies, add to `requirements.txt`

### Error: "GitHub clone failed (HTTP 500)"
**Fix**: Wait 10 minutes and retry (GitHub temporary issue)

---

## ✅ FINAL CHECKLIST:

After ML service is LIVE:

- [ ] ML Service URL: `https://krishimitra-ml-xxxx.onrender.com`
- [ ] Health check returns JSON
- [ ] No errors in Render logs
- [ ] Update frontend `config.js` with ML URL (if needed)
- [ ] Test disease detection from frontend
- [ ] Test voice copilot (if API keys added)

---

**Ippo Render dashboard-la manual-a create pannunga! 5-10 minutes-la LIVE aayidum!** 🚀
