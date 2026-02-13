import google.generativeai as genai
import os

key = "AIzaSyBMIOX6ZbzW4LYxq7iueSNqCZMlUKBsWZ8"
print(f"Testing Key: {key}")

try:
    genai.configure(api_key=key)
    # The output from previous step showed 'gemini-2.5-flash', let's verify if that's real or I misread.
    # Actually, let's try 'gemini-2.0-flash-exp' which is common now, or list strictly.
    # Let's print the list first just to be absolutely sure what I saw was real.
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)

except Exception as e:
    print(f"Error: {e}")
