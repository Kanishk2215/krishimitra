
"""
🔍 COMPLETE BOT DEBUG - Find Why Response Not Coming
Run this to test EVERY part of your bot
"""

import google.generativeai as genai
import requests
import json
import os

print("\n" + "="*70)
print("🚨 DEBUGGING: BOT NOT RESPONDING ISSUE")
print("="*70)

# =============================================================================
# TEST 1: GEMINI API DIRECT TEST
# =============================================================================
print("\n📍 TEST 1: Direct Gemini API Test")
print("-" * 70)

key = os.getenv("GOOGLE_API_KEY", "AIzaSyBMIOX6ZbzW4LYxq7iueSNqCZMlUKBsWZ8")
print(f"API Key: {key[:15]}...{key[-10:]}")

try:
    genai.configure(api_key=key)
    model = genai.GenerativeModel('gemini-pro')
    
    # Test English
    print("\n   Testing English query...")
    response = model.generate_content("Say 'Hello, I am working!'")
    print(f"   ✅ English Response: {response.text}")
    
    # Test Tamil
    print("\n   Testing Tamil query...")
    tamil_query = "கோதுமை எப்படி வளர்ப்பது?"
    response = model.generate_content(f"You must respond in Tamil. User asked: {tamil_query}")
    print(f"   ✅ Tamil Response: {response.text}")
    
    print("\n   ✅ GEMINI API IS WORKING!")
    gemini_working = True
    
except Exception as e:
    print(f"\n   ❌ GEMINI FAILED: {e}")
    print("\n   🔧 SOLUTIONS:")
    print("      1. Check API key at: https://makersuite.google.com/app/apikey")
    print("      2. Enable 'Generative Language API' in Google Cloud Console")
    print("      3. Wait 60 seconds if quota limit hit")
    gemini_working = False

# =============================================================================
# TEST 2: BACKEND SERVER TEST
# =============================================================================
print("\n\n📍 TEST 2: Backend Server Connection")
print("-" * 70)

backend_urls = [
    "http://localhost:5001",
    "http://127.0.0.1:5001",
    "http://0.0.0.0:5001",
]

backend_url = None
for url in backend_urls:
    try:
        print(f"\n   Trying: {url}/health ...")
        response = requests.get(f"{url}/health", timeout=3)
        if response.status_code == 200:
            print(f"   ✅ Backend is RUNNING at {url}")
            backend_url = url
            break
    except Exception as e:
        print(f"   ❌ Not accessible: {str(e)[:50]}")

if not backend_url:
    print("\n   ❌ BACKEND SERVER NOT RUNNING!")
    print("\n   🔧 SOLUTION: Start backend with:")
    print("      python backend_fixed.py")
    print("      (or python backend.py)")
    
    # Don't exit, still allow other tests if possible or manual check
    # exit() 

# =============================================================================
# TEST 3: BACKEND /chat/send ENDPOINT TEST
# =============================================================================
if backend_url:
    print("\n\n📍 TEST 3: Backend Chat Endpoint Test")
    print("-" * 70)

    test_messages = [
        {"text": "Hello, are you working?", "language": "en", "label": "English"},
        {"text": "கோதுமை எப்படி வளர்ப்பது?", "language": "auto", "label": "Tamil"},
        {"text": "गेहूं कैसे उगाएं?", "language": "auto", "label": "Hindi"},
    ]

    for test in test_messages:
        print(f"\n   Testing {test['label']}: {test['text'][:30]}...")
        
        try:
            response = requests.post(
                f"{backend_url}/chat/send",
                json={
                    "text": test['text'],
                    "language": test['language'],
                    "user_id": "test_user"
                },
                timeout=30
            )
            
            print(f"   Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    bot_reply = data['data']['response']
                    print(f"   ✅ Bot Response: {bot_reply[:100]}...")
                else:
                    print(f"   ❌ Error in response: {data.get('error', 'Unknown')}")
            else:
                print(f"   ❌ HTTP Error: {response.text[:200]}")
                
        except requests.exceptions.Timeout:
            print(f"   ❌ TIMEOUT! Backend took too long (>30s)")
            print(f"   🔧 SOLUTION: Check backend console for errors")
        except Exception as e:
            print(f"   ❌ Request Failed: {e}")

# =============================================================================
# TEST 4: CHECK WHAT BACKEND RECEIVES
# =============================================================================
if backend_url:
    print("\n\n📍 TEST 4: Simulating Frontend Request")
    print("-" * 70)

    print("\n   Sending exact request like your frontend would...")
    tamil_message = "கோதுமை எப்படி வளர்ப்பது?"

    try:
        response = requests.post(
            f"{backend_url}/chat/send",
            headers={'Content-Type': 'application/json'},
            json={
                "text": tamil_message,
                "language": "auto",
                "user_id": "frontend_test"
            },
            timeout=30
        )
        
        print(f"\n   Request sent successfully")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:300]}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print(f"\n   ✅ Backend responded successfully!")
                print(f"   Bot said: {data['data']['response']}")
            else:
                print(f"\n   ❌ Backend returned error: {data.get('error')}")
        else:
            print(f"\n   ❌ HTTP Error {response.status_code}")
            
    except Exception as e:
        print(f"\n   ❌ Failed: {e}")

# =============================================================================
# TEST 5: NETWORK & CORS TEST
# =============================================================================
if backend_url:
    print("\n\n📍 TEST 5: CORS & Network Test")
    print("-" * 70)

    try:
        # Send OPTIONS request (preflight)
        response = requests.options(f"{backend_url}/chat/send")
        print(f"\n   OPTIONS request status: {response.status_code}")
        print(f"   CORS headers: {response.headers.get('Access-Control-Allow-Origin', 'NOT SET')}")
        
        if response.status_code == 200:
            print("   ✅ CORS is configured correctly")
        else:
            print("   ⚠️ CORS might be blocking requests")
            
    except Exception as e:
        print(f"   ❌ CORS test failed: {e}")

# =============================================================================
# SUMMARY & SOLUTIONS
# =============================================================================
print("\n\n" + "="*70)
print("📊 DIAGNOSIS SUMMARY")
print("="*70)

problems = []
solutions = []

if not gemini_working:
    problems.append("❌ Gemini API not working")
    solutions.append("Fix Gemini API key first (see TEST 1 output above)")

if not backend_url:
    problems.append("❌ Backend server not running")
    solutions.append("Start backend: python backend_fixed.py")

if gemini_working and backend_url:
    print("\n✅ Both Gemini and Backend are working!")
    print("\n🔍 If bot still not responding in UI, the problem is in FRONTEND:")
    print("\n   FRONTEND CHECKLIST:")
    print("   1. Open browser console (F12)")
    print("   2. Check for errors when you click Send")
    print("   3. Look for 'Network' tab - is request being sent?")
    print("   4. Check backend URL in frontend code matches:", backend_url)
    print("\n   COMMON FRONTEND ISSUES:")
    print("   - Wrong backend URL in fetch()")
    print("   - Not displaying response after receiving it")
    print("   - JavaScript error blocking the code")
    print("   - Response coming but not showing in UI")
    
else:
    print("\n❌ PROBLEMS FOUND:")
    for p in problems:
        print(f"   {p}")
    print("\n🔧 SOLUTIONS:")
    for s in solutions:
        print(f"   {s}")

print("\n" + "="*70)
print("🔍 Next: Check your FRONTEND CODE and BROWSER CONSOLE")
print("="*70)

input("\nPress Enter to close...")
