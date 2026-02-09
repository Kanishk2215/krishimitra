import random
from datetime import datetime, timedelta

class ChatAssistant:
    def __init__(self):
        # State Management: {user_id: {"state": "diagnosing", "context": {...}}}
        self.user_sessions = {}
        
        # Knowledge Base for specific crops/problems
        self.knowledge_graph = {
            'deficiency': {
                'nitrogen': {
                    'symptoms': ['yellow leaves', 'pili', 'yellowing', 'stunted'],
                    'solution': "Apply 15 kg Urea per acre. Ensure soil moisture before application.",
                    'product': "Urea",
                    'shop': "Ramesh Agro (2km)",
                    'phone': "9876543210"
                },
                'phosphorus': {
                    'symptoms': ['purple leaves', 'dark green', 'slow growth'],
                    'solution': "Apply DAP (Di-ammonium Phosphate) 50kg per acre as basal dose.",
                    'product': "DAP",
                    'shop': "Kisan Kendra (4km)",
                    'phone': "9123456780"
                }
            }
        }

    def process_query(self, text, user_id="guest"):
        """
        Process user query with context awareness and multi-turn logic.
        """
        text = text.lower()
        
        # Get or create session
        if user_id not in self.user_sessions:
            self.user_sessions[user_id] = {"state": "idle", "context": {}}
        
        session = self.user_sessions[user_id]
        current_state = session["state"]
        
        # --- STATE MACHINE LOGIC ---
        
        # STATE 1: IDLE (Start of conversation)
        if current_state == "idle":
            # Keyword matching for Intent
            if any(w in text for w in ["yellow", "pili", "kamjor", "weak", "spots"]):
                session["state"] = "diagnosing_symptom"
                session["context"]["problem"] = "unknown_health"
                return self._response(
                    "Your crop might have a nutrient deficiency. Can you describe if the leaves are yellowing or have spots? Or send a photo.",
                    action="request_photo"
                )
            
            if any(w in text for w in ["weather", "mausam"]):
                return self._response("It is 28°C and Sunny. No rain expected today.")
                
            if any(w in text for w in ["market", "bhav", "rate"]):
                return self._response("Wheat: ₹2125/q | Rice: ₹1950/q at Local Mandi.")
                
            # Default Greeting
            return self._response("Namaste! I can help with Crop Health, Fertilizer, Weather, or Market Prices. What do you need?")

        # STATE 2: DIAGNOSING (User confirmed symptom or sent photo)
        elif current_state == "diagnosing_symptom":
            # Heuristic: Check for specific symptoms in text or assume photo confirmation
            if "nitrogen" in text or "urea" in text or "yellow" in text or "photo" in text:
                # Diagnosis Confirmed
                deficiency = self.knowledge_graph['deficiency']['nitrogen']
                session["state"] = "solution_proposed"
                session["context"]["diagnosis"] = "nitrogen"
                
                reply = (
                    f"✅ Confirmed: Nitrogen Deficiency.\n"
                    f"💊 Solution: {deficiency['solution']}\n"
                    f"🏪 Nearby: {deficiency['shop']} (📞 {deficiency['phone']})\n\n"
                    f"Should I set a reminder for tomorrow?"
                )
                return self._response(reply, action="show_shop_map")
            
            else:
                 return self._response("I couldn't identify that significantly. Could you upload a clear photo?")

        # STATE 3: SOLUTION PROPOSED (Waiting for reminder confirmation)
        elif current_state == "solution_proposed":
            if any(w in text for w in ["yes", "ha", "han", "ok", "reminder", "alert"]):
                session["state"] = "idle" # Reset
                reminder_time = (datetime.now() + timedelta(days=1)).strftime("%I:%M %p")
                return self._response(f"✅ Alert set for tomorrow at {reminder_time}. I will remind you to apply Urea.")
            
            elif any(w in text for w in ["no", "nahi"]):
                session["state"] = "idle"
                return self._response("Okay, no reminder set. Let me know if you need anything else.")
                
            return self._response("Should I set a reminder? (Yes/No)")

        # Fallback reset
        session["state"] = "idle"
        return self._response("I didn't understand. Let's start over. How can I help?")

    def _response(self, text, action=None):
        return {
            "response": text,
            "action": action,
            "timestamp": datetime.now().isoformat()
        }
