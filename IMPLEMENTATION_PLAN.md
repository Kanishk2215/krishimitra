# 🌾 AGRIFARM - SMART CROP ADVISORY SYSTEM
## Complete 12-Week Implementation Plan

---

## 📁 PROJECT STRUCTURE

```bash
/smart-crop-advisory
├── /.github                # GitHub Actions workflows (CI/CD)
├── /backend                # Node.js + Express Server
│   ├── /config             # DB, Redis, Scheduler configs
│   ├── /controllers        # Logic for routes (Auth, Crops, Weather)
│   ├── /models             # Mongoose/Sequelize schemas
│   ├── /middleware         # Auth, Error handling, Validation
│   ├── /routes             # API endpoints
│   ├── /services           # External services (Twilio, WeatherAPI)
│   ├── /utils              # Helpers (Logger, Constants)
│   ├── .env.example
│   ├── server.js           # Entry point
│   └── package.json
├── /frontend               # React.js (Vite) PWA
│   ├── /public             # Manifest, Icons
│   ├── /src
│   │   ├── /assets
│   │   ├── /components     # Reusable UI (Button, Card, Navbar)
│   │   ├── /context        # Global State (Auth, Theme)
│   │   ├── /hooks          # Custom hooks (useGeoLocation, useOffline)
│   │   ├── /locales        # i18n JSON files (en, hi, mr, ta, te)
│   │   ├── /pages          # Route views (Home, Profile, Disease)
│   │   ├── /services       # API axios instances, IndexedDB
│   │   ├── /utils
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js      # PWA plugin config
│   └── package.json
├── /ml-service             # Python Flask ML Service
│   ├── /data               # Datasets
│   ├── /models             # Trained .pkl / .h5 models
│   ├── /utils              # Preprocessing scripts
│   ├── app.py              # Flask API entry
│   ├── train_model.py      # Training script
│   └── requirements.txt
├── /docker                 # Docker configs
│   └── nginx.conf          # Nginx reverse proxy
├── docker-compose.yml      # Orchestration
└── README.md
```

---

## 🗓️ IMPLEMENTATION TIMELINE

### 📅 WEEK 1: Environment Setup, Database Design & Auth Architecture
🎯 **Objectives:**
- [ ] Initialize git monorepo with 3 services (frontend, backend, ml-service).
- [ ] Setup PostgreSQL, MongoDB, and Redis via Docker Compose.
- [ ] Design Database Schemas (Users, Farms, Crops).
- [ ] Implement OTP Service (Twilio/similar mock).

📋 **Daily Breakdown:**

**Day 1: Project Initialization & Docker**
- Create folder structure.
- Initialize `docker-compose.yml` with Postgres, Mongo, Redis.
- Commands:
  ```bash
  mkdir smart-crop-advisory && cd smart-crop-advisory
  git init
  # Create services
  mkdir backend frontend ml-service
  ```

**Day 2: Backend Setup (Node/Express)**
- Initialize Node app, install dependencies (express, cors, helmet, sequelize, mongoose).
- Set up `server.js` and database connections.
- Code: `backend/config/db.js` (Sequelize + Mongoose connection).

**Day 3: Database Schema Design**
- Create ERD.
- Implement User & Farm models in PostgreSQL.
- Implement Audit Logs model in MongoDB.
- Code: 
  - `backend/models/sql/User.js`
  - `backend/models/sql/Farm.js`

**Day 4: Authentication API (OTP)**
- Setup Twilio account (or generic mock for dev).
- Create `sendOTP` and `verifyOTP` endpoints.
- Code: `backend/controllers/authController.js`.

**Day 5: JWT & Middleware**
- Implement JWT token generation on successful OTP verify.
- Create `authMiddleware.js` to protect routes.

**Day 6: Frontend Setup (Vite + React)**
- Initialize Vite app.
- Install UI libraries (Tailwind CSS, Lucide React).
- Setup routing (React Router).
- Commands: `npm create vite@latest frontend -- --template react`

**Day 7: Review & Testing**
- Test Auth APIs with Postman.
- Verify Docker containers stability.

💻 **Code Deliverables:**
- `docker-compose.yml`
- `backend/server.js`
- `backend/controllers/authController.js`
- `backend/middleware/authMiddleware.js`
- `backend/models/sql/User.js`

🧪 **Testing:**
- [ ] Run `docker-compose up` - ensure all DBs are up.
- [ ] POST `/api/auth/send-otp` -> Receive simulated OTP.
- [ ] POST `/api/auth/verify-otp` -> Receive JWT.

⚠️ **Potential Blockers & Solutions:**
- **Issue:** Docker port conflicts. **Sol:** Check running services or change ports in `docker-compose.yml`.
- **Issue:** Twilio credits. **Sol:** Use console logging for OTP in dev mode.

📊 **Progress Metrics:**
- Docker services running: 3 (PG, Mongo, Redis).
- 2 Working API Endpoints (Send/Verify OTP).

🔗 **Dependencies:**
- Docker Desktop installed.
- Twilio Account (optional for dev).

---

### 📅 WEEK 2: Frontend Auth & Farm Profile Management
🎯 **Objectives:**
- [ ] Create Login/Register screens with OTP.
- [ ] Implement Multi-language skeleton (i18n).
- [ ] Build User Profile & Farm Details forms.
- [ ] Connect Frontend to Backend Auth.

📋 **Daily Breakdown:**

**Day 1: Design System & i18n**
- Setup Tailwind theme (colors, typography).
- configure `i18next` for 5 languages.
- Create `public/locales/{en,hi,mr,ta,te}/translation.json`.

**Day 2: Auth Pages**
- Build `Login.jsx` and `OTPInput.jsx`.
- Integrate Axios service for API calls.

**Day 3: Protected Routes & Context**
- Create `AuthContext.jsx` to store JWT/User.
- Create `run_auth_check` utility.
- Implement `ProtectedRoute` component.

**Day 4: Backend - Farm Management APIs**
- Create CRUD endpoints for Farms (add land, crop type, soil info).
- Code: `backend/controllers/farmController.js`.

**Day 5: Farm Profile UI**
- Build `FarmProfile.jsx` (Forms for Land size, Irrigation type).
- Integrate Google Maps API/OpenStreetMap for location picking.

**Day 6: State Management**
- Setup Query (TanStack Query) for data fetching.
- Connect Farm forms to Backend.

**Day 7: End-to-End Auth Test**
- Full flow: Register -> OTP -> Create Farm Profile -> Dashboard.

💻 **Code Deliverables:**
- `frontend/src/pages/Login.jsx`
- `frontend/src/context/AuthContext.jsx`
- `backend/controllers/farmController.js`
- `frontend/src/pages/FarmOnboarding.jsx`

🧪 **Testing:**
- [ ] Login with valid OTP redirects to specific page.
- [ ] Invalid JWT redirects to Login.
- [ ] Farm creation saves correctly to PostgreSQL.

⚠️ **Potential Blockers & Solutions:**
- **Issue:** CORS errors. **Sol:** Configure `cors` middleware in Express to accept Frontend origin.

📊 **Progress Metrics:**
- User can log in and see their profile.
- Database has "Farms" populated.

🔗 **Dependencies:**
- Google Maps API Key (optional, can use Leaflet).

---

### 📅 WEEK 3: Core Dashboard & Weather Integration
🎯 **Objectives:**
- [ ] Build Main Farmer Dashboard.
- [ ] Integrate OpenWeatherMap API (Backend proxy).
- [ ] Display real-time weather & 7-day forecast.
- [ ] Responsive Mobile Layout adjustments.

📋 **Daily Breakdown:**

**Day 1: Dashboard UI Layout**
- Create Sidebar/BottomNavigation for mobile.
- Design `Dashboard.jsx` grid (Weather card, Active Crops, Alerts).

**Day 2: Backend - Weather Service**
- Register for OpenWeatherMap (OneCall API).
- Create `backend/services/weatherService.js` to fetch data and cache in Redis.
- Endpoint: GET `/api/weather?lat=x&lon=y`.

**Day 3: Redis Caching**
- Implement caching strategy (cache weather for 1 hour to save API calls).
- Middleware: `cacheMiddleware.js`.

**Day 4: Frontend - Weather Widget**
- Component: `WeatherCard.jsx` (Current temp, humidity, icon).
- Component: `ForecastList.jsx` (Horizontal scroll for days).

**Day 5: Advisory Component Logic**
- Static rule-based advisories based on weather (e.g., "High wind -> Do not spray pesticides").
- Display simple "Tip of the Day".

**Day 6: Responsiveness Polish**
- Ensure Touch targets are large (min 44px) for farmers.
- Test on Mobile Viewport (Chrome DevTools).

**Day 7: Integration Testing**
- Verify cached weather data loads instantly on refresh.

💻 **Code Deliverables:**
- `backend/services/weatherService.js`
- `backend/routes/weatherRoutes.js`
- `frontend/src/components/WeatherCard.jsx`
- `frontend/src/pages/Dashboard.jsx`

🧪 **Testing:**
- [ ] Weather API returns data.
- [ ] Redis keys created for specific coordinates.
- [ ] UI displays icons correctly.

⚠️ **Potential Blockers & Solutions:**
- **Issue:** API Rate limits. **Sol:** Strict Redis caching strategy.

📊 **Progress Metrics:**
- Dashboard loads with live weather data.
- Redis hit rate > 80%.

🔗 **Dependencies:**
- OpenWeatherMap API Key.

---

### 📅 WEEK 4: ML Service Integration (Crop Recommendation)
🎯 **Objectives:**
- [ ] Setup Python Flask ML Service.
- [ ] Train/Load Crop Recommendation Model.
- [ ] Connect Backend to ML Service.
- [ ] Frontend Form for Crop Prediction.

📋 **Daily Breakdown:**

**Day 1: Flask Setup**
- Initialize `ml-service/app.py`.
- Install scikit-learn, pandas, numpy, flask.

**Day 2: Data & Model Training**
- Acquire dataset (Soil, Rainfall, Temperature, Yield).
- Train Random Forest/XGBoost Classifier.
- Save model as `crop_recommender.pkl`.

**Day 3: ML API Endpoint**
- Create POST `/predict-crop` in Flask.
- Input: N, P, K, Temperature, Humidity, pH, Rainfall.
- Output: Recommended Crop List with confidence.

**Day 4: Node -> Python Communication**
- In Backend, create `services/mlBridge.js`.
- Use Axios to call Flask service from Node.

**Day 5: Frontend - Recommendation Form**
- Create `CropRecommend.jsx`.
- Inputs: Soil test data (slider/number inputs).

**Day 6: Results Visualization**
- Display recommended crops with images.
- "Why this crop?" simple explanation.

**Day 7: Validation**
- Test with known inputs to see if logic holds.

💻 **Code Deliverables:**
- `ml-service/app.py`
- `ml-service/train_model.py`
- `ml-service/models/crop_recommender.pkl`
- `frontend/src/pages/CropRecommend.jsx`

🧪 **Testing:**
- [ ] Flask endpoint returns JSON 200.
- [ ] End-to-End: Frontend -> Node -> Flask -> Node -> Frontend.

⚠️ **Potential Blockers & Solutions:**
- **Issue:** Flask CORS or port access from container. **Sol:** Use Docker network aliases (`http://ml-service:5000`).

📊 **Progress Metrics:**
- 1 Trained Model serialized.
- Successful prediction flow.

🔗 **Dependencies:**
- Dataset for Crop Recommendation (Kaggle/Gov portal).

---

### 📅 WEEK 5: Disease Detection (Computer Vision)
🎯 **Objectives:**
- [ ] Implement Image Upload to S3/Cloudinary/Local.
- [ ] Load Pre-trained CNN model (e.g., MobileNet/ResNet tuned for plants).
- [ ] Build Camera Capture UI.

📋 **Daily Breakdown:**

**Day 1: Image Upload Backend**
- Setup `multer` in Node.js for file handling.
- Configure storage (local 'uploads' folder for dev, S3 for prod).
- Endpoint: POST `/api/crops/disease-detect`.

**Day 2: ML - Disease Model**
- Load TensorFlow/Keras model (`plant_disease_model.h5`).
- Create Flask endpoint: POST `/predict-disease`.
- Preprocessing: Resize, Normalize image.

**Day 3: Camera UI**
- Use `react-webcam` or HTML5 Camera API.
- Component: `CameraCapture.jsx` (Switch camera, Capture, Retake).

**Day 4: Integration**
- Node receives image -> Sends to Flask -> Flask returns Class + Confidence.
- Node saves record to MongoDB (Image URL + Result).

**Day 5: Result Display**
- Show Detected Disease info.
- Show "Treatment/Cure" suggestions (static mapping based on disease label).

**Day 6: Optimization**
- Compress images before upload using browser `canvas` to save data.

**Day 7: Testing**
- Test with sample images of healthy/diseased leaves.

💻 **Code Deliverables:**
- `frontend/src/components/CameraCapture.jsx`
- `backend/controllers/diseaseController.js`
- `ml-service/disease_prediction.py`

🧪 **Testing:**
- [ ] Upload non-image file -> Error.
- [ ] Upload plant image -> Return valid class.

⚠️ **Potential Blockers & Solutions:**
- **Issue:** Large ML model slows down Flask. **Sol:** Keep model in memory; don't reload on every request. Use TFLite if needed.

📊 **Progress Metrics:**
- Image upload works.
- Disease prediction accuracy reasonable on test set.

🔗 **Dependencies:**
- Trained Plant Disease Model (or reliable public checkpoint).

---

### 📅 WEEK 6: Market Prices & Scraping
🎯 **Objectives:**
- [ ] Implement Web Scraper for Mandi prices.
- [ ] Build Market Price API.
- [ ] Frontend Market View (Tables/Charts).

📋 **Daily Breakdown:**

**Day 1: Scraper Logic**
- Use `puppeteer` or `cheerio` in Node.js (scheduled task).
- Target site: eNAM or Agmarknet.
- Script: `backend/jobs/priceScraper.js`.

**Day 2: Scheduler**
- Setup `node-cron` to runs scraper daily at 6 AM.
- Save data to PostgreSQL `MarketPrices` table.

**Day 3: Market API**
- GET `/api/market/prices?crop=wheat&district=pune`.
- Add filtering and sorting.

**Day 4: Market Frontend**
- Component: `PriceTicker.jsx` (Marquee for top crops).
- Page: `MarketPrices.jsx` with search filter.

**Day 5: Historical Trends**
- Add simple line chart using `recharts`.
- Show "Price up/down" indicators.

**Day 6-7: Refinement**
- Handle scraper failures.
- Add "Last Updated" timestamp.

💻 **Code Deliverables:**
- `backend/jobs/priceScraper.js`
- `backend/models/sql/MarketPrice.js`
- `frontend/src/pages/MarketPrices.jsx`

🧪 **Testing:**
- [ ] Scraper fetches real data.
- [ ] Database updates without duplicates.

⚠️ **Potential Blockers & Solutions:**
- **Issue:** Target site changes DOM. **Sol:** Write robust selectors, add fallback data.

📊 **Progress Metrics:**
- Database populated with real market data.

🔗 **Dependencies:**
- None.

---

### 📅 WEEK 7: Community Forum
🎯 **Objectives:**
- [ ] Build Community Feed.
- [ ] Create Post / Comment functionality.
- [ ] Implement Likes/Upvotes.

📋 **Daily Breakdown:**

**Day 1: Forum Schema**
- MongoDB Models: `Post`, `Comment`.
- Fields: author, content, image, likes, tags.

**Day 2: Post API**
- CRUD for Posts.
- Image upload support for posts.

**Day 3: Feed UI**
- Infinite Scroll component for feed.
- Post Card component.

**Day 4: Interaction APIs**
- Like/Unlike endpoints.
- Add Comment endpoint.

**Day 5: Real-time (Optional)**
- Setup Socket.io basics for future real-time notifications on comments.
- For now, polling or simple refresh.

**Day 6: User Attribution**
- Show "Farmer from [Location]" badges on posts.

**Day 7: Performance Check**
- Pagination logic optimization for feed.

💻 **Code Deliverables:**
- `backend/models/mongo/Post.js`
- `backend/controllers/communityController.js`
- `frontend/src/pages/Community.jsx`

🧪 **Testing:**
- [ ] Create Post -> Appears in Feed.
- [ ] Like count updates.

⚠️ **Potential Blockers & Solutions:**
- **Issue:** Inappropriate content. **Sol:** Add basic bad-word filter/flagging system.

📊 **Progress Metrics:**
- Post creation and retrieval working seamlessly.

🔗 **Dependencies:**
- None.

---

### 📅 WEEK 8: Voice Assistant Integration
🎯 **Objectives:**
- [ ] Implement Speech-to-Text (STT) for inputs.
- [ ] Implement Text-to-Speech (TTS) for reading advisories.
- [ ] Multilingual voice support.

📋 **Daily Breakdown:**

**Day 1: Browser Speech API**
- Research `window.SpeechRecognition`.
- Create hook: `useSpeechToText.js`.

**Day 2: Voice Input Component**
- Create "Mic Button" component.
- Fill form inputs using voice (e.g., "Wheat" -> fills Crop input).

**Day 3: Server-side STT (Fallback)**
- Integrate Google Speech-to-Text API (Node.js) for better regional language support if browser fails.

**Day 4: Navigation by Voice**
- Simple commands setup: "Go to Weather", "Check Prices".

**Day 5: Text-to-Speech (Advisories)**
- Add "Read Aloud" button for weather warnings and disease diagnosis.
- Use `window.speechSynthesis`.

**Day 6: Language Mapping**
- Ensure Hindi TTS works when app language is Hindi.

**Day 7: Testing**
- Test in noisy environments (simulating farm).

💻 **Code Deliverables:**
- `frontend/src/hooks/useSpeechToText.js`
- `frontend/src/components/VoiceMic.jsx`
- `backend/services/googleSpeech.js`

🧪 **Testing:**
- [ ] Voice input correctly transcribes to text field.
- [ ] TTS reads out text clearly in chosen language.

⚠️ **Potential Blockers & Solutions:**
- **Issue:** Browser compatibility (Safari). **Sol:** Use external API or polyfills.

📊 **Progress Metrics:**
- Voice commands functioning for navigation and form filling.

🔗 **Dependencies:**
- Google Cloud Speech API Key (optional).

---

### 📅 WEEK 9: PWA & Offline Support
🎯 **Objectives:**
- [ ] Register Service Worker.
- [ ] Configure Manifest.json.
- [ ] Implement IndexedDB for offline storage.
- [ ] Background Sync.

📋 **Daily Breakdown:**

**Day 1: PWA Configuration**
- Configure `vite-plugin-pwa`.
- Set icons (192, 512), theme_color, name in `vite.config.js`.

**Day 2: Service Worker Caching**
- Cache strategy: NetworkFirst for APIs, CacheFirst for assets/fonts.
- Cache the "App Sell" so it loads instantly.

**Day 3: IndexedDB Setup**
- Use `idb` library.
- Create store for `OfflineForms` (e.g., creating a post while offline).

**Day 4: Offline State Management**
- Detect network status (`navigator.onLine`).
- Show "You are offline" banner.

**Day 5: Background Sync (Conceptual)**
- Store failed requests in IndexedDB.
- Retry when online (Logic in `App.jsx` or Service Worker).

**Day 6: Installability**
- Create custom "Install App" prompt button.

**Day 7: Lighthouse Audit**
- Run Lighthouse. Aim for PWA badge.

💻 **Code Deliverables:**
- `vite.config.js` (PWA section)
- `src/services/db.js` (IndexedDB wrap)

🧪 **Testing:**
- [ ] Turn off WiFi -> App still opens.
- [ ] Navigate to previously visited pages -> Loads from cache.

⚠️ **Potential Blockers & Solutions:**
- **Issue:** Cache invalidation. **Sol:** Use versioning in SW config.

📊 **Progress Metrics:**
- Lighthouse PWA score 100%.

🔗 **Dependencies:**
- None.

---

### 📅 WEEK 10: Notifications & Gamification
🎯 **Objectives:**
- [ ] Push Notifications (Firebase/FCM or WebPush).
- [ ] SMS Alerts via Twilio.
- [ ] User Badges & Leaderboard.

📋 **Daily Breakdown:**

**Day 1: FCM Setup**
- Setup Firebase project.
- Get VAPID keys.
- Frontend: Request Notification Permission.

**Day 2: Backend Notification Trigger**
- Endpoint to send notification (e.g., "Heavy Rain Alert").
- Listen to Weather service events.

**Day 3: SMS Fallback**
- Integration logic: If User has no smartphone/offline -> Send SMS.

**Day 4: Gamification Schema**
- Add `points` and `badges` to User model.
- Logic: "Posted 5 tips" -> "Community Star" badge.

**Day 5: Leaderboard UI**
- Page showing Top Contributors.

**Day 6: Rewards System**
- Simple point increment logic on actions (Daily login, Post).

**Day 7: Testing**
- Send test notification to device.

💻 **Code Deliverables:**
- `frontend/public/firebase-messaging-sw.js`
- `backend/services/notificationService.js`

🧪 **Testing:**
- [ ] Receive push notification on mobile.
- [ ] Receive SMS.

⚠️ **Potential Blockers & Solutions:**
- **Issue:** iOS Push Notification support. **Sol:** Ensure iOS 16.4+ PWA installed to home screen.

📊 **Progress Metrics:**
- Notifications delivery rate.

🔗 **Dependencies:**
- Firebase Account.
- Twilio Account.

---

### 📅 WEEK 11: Admin Panel & Analytics
🎯 **Objectives:**
- [ ] Admin Dashboard (Manage Users, Crops).
- [ ] Analytics (User growth, Activity).
- [ ] Content Management (CMS) for Advisories.

📋 **Daily Breakdown:**

**Day 1: Admin Layout**
- Simple separate layout/route `/admin`.
- Role-based access control (RBAC).

**Day 2: User Management**
- List all users. Block/Delete/Verify users.

**Day 3: CMS for Advisory**
- CRUD for static advisories/tips database.

**Day 4: Analytics API**
- Aggregation queries (Count users by district, Pest reports count).

**Day 5: Analytics Charts**
- Display growth charts on Admin Dashboard.

**Day 6: Feedback Handling**
- View user feedback/reports.

**Day 7: Security Audit**
- Ensure Admin APIs are strictly protected.

💻 **Code Deliverables:**
- `backend/controllers/adminController.js`
- `frontend/src/pages/admin/*`

🧪 **Testing:**
- [ ] Normal user cannot access `/admin`.

⚠️ **Potential Blockers & Solutions:**
- **Issue:** Data privacy. **Sol:** Anonymize analytics data.

📊 **Progress Metrics:**
- Admin has full control over content.

🔗 **Dependencies:**
- None.

---

### 📅 WEEK 12: Deployment, Buffer & Documentation
🎯 **Objectives:**
- [ ] Production Build.
- [ ] Cloud Deployment.
- [ ] Documentation.
- [ ] Final Bug Fixes.

📋 **Daily Breakdown:**

**Day 1: Production Build**
- `npm run build` frontend.
- Serve static files via Nginx or Node.

**Day 2: Docker Orchestration**
- Finalize `docker-compose.prod.yml`.
- Add `certbot` for SSL (HTTPS).

**Day 3: Cloud Setup (AWS EC2 / DigitalOcean)**
- Provision VM.
- Install Docker.
- Clone repo & Pull images.

**Day 4: CI/CD Pipeline**
- Setup GitHub Actions to build and push Docker images on push to `main`.

**Day 5: Documentation**
- Write `README.md` (Setup).
- Write `API_DOCS.md`.
- Create User Manual PDF.

**Day 6: Stress Testing**
- Use Apache Bench/k6 for load testing.

**Day 7: Launch**
- DNS mapping (Domain name).
- Final sanity check.

💻 **Code Deliverables:**
- `docker-compose.prod.yml`
- `.github/workflows/deploy.yml`
- `README.md`

🧪 **Testing:**
- [ ] HTTPS is valid.
- [ ] All APIs responsive under load.

⚠️ **Potential Blockers & Solutions:**
- **Issue:** Production bugs. **Sol:** Use this week as buffer.

📊 **Progress Metrics:**
- Live URL accessible.

🔗 **Dependencies:**
- Domain Name.
- Cloud Provider Account.

---

## 📊 API ENDPOINTS REFERENCE

| Method | Endpoint | Purpose | Auth? | Week |
|:---|:---|:---|:---|:---|
| **AUTH** | | | | |
| POST | `/api/auth/send-otp` | Send login OTP | No | 1 |
| POST | `/api/auth/verify-otp` | Verify OTP & Get Token | No | 1 |
| GET | `/api/auth/me` | Get current user profile | Yes | 1 |
| **FARMS** | | | | |
| POST | `/api/farm` | Create Farm Profile | Yes | 2 |
| GET | `/api/farm` | Get User Farms | Yes | 2 |
| **WEATHER**| | | | |
| GET | `/api/weather` | Get current & forecast | Yes | 3 |
| **CROPS** | | | | |
| POST | `/api/crops/predict` | ML Crop Recommendation | Yes | 4 |
| POST | `/api/crops/disease` | Disease Detection (Image) | Yes | 5 |
| **MARKET** | | | | |
| GET | `/api/market` | Get Market Prices | Yes | 6 |
| **COMMUNITY**| | | | |
| GET | `/api/posts` | Feed | Yes | 7 |
| POST | `/api/posts` | Create Post | Yes | 7 |

---

## 🗄️ DATABASE SCHEMA

### SQL (PostgreSQL) - Structured Data

**Users Table**
- `id` (UUID, PK)
- `phone` (VARCHAR, Unique)
- `name` (VARCHAR)
- `language` (VARCHAR)
- `role` (ENUM: farmer, expert, admin)
- `created_at` (TIMESTAMP)

**Farms Table**
- `id` (UUID, PK)
- `user_id` (FK -> Users)
- `location_lat` (FLOAT)
- `location_lon` (FLOAT)
- `soil_type` (VARCHAR)
- `acreage` (FLOAT)

**MarketPrices Table**
- `id` (SERIAL)
- `crop_name` (VARCHAR)
- `state` (VARCHAR)
- `district` (VARCHAR)
- `price` (FLOAT)
- `date` (DATE)

### NoSQL (MongoDB) - Unstructured/High Volume

**DiseaseLogs Collection**
- `_id`
- `user_id`
- `image_url`
- `detected_disease`
- `confidence`
- `timestamp`

**CommunityPosts Collection**
- `_id`
- `user_id`
- `content`
- `image_url` (optional)
- `likes` (Array of user_ids)
- `comments` (Array of objects)

---

## 🤖 ML MODEL PIPELINE

1.  **Data Ingestion**: Collect soil data (Gov datasets) and plant leaf images (PlantVillage dataset).
2.  **Preprocessing**:
    *   *Structured*: Handle missing values, Normalization.
    *   *Images*: Resize to 224x224, Augmentation (Rotate, Flip).
3.  **Training**:
    *   *Recommender*: Random Forest (sklearn).
    *   *Disease*: MobileNetV2 (TensorFlow/Keras).
4.  **Serialization**: Save as `.pkl` and `.h5`.
5.  **Inference API**: Flask loads models on startup. Accepts JSON/Image -> Returns Prediction.

---

## 🚀 DEPLOYMENT GUIDE

1.  **Preparation**:
    *   Ensure `Dockerfile` exists in `backend`, `frontend`, `ml-service`.
    *   Ensure `.env` variables are set for Production.

2.  **Docker Compose (Prod)**:
    ```yaml
    services:
      reverse-proxy:
        image: nginx
        ports: ["80:80", "443:443"]
      backend:
        restart: always
        env_file: .env
      frontend:
        build: ./frontend
      ml-service:
        build: ./ml-service
    ```

3.  **SSL Setup**:
    *   Use Certbot in a container or on host to generate Let's Encrypt certificates.
    *   Mount certs to Nginx container.

4.  **Monitoring**:
    *   Use `docker stats` for basic monitoring.
    *   Setup 'UptimeRobot' to ping the URL.

---

## 📚 DOCUMENTATION CHECKLIST

- [ ] **README.md**: Project overview, Quickstart commands.
- [ ] **run_instructions.md**: Specifics on "How to run Development vs Production".
- [ ] **API.md**: Output of Swagger/Postman collection.
- [ ] **USER_MANUAL_HI.pdf**: Hindi guide for farmers with screenshots.
