import google.generativeai as genai
import os
import sys

# Disable warning about default key
os.environ["GRPC_VERBOSITY"] = "NONE"

key = "AIzaSyBMIOX6ZbzW4LYxq7iueSNqCZMlUKBsWZ8"

print(f"Checking API Status for Key: {key[:10]}...")

try:
    genai.configure(api_key=key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content("Hello from python check")
    
    with open("api_status.txt", "w") as f:
        f.write("SUCCESS\n")
        f.write(f"Response: {response.text}\n")
        
except Exception as e:
    err_msg = str(e)
    if "404" in err_msg:
        details = "API NOT ENABLED or Model Not Found. Enable here: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com"
    elif "400" in err_msg:
        details = "Bad Request (Project ID missing?)"
    elif "403" in err_msg:
        details = "Quota Exceeded or Key Restricted."
    else:
        details = "Unknown Error"
        
    with open("api_status.txt", "w") as f:
        f.write("FAILURE\n")
        f.write(f"Error: {err_msg}\n")
        f.write(f"Explanation: {details}\n")
