
import google.generativeai as genai
import os

key = "AIzaSyBMIOX6ZbzW4LYxq7iueSNqCZMlUKBsWZ8"
genai.configure(api_key=key)

candidates = [
    "gemini-1.5-flash",
    "gemini-1.5-pro", 
    "gemini-1.0-pro",
    "gemini-pro"
]

print("Scanning for working models...")
for m in candidates:
    try:
        model = genai.GenerativeModel(m)
        response = model.generate_content("Hi")
        print(f"✅ {m} IS WORKING!")
        break
    except Exception as e:
        print(f"❌ {m} failed: {e}")
