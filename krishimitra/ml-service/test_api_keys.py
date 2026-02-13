"""
KrishiMitra API Key Test & Diagnostics
Tests all API connections and provides detailed error messages
"""

import google.generativeai as genai
import os
import sys

def test_gemini():
    """Test Google Gemini API"""
    print("\n" + "="*60)
    print("🧪 TESTING GOOGLE GEMINI API")
    print("="*60)
    
    # Try multiple key sources
    key = os.getenv("GOOGLE_API_KEY") or "AIzaSyBMIOX6ZbzW4LYxq7iueSNqCZMlUKBsWZ8"
    
    print(f"📝 API Key: {key[:10]}...{key[-5:]}")
    print(f"📝 Key Length: {len(key)} characters")
    
    try:
        # Configure Gemini
        genai.configure(api_key=key)
        print("✅ API Key configured successfully")
        
        # Create model
        model = genai.GenerativeModel('gemini-pro')
        print("✅ Gemini model created successfully")
        
        # Test simple query
        print("\n🔄 Testing simple query...")
        response = model.generate_content("Say 'Hello from Gemini'")
        
        if hasattr(response, 'text') and response.text:
            print(f"✅ Response received: {response.text}")
            print("\n" + "="*60)
            print("🎉 GEMINI API IS WORKING PERFECTLY!")
            print("="*60)
            return True
        else:
            print("⚠️ Response received but no text content")
            print(f"Response: {response}")
            return False
            
    except Exception as e:
        print(f"\n❌ ERROR: {type(e).__name__}")
        print(f"📝 Details: {str(e)}")
        
        # Provide specific troubleshooting
        error_str = str(e).lower()
        if "api key" in error_str or "invalid" in error_str:
            print("\n💡 SOLUTION:")
            print("   1. Check if API key is correct")
            print("   2. Go to: https://makersuite.google.com/app/apikey")
            print("   3. Create a new API key")
            print("   4. Enable 'Generative Language API'")
            print("   5. Replace the key in voice_copilot.py or .env file")
        elif "quota" in error_str or "limit" in error_str:
            print("\n💡 SOLUTION:")
            print("   1. You've hit the API quota limit")
            print("   2. Wait 60 seconds and try again")
            print("   3. Or create a new API key")
        elif "permission" in error_str or "enabled" in error_str:
            print("\n💡 SOLUTION:")
            print("   1. Enable 'Generative Language API' in Google Cloud Console")
            print("   2. Go to: https://console.cloud.google.com/apis/library")
            print("   3. Search for 'Generative Language API'")
            print("   4. Click 'Enable'")
        else:
            print("\n💡 GENERAL TROUBLESHOOTING:")
            print("   1. Check internet connection")
            print("   2. Verify API key is valid")
            print("   3. Try creating a new API key")
            print("   4. Check if 'Generative Language API' is enabled")
        
        return False

def test_openai():
    """Test OpenAI API (if key is available)"""
    try:
        from openai import OpenAI
        key = os.getenv("OPENAI_API_KEY", "")
        
        if not key or key == "":
            print("\n⚠️ OpenAI API key not configured (optional)")
            return False
        
        print("\n" + "="*60)
        print("🧪 TESTING OPENAI API")
        print("="*60)
        
        client = OpenAI(api_key=key)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Say 'Hello from OpenAI'"}]
        )
        
        print(f"✅ OpenAI Response: {response.choices[0].message.content}")
        return True
        
    except ImportError:
        print("\n⚠️ OpenAI library not installed (optional)")
        return False
    except Exception as e:
        print(f"\n⚠️ OpenAI Error: {e}")
        return False

def test_anthropic():
    """Test Anthropic API (if key is available)"""
    try:
        from anthropic import Anthropic
        key = os.getenv("ANTHROPIC_API_KEY", "")
        
        if not key or key == "":
            print("\n⚠️ Anthropic API key not configured (optional)")
            return False
        
        print("\n" + "="*60)
        print("🧪 TESTING ANTHROPIC API")
        print("="*60)
        
        client = Anthropic(api_key=key)
        message = client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=100,
            messages=[{"role": "user", "content": "Say 'Hello from Claude'"}]
        )
        
        print(f"✅ Anthropic Response: {message.content[0].text}")
        return True
        
    except ImportError:
        print("\n⚠️ Anthropic library not installed (optional)")
        return False
    except Exception as e:
        print(f"\n⚠️ Anthropic Error: {e}")
        return False

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("🚀 KrishiMitra API Diagnostics")
    print("="*60)
    
    results = {
        'gemini': test_gemini(),
        'openai': test_openai(),
        'anthropic': test_anthropic()
    }
    
    print("\n" + "="*60)
    print("📊 SUMMARY")
    print("="*60)
    print(f"Gemini (Required): {'✅ Working' if results['gemini'] else '❌ Failed'}")
    print(f"OpenAI (Optional): {'✅ Working' if results['openai'] else '⚠️ Not configured'}")
    print(f"Anthropic (Optional): {'✅ Working' if results['anthropic'] else '⚠️ Not configured'}")
    print("="*60)
    
    if results['gemini']:
        print("\n🎉 SUCCESS! Your KrishiMitra bot is ready to use!")
        print("\n📝 Next Steps:")
        print("   1. Run: python backend_fixed.py")
        print("   2. Test chat at: http://localhost:5001/chat/send")
        print("   3. Open your frontend and start chatting!")
    else:
        print("\n⚠️ GEMINI API REQUIRED!")
        print("   Your bot needs at least Gemini API to work.")
        print("   Please fix the Gemini API key first.")
    
    print("\n" + "="*60 + "\n")
    
    if not sys.platform.startswith('win'):
        print("Press Enter to close...")
    else:
        input("\nPress Enter to close...")

if __name__ == "__main__":
    main()
