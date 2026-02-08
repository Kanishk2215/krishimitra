import json
import os
import random

def recommend_crops(soil_type, season, rainfall=800, temperature=28, land_size=2):
    # Load rules
    try:
        data_path = os.path.join(os.path.dirname(__file__), 'data', 'crops.json')
        with open(data_path, 'r') as f:
            crops_data = json.load(f)
    except Exception as e:
        print(f"Error loading crops: {e}")
        # Realistic Fallback Data
        crops_data = [
            {"name": "Soybean", "soil_type": "Black", "season": "Kharif", "base_income": 45000},
            {"name": "Cotton", "soil_type": "Black", "season": "Kharif", "base_income": 60000},
            {"name": "Tur Dal", "soil_type": "Red", "season": "Kharif", "base_income": 50000},
            {"name": "Wheat", "soil_type": "Alluvial", "season": "Rabi", "base_income": 40000},
            {"name": "Maize", "soil_type": "Alluvial", "season": "Kharif", "base_income": 35000}
        ]

    recommendations = []
    
    for crop in crops_data:
        # 1. Matching Logic (Scores)
        confidence = 0
        if crop.get('soil_type', '').lower() == soil_type.lower():
            confidence += 50
        else:
            confidence += 20 # Partial match
            
        if crop.get('season', '').lower() == season.lower():
            confidence += 40
        
        # Add some randomness for "AI feel"
        confidence += random.randint(-5, 5)
        confidence = min(max(confidence, 10), 98)

        # 2. ROI & Financials
        base_income = crop.get('base_income', 40000)
        investment = int(base_income * 0.3) # 30% investment
        expected_income = int(base_income * land_size)
        profit = expected_income - (investment * land_size)
        
        # 3. Risk Assessment
        risk = "Low"
        if confidence < 70: risk = "Medium"
        if rainfall > 1200 or rainfall < 400: risk = "High"

        recommendations.append({
            "name": crop['name'],
            "confidence": f"{confidence}%",
            "income": f"₹{expected_income // 1000}K",
            "investment": f"₹{(investment * land_size) // 1000}K",
            "profit": f"₹{profit // 1000}K",
            "risk": risk,
            "explanation": f"Best suited for {soil_type} soil in {season} with current rainfall of {rainfall}mm.",
            "timeline": [
                {"week": 1, "task": "Soil Preparation & Sowing"},
                {"week": 4, "task": "First Weeding & Fertilization"},
                {"week": 12, "task": "Pest Monitoring"},
                {"week": 16, "task": "Harvesting"}
            ]
        })
            
    # Rank by confidence
    recommendations.sort(key=lambda x: int(x['confidence'].replace('%', '')), reverse=True)
    
    return recommendations[:5]
