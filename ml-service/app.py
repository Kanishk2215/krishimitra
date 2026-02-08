from flask import Flask, request, jsonify
import pickle
import numpy as np

app = Flask(__name__)

# Load Model (Placeholder)
model = None
# try:
#     with open('models/crop_recommender.pkl', 'rb') as f:
#         model = pickle.load(f)
# except:
#     print("No model found, running in dummy mode")

@app.route('/')
def home():
    return jsonify({"message": "ML Service is Running"})

@app.route('/predict-crop', methods=['POST'])
def predict_crop():
    data = request.json
    # Fake prediction logic for MVP
    # Input: N, P, K, temp, humidity, ph, rainfall
    return jsonify({
        "recommended_crop": "Wheat",
        "confidence": 0.95,
        "alternatives": ["Barley", "Maize"]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
