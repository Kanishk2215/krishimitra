import google.generativeai as genai
import os

key = "AIzaSyBMIOX6ZbzW4LYxq7iueSNqCZMlUKBsWZ8"

print(f"Testing API Key: {key[:5]}...")

try:
    genai.configure(api_key=key)
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content("Hello, are you working?")
    print("✅ SUCCESS!")
    print("AI Reply:", response.text)
except Exception as e:
    print("❌ ERROR:")
    print(e)

input("\nPress Enter to close...")
