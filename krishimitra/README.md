# 🌾 Krishimitra - Smart Crop Advisory System

## 🚀 Quick Start (Docker)

1. **Install Docker Desktop** if not installed.
2. Open terminal in `krishimitra` folder.
3. Run:
   ```bash
   docker-compose up --build
   ```
4. Access App:
   - **Frontend**: http://localhost:3000
   - **Backend**: http://localhost:5000
   - **ML Service**: http://localhost:5001

## ⚡ Local Setup (Manual)

If you cannot use Docker, run these commands in separate terminals:

**Backend:**
```bash
cd backend
npm install
# Ensure you have PostgreSQL running locally OR change config/database.js to use SQLite
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**ML Service:**
```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

## 📱 Features Implemented
- **Login**: OTP based (Check console for OTP)
- **Farm Profile**: Add Soil Type, Land Size
- **Recommendations**: AI-driven crop suggestions based on your profile
- **Dashboard**: Weather & Profit analysis

## 🧪 Testing Credentials
- **Phone**: Any (e.g., 9999999999)
- **OTP**: Check the Backend Terminal logs (It will print `[SMSService] ...`)
