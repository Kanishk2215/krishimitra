import random
from datetime import datetime, timedelta
import json
import os

class ChatAssistant:
    def __init__(self):
        # State Management
        self.user_sessions = {}
        
        # Enhanced Knowledge Base with RAG-style data
        self.knowledge_base = {
            'crops': {
                'soybean': {
                    'diseases': ['bacterial blight', 'yellow mosaic', 'rust'],
                    'fertilizer': 'Apply DAP 50kg + Urea 25kg per acre at sowing',
                    'season': 'Kharif (June-September)',
                    'soil': 'Black cotton soil, pH 6.5-7.5',
                    'water': '600-1000mm rainfall needed'
                },
                'cotton': {
                    'diseases': ['pink bollworm', 'whitefly', 'wilt'],
                    'fertilizer': 'NPK 20:20:20 @ 50kg + Urea 30kg per acre',
                    'season': 'Kharif',
                    'soil': 'Black soil, well-drained',
                    'water': '500-800mm'
                },
                'wheat': {
                    'diseases': ['rust', 'smut', 'aphids'],
                    'fertilizer': 'Urea 60kg + DAP 40kg per acre',
                    'season': 'Rabi (October-March)',
                    'soil': 'Alluvial, loamy',
                    'water': '400-600mm'
                }
            },
            'symptoms': {
                'yellow leaves': {
                    'cause': 'Nitrogen deficiency or viral infection',
                    'solution': 'Apply Urea 15kg per acre immediately. If viral, remove infected plants.',
                    'product': 'Urea (46% N)',
                    'shop': 'Nearest Kisan Kendra'
                },
                'brown spots': {
                    'cause': 'Fungal infection (Leaf Spot)',
                    'solution': 'Spray Mancozeb 2.5g/L water. Repeat after 10 days.',
                    'product': 'Mancozeb 75% WP',
                    'shop': 'Agri Supply Store'
                },
                'wilting': {
                    'cause': 'Water stress or root rot',
                    'solution': 'Check soil moisture. If wet, reduce watering. If dry, irrigate immediately.',
                    'product': 'Drip irrigation system recommended',
                    'shop': 'Irrigation Equipment Dealer'
                }
            },
            'weather_advice': {
                'hot': 'Avoid spraying pesticides in afternoon. Best time: Early morning or evening.',
                'rainy': 'Do not apply fertilizer during rain. Wait for 2 days after rain stops.',
                'cold': 'Good time for wheat sowing. Ensure soil temperature is above 15°C.'
            }
        }

    def process_query(self, text, user_id="guest"):
        """
        Advanced RAG-style query processing with context awareness
        """
        text_lower = text.lower()
        
        # Get or create session
        if user_id not in self.user_sessions:
            self.user_sessions[user_id] = {"state": "idle", "context": {}}
        
        session = self.user_sessions[user_id]
        
        # Intent Detection using keyword matching (RAG retrieval simulation)
        response_text = ""
        action = None
        
        # 1. Crop-specific queries
        for crop, info in self.knowledge_base['crops'].items():
            if crop in text_lower:
                if 'fertilizer' in text_lower or 'khad' in text_lower:
                    response_text = f"✅ {crop.title()} Fertilizer Plan:\n{info['fertilizer']}\n\n📍 Buy from your nearest Kisan Kendra."
                elif 'disease' in text_lower or 'bimari' in text_lower:
                    response_text = f"⚠️ Common {crop.title()} diseases:\n" + "\n".join([f"• {d.title()}" for d in info['diseases']])
                    response_text += "\n\nSend a photo for accurate diagnosis."
                    action = "request_photo"
                elif 'season' in text_lower or 'mausam' in text_lower:
                    response_text = f"🌾 {crop.title()} Season: {info['season']}\nSoil: {info['soil']}\nWater: {info['water']}"
                else:
                    response_text = f"📚 {crop.title()} Info:\n• Season: {info['season']}\n• Soil: {info['soil']}\n• Water: {info['water']}\n\nWhat would you like to know? (fertilizer/disease/season)"
                break
        
        # 2. Symptom-based diagnosis
        if not response_text:
            for symptom, details in self.knowledge_base['symptoms'].items():
                if symptom in text_lower or any(word in text_lower for word in symptom.split()):
                    response_text = f"🔍 Diagnosis: {details['cause']}\n\n💊 Solution:\n{details['solution']}\n\n🛒 Product: {details['product']}\n📍 Available at: {details['shop']}"
                    session["state"] = "solution_proposed"
                    break
        
        # 3. Weather-related queries
        if not response_text and any(w in text_lower for w in ['weather', 'mausam', 'temperature', 'rain']):
            response_text = "🌦️ Current Weather: 28°C, Clear Sky\n\n" + self.knowledge_base['weather_advice']['hot']
        
        # 4. Market prices
        if not response_text and any(w in text_lower for w in ['price', 'bhav', 'market', 'mandi']):
            response_text = "💹 Today's Mandi Rates:\n• Soybean: ₹4,850/q ▲\n• Cotton: ₹7,200/q ▼\n• Wheat: ₹2,350/q ▲\n\n(Nashik Main Mandi)"
        
        # 5. Greeting
        if not response_text and any(w in text_lower for w in ['hello', 'hi', 'namaste', 'hey']):
            response_text = "🙏 Namaste! I am KrishiMitra AI.\n\nI can help you with:\n🌾 Crop advice\n💊 Disease diagnosis\n🌦️ Weather updates\n💹 Market prices\n\nWhat do you need today?"
        
        # 6. Fallback
        if not response_text:
            response_text = "I understand you're asking about farming. Could you be more specific?\n\nTry asking:\n• 'Soybean fertilizer plan'\n• 'My crop has yellow leaves'\n• 'Today's market price'\n• 'Weather advice'"
        
        return self._response(response_text, action)

    def _response(self, text, action=None):
        return {
            "response": text,
            "action": action,
            "timestamp": datetime.now().isoformat()
        }
