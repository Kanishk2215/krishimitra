import google.generativeai as genai
import os

key = "AIzaSyBMIOX6ZbzW4LYxq7iueSNqCZMlUKBsWZ8"
print(f"Testing Key: {key}")

try:
    genai.configure(api_key=key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Hello")
    
    with open("key_diagnostics.txt", "w") as f:
        f.write("SUCCESS\n")
        f.write(f"Response: {response.text}")
        
except Exception as e:
    print(f"Error: {e}")
    with open("key_diagnostics.txt", "w") as f:
        f.write("FAILURE\n")
        f.write(f"Error Type: {type(e).__name__}\n")
        f.write(f"Error Message: {str(e)}\n")
