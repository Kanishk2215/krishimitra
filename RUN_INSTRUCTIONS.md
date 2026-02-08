# Smart Crop Advisory System - RUN INSTRUCTIONS

This project consists of two parts:
1.  **Backend (Python Flask)**: Handles AI logic, Database connectivity, and Recommendations.
2.  **Frontend (React Vite)**: The user interface for Farmers/Home users.

## 1. Setup Backend (Python)

Navigate to the backend folder:
```bash
cd backend
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Run the server:
```bash
python app.py
```
*The backend will start at `http://127.0.0.1:5000`*

## 2. Setup Frontend (React)

Open a new terminal and navigate to the project root:
```bash
cd d:\Adriuno\SmartCropAdvisory
```

Install dependencies (if not done):
```bash
npm install
```

Run the development server:
```bash
npm run dev
```
*The app will open at `http://localhost:5173`*

## 3. Project Architecture (For Viva)

*   **Frontend**: React.js with Vanilla CSS (Warm Blue Theme).
*   **Backend**: Python Flask REST API.
*   **AI Logic**: Simulated Rule-Based Engine (Deterministic logic for demo stability).
*   **Database**: Mock dictionary (convertible to MySQL using `schema.sql`).
*   **Features**:
    *   **Disease Detection**: Randomly processes input to demonstrate "Good", "Warning", "Danger" states.
    *   **Health Score**: auto-calculated (0-100).
    *   **Safe/Unsafe Advisor**: specific actionable advice.
    *   **Marketplace**: Generates live location links to find stores without scraping.
