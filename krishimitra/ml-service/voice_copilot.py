import os
import io
import google.generativeai as genai
from openai import OpenAI
from anthropic import Anthropic
import re

# Try to import ElevenLabs, but don't fail if not available
try:
    from elevenlabs import ElevenLabs
    ELEVENLABS_AVAILABLE = True
except ImportError:
    try:
        from elevenlabs.client import ElevenLabs
        ELEVENLABS_AVAILABLE = True
    except ImportError:
        print("⚠️ ElevenLabs not available. Voice output will be disabled.")
        ELEVENLABS_AVAILABLE = False
        ElevenLabs = None

# API Keys - Load from environment or use hardcoded (for testing only!)
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "AIzaSyBMIOX6ZbzW4LYxq7iueSNqCZMlUKBsWZ8")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")

# Initialize Gemini
gemini_model = None
gemini_available = False
try:
    if GOOGLE_API_KEY and GOOGLE_API_KEY != "":
        genai.configure(api_key=GOOGLE_API_KEY)
        gemini_model = genai.GenerativeModel('gemini-pro')
        # Test the connection
        # test_response = gemini_model.generate_content("Hi") # Commented out to avoid delay on import, assume config is ok if no error
        gemini_available = True
        print("✅ Gemini initialized successfully")
except Exception as e:
    print(f"⚠️ Gemini Init Error: {e}")
    gemini_model = None
    gemini_available = False

# Initialize OpenAI Client
openai_client = None
openai_available = False
try:
    if OPENAI_API_KEY and OPENAI_API_KEY != "":
        openai_client = OpenAI(api_key=OPENAI_API_KEY)
        openai_available = True
        print("✅ OpenAI initialized successfully")
except Exception as e:
    print(f"⚠️ OpenAI Init Error: {e}")

# Initialize Anthropic Client
anthropic_client = None
anthropic_available = False
try:
    if ANTHROPIC_API_KEY and ANTHROPIC_API_KEY != "":
        anthropic_client = Anthropic(api_key=ANTHROPIC_API_KEY)
        anthropic_available = True
        print("✅ Anthropic initialized successfully")
except Exception as e:
    print(f"⚠️ Anthropic Init Error: {e}")

# Initialize ElevenLabs Client
eleven_client = None
elevenlabs_available = False
try:
    if ELEVENLABS_AVAILABLE and ELEVENLABS_API_KEY and ELEVENLABS_API_KEY != "":
        eleven_client = ElevenLabs(api_key=ELEVENLABS_API_KEY)
        elevenlabs_available = True
        print("✅ ElevenLabs initialized successfully")
except Exception as e:
    print(f"⚠️ ElevenLabs Init Error: {e}")


class VoiceCopilot:
    def __init__(self):
        # Language detection patterns
        self.language_patterns = {
            'hi': re.compile(r'[\u0900-\u097F]'),  # Hindi/Devanagari
            'ta': re.compile(r'[\u0B80-\u0BFF]'),  # Tamil
            'te': re.compile(r'[\u0C00-\u0C7F]'),  # Telugu
            'mr': re.compile(r'[\u0900-\u097F]'),  # Marathi (Devanagari)
            'kn': re.compile(r'[\u0C80-\u0CFF]'),  # Kannada
            'ml': re.compile(r'[\u0D00-\u0D7F]'),  # Malayalam
            'gu': re.compile(r'[\u0A80-\u0AFF]'),  # Gujarati
            'bn': re.compile(r'[\u0980-\u09FF]'),  # Bengali
            'pa': re.compile(r'[\u0A00-\u0A7F]'),  # Punjabi
        }
        
        self.base_system_prompt = """You are 'Krishimitra AI' (कृषिमित्र एआई), a helpful farming assistant for Indian farmers.

CRITICAL RULES:
1. ALWAYS respond in {language} language. If the user writes in Hindi, respond in Hindi. If Tamil, respond in Tamil, etc.
2. Use simple, colloquial terms that a rural farmer can understand.
3. Keep responses concise (2-4 sentences for simple questions, detailed for complex ones).
4. For farming advice: mention crops, fertilizers, pest control, weather impacts, and market prices when relevant.
5. If symptoms are mentioned, ask for a photo to diagnose better.
6. ALWAYS provide both chemical and organic/natural alternatives for any treatment.
7. Be encouraging and supportive - farming is hard work!

LANGUAGE EXAMPLES:
- English: "For bacterial leaf blight, spray Streptocycline mixed with Copper oxychloride."
- Hindi: "बैक्टीरियल लीफ ब्लाइट के लिए, स्ट्रेप्टोसाइक्लिन और कॉपर ऑक्सीक्लोराइड का छिड़काव करें।"
- Tamil: "பாக்டீரியல் இலை வாட்டத்திற்கு, ஸ்ட்ரெப்டோசைக்ளின் மற்றும் காப்பர் ஆக்ஸிகுளோரைடு தெளிக்கவும்."

Remember: YOU ARE RESPONDING TO A FARMER. Be helpful, clear, and practical!"""

    def detect_language(self, text):
        """Auto-detect language from text using Unicode ranges."""
        if not text or text.strip() == "":
            return 'en'
        
        # Check for Indian language scripts
        for lang_code, pattern in self.language_patterns.items():
            if pattern.search(text):
                return lang_code
        
        # Default to English if no pattern matches
        return 'en'

    def get_text_response(self, user_text, language="auto"):
        """Get intelligent response from Gemini/Claude/OpenAI with proper language handling."""
        try:
            # Auto-detect language if not specified or set to 'auto'
            if language == "auto" or not language:
                language = self.detect_language(user_text)
            
            lang_name = self._get_language_name(language)
            system_prompt = self.base_system_prompt.format(language=lang_name)
            
            # Priority: Gemini (Free/Fast) -> Anthropic -> OpenAI -> Fallback
            if gemini_available and gemini_model:
                try:
                    full_prompt = f"{system_prompt}\n\nUser Question ({lang_name}): {user_text}\n\nYour Response ({lang_name}):"
                    response = gemini_model.generate_content(full_prompt)
                    
                    # Check if response is valid
                    if hasattr(response, 'text') and response.text:
                        return response.text
                    elif hasattr(response, 'parts'):
                        return ''.join([part.text for part in response.parts if hasattr(part, 'text')])
                    else:
                        raise Exception("No valid response from Gemini")
                        
                except Exception as e:
                    print(f"Gemini Error: {e}")
                    # Fall through to next option
            
            if anthropic_available and anthropic_client:
                try:
                    message = anthropic_client.messages.create(
                        model="claude-3-sonnet-20240229",
                        max_tokens=1024,
                        system=system_prompt,
                        messages=[
                            {"role": "user", "content": f"({lang_name}) {user_text}"}
                        ]
                    )
                    if hasattr(message.content[0], 'text'):
                        return message.content[0].text
                    return str(message.content[0])
                except Exception as e:
                    print(f"Anthropic Error: {e}")
                    # Fall through to next option
            
            if openai_available and openai_client:
                try:
                    response = openai_client.chat.completions.create(
                        model="gpt-3.5-turbo",
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_text}
                        ]
                    )
                    return response.choices[0].message.content
                except Exception as e:
                    print(f"OpenAI Error: {e}")
                    # Fall through to fallback
            
            # Fallback response
            return self._get_fallback_response(user_text, lang_name)

        except Exception as e:
            print(f"AI Error: {e}")
            return "क्षमा करें, मुझे तकनीकी समस्या हो रही है। कृपया पुनः प्रयास करें। / Sorry, I'm facing technical issues. Please try again."

    def _get_fallback_response(self, user_text, lang_name):
        """Provide intelligent fallback responses when no API is available."""
        text_lower = user_text.lower()
        
        # Simple keyword-based responses
        if any(word in text_lower for word in ['wheat', 'गेहूं', 'கோதுமை']):
            return {
                'English': "For wheat cultivation, use NPK fertilizer (12:32:16) at sowing. Water every 3-4 weeks. Harvest in 120-130 days.",
                'Hindi': "गेहूं की खेती के लिए बुवाई के समय एनपीके उर्वरक (12:32:16) डालें। हर 3-4 सप्ताह में सिंचाई करें। 120-130 दिनों में कटाई करें।",
                'Tamil': "கோதுமை சாகுபடிக்கு விதைக்கும் போது NPK உரம் (12:32:16) பயன்படுத்தவும். 3-4 வாரங்களுக்கு ஒருமுறை நீர் பாய்ச்சவும். 120-130 நாட்களில் அறுவடை செய்யவும்."
            }.get(lang_name, f"({lang_name}) API not configured. Please add Google/OpenAI API key to get personalized farming advice!")
        
        elif any(word in text_lower for word in ['rice', 'धान', 'நெல்']):
            return {
                'English': "Rice needs flooded fields. Use 120 kg Urea per hectare. Transplant seedlings at 20x15 cm spacing. Harvest in 90-120 days.",
                'Hindi': "धान के लिए खेत में पानी भरा रहना चाहिए। प्रति हेक्टेयर 120 किलो यूरिया डालें। पौधे 20x15 सेमी की दूरी पर लगाएं। 90-120 दिनों में कटाई करें।",
                'Tamil': "நெல்லுக்கு நீர் நிறைந்த வயல் தேவை. ஹெக்டருக்கு 120 கிலோ யூரியா பயன்படுத்தவும். நாற்றுகளை 20x15 செ.மீ இடைவெளியில் நடவும். 90-120 நாட்களில் அறுவடை செய்யவும்."
            }.get(lang_name, f"({lang_name}) API not configured. Please add Google/OpenAI API key to get personalized farming advice!")
        
        else:
            return {
                'English': "I need AI API keys to provide detailed farming advice. Please configure Google Gemini or OpenAI API in your .env file.",
                'Hindi': "विस्तृत खेती सलाह देने के लिए मुझे AI API चाबियाँ चाहिए। कृपया अपनी .env फ़ाइल में Google Gemini या OpenAI API कॉन्फ़िगर करें।",
                'Tamil': "விரிவான விவசாய ஆலோசனை வழங்க எனக்கு AI API விசைகள் தேவை. உங்கள் .env கோப்பில் Google Gemini அல்லது OpenAI API ஐ உள்ளமைக்கவும்."
            }.get(lang_name, f"API keys missing. Please add Google/OpenAI/Anthropic API key to .env file to enable AI responses.")

    def _get_language_name(self, code):
        """Convert language code to full name."""
        mapping = {
            'en': 'English', 
            'hi': 'Hindi', 
            'ta': 'Tamil', 
            'te': 'Telugu',
            'mr': 'Marathi', 
            'kn': 'Kannada', 
            'ml': 'Malayalam',
            'gu': 'Gujarati', 
            'bn': 'Bengali', 
            'pa': 'Punjabi',
            'auto': 'English'  # Default for auto-detection
        }
        return mapping.get(code, 'English')

    def speech_to_text(self, audio_bytes, language='auto'):
        """Convert multi-language audio to text using Whisper."""
        if not openai_available or not openai_client:
            print("⚠️ OpenAI Whisper not available for speech-to-text")
            return None
            
        try:
            audio_file = io.BytesIO(audio_bytes)
            audio_file.name = "recording.webm" 
            
            # Whisper auto-detects language, but we can hint it
            transcript = openai_client.audio.transcriptions.create(
                model="whisper-1", 
                file=audio_file,
                language=None if language == 'auto' else language  # Let Whisper auto-detect
            )
            
            detected_text = transcript.text
            print(f"📝 Transcribed: {detected_text}")
            return detected_text
            
        except Exception as e:
            print(f"STT Error: {e}")
            return None

    def text_to_speech(self, text, language='en'):
        """Convert text to speech using ElevenLabs with language support."""
        if not elevenlabs_available or not eleven_client:
            print("⚠️ ElevenLabs not available for text-to-speech")
            return None
            
        try:
            # Choose appropriate voice based on language
            voice_map = {
                'en': 'Rachel',
                'hi': 'Bella',  # ElevenLabs multilingual voices
                'ta': 'Bella',
                'te': 'Bella',
                # Add more as ElevenLabs supports
            }
            voice = voice_map.get(language, 'Rachel')
            
            audio_gen = eleven_client.generate(
                text=text,
                voice=voice, 
                model="eleven_multilingual_v2"
            )
            return b"".join(list(audio_gen))
            
        except Exception as e:
            print(f"TTS Error: {e}")
            return None

    def process_voice_query(self, audio_bytes, language='auto'):
        """Full pipeline: Voice -> Text -> AI Response -> Voice."""
        # Step 1: Convert speech to text
        user_text = self.speech_to_text(audio_bytes, language)
        if not user_text:
            return {
                "error": "Could not understand audio. Please speak clearly and try again.",
                "user_text": "", 
                "ai_text": ""
            }

        # Step 2: Detect language from transcribed text
        detected_lang = self.detect_language(user_text)
        print(f"🌍 Detected language: {self._get_language_name(detected_lang)}")

        # Step 3: Get AI response in same language
        ai_text = self.get_text_response(user_text, language=detected_lang)
        
        # Step 4: Convert response to speech
        ai_audio = self.text_to_speech(ai_text, language=detected_lang)

        return {
            "user_text": user_text,
            "ai_text": ai_text,
            "ai_audio": ai_audio,
            "language": detected_lang
        }


# Test function
if __name__ == "__main__":
    copilot = VoiceCopilot()
    
    print("\n" + "="*50)
    print("🧪 Testing VoiceCopilot")
    print("="*50)
    
    # Test English
    print("\n1️⃣ Testing English:")
    response = copilot.get_text_response("How do I grow wheat?", language="en")
    print(f"Response: {response}\n")
    
    # Test Hindi
    print("2️⃣ Testing Hindi:")
    response = copilot.get_text_response("गेहूं कैसे उगाएं?", language="auto")
    print(f"Response: {response}\n")
    
    # Test Tamil
    print("3️⃣ Testing Tamil:")
    response = copilot.get_text_response("கோதுமை எப்படி வளர்ப்பது?", language="auto")
    print(f"Response: {response}\n")
    
    print("="*50)
    print("✅ Testing Complete!")
    print(f"Gemini Available: {gemini_available}")
    print(f"OpenAI Available: {openai_available}")
    print(f"Anthropic Available: {anthropic_available}")
    print(f"ElevenLabs Available: {elevenlabs_available}")
    print("="*50)
