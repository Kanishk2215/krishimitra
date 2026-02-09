from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import random
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# Helper function to detect diseased spots (simulation of CNN detection)
def detect_lesions(image_bytes):
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        img_np = np.array(img)
        h, w, _ = img_np.shape
        
        # Simple color-based lesion detection (looking for brown/yellow/dark spots)
        # Healthy green is roughly G > R and G > B
        # Lesions are often R > 100, G < 200, B < 150 (brownish/yellowish)
        
        boxes = []
        # Downsample for speed
        step = max(h, w) // 50 
        detected_points = []
        
        for y in range(0, h, step):
            for x in range(0, w, step):
                r, g, b = img_np[y, x]
                # Brownish/Yellowish spot detection logic
                if (r > 80 and g > 60 and r > g - 20 and b < 150):
                    # Check if it's NOT a bright green leaf
                    if not (g > r + 30 and g > b + 30):
                        detected_points.append((x, y))

        if not detected_points:
            # Fallback for very green leaves (detect small dark spots)
            for y in range(0, h, step):
                for x in range(0, w, step):
                    r, g, b = img_np[y, x]
                    if r < 100 and g < 100 and b < 100 and abs(int(r)-int(g)) < 20: # dark spots
                        detected_points.append((x, y))

        # Simple clustering (group points into max 6 boxes)
        if detected_points:
            # Sort points to pick spread out ones
            random.shuffle(detected_points)
            for i in range(min(len(detected_points), 8)):
                px, py = detected_points[i]
                # Create a small box around the point
                bw, bh = random.randint(5, 12), random.randint(5, 12)
                boxes.append({
                    "top": max(0, int((py/h)*100) - bh//2),
                    "left": max(0, int((px/w)*100) - bw//2),
                    "width": bw,
                    "height": bh,
                    "color": random.choice(["#EF4444", "#EAB308", "#F97316"]) # Red, Yellow, Orange
                })
        
        return boxes if boxes else []
    except Exception as e:
        print(f"Detection Error: {e}")
        return []

# Mock data for recommendations
CROP_DATA = [
    {"name": "Soybean", "soil_type": "Black", "season": "Kharif", "base_income": 45000},
    {"name": "Cotton", "soil_type": "Black", "season": "Kharif", "base_income": 60000},
    {"name": "Tur Dal", "soil_type": "Red", "season": "Kharif", "base_income": 50000},
    {"name": "Wheat", "soil_type": "Alluvial", "season": "Rabi", "base_income": 40000},
    {"name": "Maize", "soil_type": "Alluvial", "season": "Kharif", "base_income": 35000}
]

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.json or {}
        soil_type = data.get('soil_type', 'Black')
        season = data.get('season', 'Kharif')
        rainfall = data.get('rainfall', 800)
        land_size = data.get('land_size', 2)
        
        results = []
        for crop in CROP_DATA:
            confidence = 80 + random.randint(0, 15)
            if crop['soil_type'].lower() != soil_type.lower(): confidence -= 30
            if crop['season'].lower() != season.lower(): confidence -= 40
            
            confidence = max(min(confidence, 98), 10)
            
            base_income = crop['base_income']
            investment = int(base_income * 0.3)
            expected_income = int(base_income * land_size)
            profit = expected_income - (investment * land_size)
            
            results.append({
                "name": crop['name'],
                "confidence": f"{confidence}%",
                "income": f"₹{expected_income // 1000}K",
                "investment": f"₹{(investment * land_size) // 1000}K",
                "profit": f"₹{profit // 1000}K",
                "risk": "Low" if confidence > 80 else "Medium",
                "explanation": f"Suitable for {soil_type} soil in {season}.",
                "timeline": [
                    {"week": 1, "task": "Soil Preparation"},
                    {"week": 4, "task": "Fertilization"},
                    {"week": 12, "task": "Pest Control"},
                    {"week": 16, "task": "Harvesting"}
                ]
            })
        
        results.sort(key=lambda x: int(x['confidence'].replace('%', '')), reverse=True)
        return jsonify({"success": True, "recommendations": results[:5]})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/analyze-disease', methods=['POST'])
def analyze_disease():
    try:
        # Get image from request
        if 'image' not in request.files:
            # Fallback for testing
            boxes = [
                {"top": 35, "left": 45, "width": 10, "height": 12, "color": "#EF4444"},
                {"top": 50, "left": 55, "width": 12, "height": 14, "color": "#EF4444"}
            ]
        else:
            file = request.files['image']
            img_bytes = file.read()
            boxes = detect_lesions(img_bytes)

        # Basic logic: if many boxes, severity is high
        severity = "Moderate"
        if len(boxes) > 5: severity = "High"
        elif len(boxes) < 2: severity = "Low"

        soil_type = request.form.get('soil_type', 'Black')
        weather_input = request.form.get('weather', 'Sunny')

        # --- MULTI-MODAL LOGIC SIMULATION ---
        # 1. Advisory generation (Simulating LLM)
        advisory_text = "Based on the visual evidence of lesions"
        if "Blight" in (("Bacterial Leaf Blight" if len(boxes) > 0 else "Healthy Leaf")):
            advisory_text += ", the crop is suffering from Bacterial Blight."
            if "Black" in soil_type:
                advisory_text += " Since you have Black soil which retains moisture, avoid over-watering immediately to prevent bacterial spread."
            elif "Red" in soil_type:
                advisory_text += " For Red soil, ensure drainage is adequate."
            
            if "Rain" in weather_input or "Cloudy" in weather_input:
                advisory_text += " With humid/rainy weather detected, the bacteria can spread rapidly. Application of bactericides is critical TODAY."
            else:
                advisory_text += " Since weather is clear, you have a 24-hour window to apply treatment before it worsens."
        else:
             advisory_text = "Your crop looks healthy! Continue monitoring weekly."

        # 2. RL/ML Simulation for Action Plan
        # Heuristic: High Severity + Humid Weather = Immediate Action
        urgency_score = len(boxes) * 10 
        if "Rain" in weather_input: urgency_score += 20
        
        harvest_prediction = "15-20 days"
        irrigation_advice = "Normal schedule"
        if urgency_score > 50:
            irrigation_advice = "STOP Irrigation for 48h"
            harvest_prediction = "Delayed by 5-7 days due to stress"

        data = {
            "success": True,
            "disease": "Bacterial Leaf Blight" if len(boxes) > 0 else "Healthy Leaf",
            "confidence": f"{random.randint(88, 97)}%",
            "severity": severity,
            "reason": f"Combined Factors: {weather_input} Weather + Pathogen Presence",
            "cause": "Caused by Xanthomonas bacteria." if len(boxes) > 0 else "Overall healthy.",
            "symptoms": [
                "Water-soaked stripes",
                "Yellow lesions"
            ] if len(boxes) > 0 else ["No symptoms"],
            "boxes": boxes,
            
            # --- NEW MULTI-MODAL FIELDS ---
            "smart_advisory": advisory_text,
            "action_plan": {
                "irrigation": irrigation_advice,
                "harvest_impact": harvest_prediction,
                "fertilizer": "Avoid Nitrogen (Urea) now" if len(boxes) > 0 else "Apply NPK 10:26:26"
            },
            
            "damage_assessment": {
                "affected_area": f"{random.randint(25, 35)}%",
                "spread_rate": "High" if urgency_score > 40 else "Moderate",
                "potential_loss": "15-25%",
                "urgency": "CRITICAL: Act within 24h" if urgency_score > 50 else "Monitor closely"
            },
            "economics": {
                "treatment_cost": "₹700",
                "potential_loss_value": "₹12,500",
                "roi": "18x Return",
                "recommendation": "Treat to save yield"
            },
            "weather_timing": {
                "best_time": "Late Afternoon (post 4 PM)" if "Sunny" in weather_input else "Wait for dry spell",
                "reason": f"Based on {weather_input} forecast to maximize absorption.",
                "forecast": f"{weather_input} currently."
            },
            "community": {
                "nearby_cases": random.randint(5, 15),
                "success_rate": "82%",
                "top_tip": "Add garlic paste to neem spray for better adhesion (Ramesh Patil, Expert Farmer)"
            },
            "recovery_tracking": {
                "timeline": [
                    {"day": 0, "status": "30% affected", "icon": "🔴"},
                    {"day": 3, "status": "Upload to track progress", "icon": "📸"},
                    {"day": 7, "status": "Expected 10% affected", "icon": "📉"},
                    {"day": 10, "status": "Full Recovery Expected", "icon": "✅"}
                ]
            },
            "prevention": {
                "factors": ["High Humidity (>80%)", "Dense Planting", "Overhead Irrigation"],
                "next_season": [
                    "Plant resistant varieties (IR-24 or similar)",
                    "Increase row spacing to 20cm",
                    "Spray preventive copper at flowering stage",
                    "Remove infected plant debris immediately"
                ]
            },
            "additional_issues": [
                {"name": "Aphid Infestation", "confidence": "72%", "severity": "Minor"}
            ] if random.random() > 0.5 else [],
            
            # --- END ENHANCED FIELDS ---

            "treatments": {
                "organic": {
                    "name": "Neem Oil & Balanced Nutrition",
                    "price": "₹200/liter",
                    "usage": "Spray Neem oil (5ml/L).",
                    "effectiveness": "85%",
                    "benefits": ["Safe for bees", "Zero harvest waiting", "Improves soil"],
                    "steps": [
                        "Mix 5ml Neem oil with 1 liter of fresh water.",
                        "Add 2-3 drops of liquid soap to help mixing.",
                        "Spray thoroughly on both sides of the leaves.",
                        "Repeat every 7 days during early morning or late evening."
                    ]
                },
                "chemical": {
                    "name": "Copper Oxychloride + Streptocycline",
                    "price": "₹450/kg",
                    "usage": "Mix 2.5g COC and 0.5g Streptocycline per liter.",
                    "effectiveness": "95%",
                    "benefits": ["Fast action", "Kills bacteria on contact", "Rainfastness"],
                    "steps": [
                        "Dissolve 0.5g Streptocycline in a small amount of water first.",
                        "Add it to 1 liter water and mix 2.5g Copper Oxychloride.",
                        "Apply as a foliar spray focusing on infected patches.",
                        "Avoid spraying during high winds or rain."
                    ]
                }
            },
            "shops": [
                {"name": "Shri Ganesh Agri Store", "dist": "2.3 km", "phone": "98220XXXXX", "location": "MIDC Central Market, Nashik"},
                {"name": "Farmers Pride Shop", "dist": "4.1 km", "phone": "90110XXXXX", "location": "Shivaji Nagar Square, Opp. Railway Station"}
            ]
        }
        return jsonify(data)
    except Exception as e:
        print(f"API Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "OK"})


from chatbot import ChatAssistant
chat_assistant = ChatAssistant()

@app.route('/chat/send', methods=['POST'])
def chat_send():
    try:
        data = request.json or {}
        text = data.get('text', '')
        user_id = data.get('user_id', 'guest')
        
        result = chat_assistant.process_query(text, user_id)
        return jsonify({"success": True, "data": result})
    except Exception as e:
        print(f"Chat Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

from fertilizer_recommender import FertilizerRecommender

fertilizer_recommender = FertilizerRecommender()

@app.route('/fertilizer/recommend', methods=['POST'])
def recommend_fertilizer():
    try:
        data = request.json
        result = fertilizer_recommender.recommend(
            crop_name=data.get('crop_name'),
            soil_type=data.get('soil_type'),
            land_size=data.get('land_size'),
            growth_stage=data.get('growth_stage', 'Sowing'),
            soil_test=data.get('soil_test'),
            prefer_organic=data.get('prefer_organic', False),
            budget=data.get('budget'),
            season=data.get('season', 'Kharif')
        )
        return jsonify(result)
    except Exception as e:
        print(f"Fertilizer Recommendation Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

from voice_copilot import VoiceCopilot
voice_copilot = VoiceCopilot()

@app.route('/voice/chat', methods=['POST'])
def voice_chat():
    try:
        if 'audio' not in request.files:
            return jsonify({"success": False, "error": "No audio file provided"}), 400
            
        file = request.files['audio']
        audio_bytes = file.read()
        
        result = voice_copilot.process_voice_query(audio_bytes)
        
        if "error" in result:
             return jsonify({"success": False, "error": result["error"]}), 500

        # Convert audio bytes to base64 to send to frontend
        import base64
        audio_b64 = base64.b64encode(result["ai_audio"]).decode('utf-8')

        return jsonify({
            "success": True,
            "user_text": result["user_text"],
            "ai_text": result["ai_text"],
            "audio_b64": audio_b64
        })
    except Exception as e:
        print(f"Voice Chat Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    # Get port from environment variable (Render sets this)
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False, threaded=True)
