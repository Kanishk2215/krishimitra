import sys
sys.stdout.reconfigure(encoding='utf-8')
import google.generativeai as genai
import os

os.environ["GRPC_VERBOSITY"] = "NONE"

key = "AIzaSyBMIOX6ZbzW4LYxq7iueSNqCZMlUKBsWZ8"
genai.configure(api_key=key)

print("Checking available models for your Key...")
try:
    count = 0
    for m in genai.list_models():
        count += 1
        print(f"✅ FOUND: {m.name}")
        if 'generateContent' in m.supported_generation_methods:
            print(f"   -> Supports Chat! (Use this name)")
            
    if count == 0:
        print("❌ NO MODELS FOUND. This confirms the API is NOT ENABLED.")
        print("👉 Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com")
        
except Exception as e:
    print(f"❌ ERROR: {e}")
    print("This usually means the 'Generative Language API' is disabled in Google Cloud.")
