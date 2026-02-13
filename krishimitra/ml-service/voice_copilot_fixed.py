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
        
        # Fast Init: Optimistic startup without network check
        # We will handle errors gracefully when the user actually chats
        print("⚡ AI Service starting in FAST MODE...")
        gemini_model = genai.GenerativeModel('gemini-2.0-flash-exp')
        gemini_available = True
        print("✅ Gemini initialized (Runtime check enabled)")
            
except Exception as e:
    print(f"⚠️ Gemini Init Critical Error: {e}")
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
            
            # Fallback response (MOCK AI)
            return self._get_mock_response(user_text, lang_name)

        except Exception as e:
            print(f"AI Error: {e}")
            return self._get_mock_response(user_text, self._get_language_name(self.detect_language(user_text)))

    def _get_mock_response(self, user_text, lang_name):
        """Provide intelligent MOCK responses when AI is offline."""
        text_lower = user_text.lower()
        
        # Greetings
        if any(word in text_lower for word in ['hello', 'hi', 'hey', 'namaste', 'vanakkam', 'help']):
            return {
                'English': "Hello! I am Krishimitra (Offline Mode). I can help you with Wheat, Rice, Tomato, and Cotton farming. Ask me!",
                'Hindi': "नमस्ते! मैं कृषिमित्र (ऑफलाइन मोड) हूँ। मैं गेहूं, धान, टमाटर और कपास की खेती में मदद कर सकता हूँ। पूछिए!",
                'Tamil': "வணக்கம்! நான் உங்கள் விவசாய உதவியாளர் (இணையம் இல்லை). கோதுமை, நெல், தக்காளி மற்றும் பருத்தி விவசாயத்தில் உதவ முடியும்."
            }.get(lang_name, "Hello! I am ready to help.")

        # crop specific mocks
        if 'wheat' in text_lower or 'गेहूं' in text_lower or 'கோதுமை' in text_lower:
            return {
                'English': "🌾 **Wheat Farming Guide:**\n1. Sowing: Nov-Dec\n2. Soil: Loamy/Clay\n3. Fertilizer: NPK 12:32:16\n4. Irrigation: 5-6 times (every 20 days)\n5. Disease: Rust (Yellow/Brown) -> Spray Propiconazole.",
                'Hindi': "🌾 **गेहूं की खेती:**\n1. बुवाई: नवंबर-दिसंबर\n2. मिट्टी: दोमट\n3. खाद: NPK 12:32:16\n4. सिंचाई: 5-6 बार (हर 20 दिन)\n5. रोग: रतुआ -> प्रोपिकोनाज़ोल का छिड़काव करें।",
                'Tamil': "🌾 **கோதுமை சாகுபடி:**\n1. விதைப்பு: நவம்பர்-டிசம்பர்\n2. மண்: வண்டல் மண்\n3. உரம்: NPK 12:32:16\n4. நீர் பாசனம்: 5-6 முறை\n5. நோய்: துரு நோய் -> ப்ரோபிகோனசோல் தெளிக்கவும்."
            }.get(lang_name, "Wheat advice not available in this language.")

        if 'rice' in text_lower or 'paddy' in text_lower or 'धान' in text_lower or 'நெல்' in text_lower:
             return {
                'English': "🌾 **Rice/Paddy Guide:**\n1. Nursery: June-July\n2. Transplanting: After 21-25 days\n3. Fertilizer: Urea (Splits) + DAP\n4. Water: Maintain 2-5cm level\n5. Pest: Stem Borer -> Apply Cartap Hydrochloride.",
                'Hindi': "🌾 **धान की खेती:**\n1. नर्सरी: जून-जुलाई\n2. रोपाई: 21-25 दिन बाद\n3. खाद: यूरिया + डीएपी\n4. पानी: 2-5 सेमी स्तर बनाए रखें\n5. कीट: तना छेदक -> कार्टाप हाइड्रोक्लोराइड डालें।",
                'Tamil': "🌾 **நெல் சாகுபடி:**\n1. நாற்றங்கால்: ஜூன்-ஜூலை\n2. நடவு: 21-25 நாட்களுக்குப் பிறகு\n3. உரம்: யூரியா + DAP\n4. நீர்: 2-5 செ.மீ அளவு\n5. பூச்சி: தண்டு துளைப்பான் -> கார்டாப் பயன்படுத்தவும்."
            }.get(lang_name, "Rice advice not available.")

        if 'tomato' in text_lower or 'टमाटर' in text_lower or 'தக்காளி' in text_lower:
             return {
                'English': "🍅 **Tomato Farming:**\n1. Season: All year (avoid heavy rain)\n2. Spacing: 60x45 cm\n3. Staking: Required for hybrids\n4. Disease: Blight -> Spray Mancozeb\n5. Yield: 25-30 tons/acre.",
                'Hindi': "🍅 **टमाटर की खेती:**\n1. मौसम: साल भर\n2. दूरी: 60x45 सेमी\n3. सहारा: हाइब्रिड के लिए जरूरी\n4. रोग: झुलसा -> मैन्कोज़ेब का छिड़काव करें\n5. उपज: 25-30 टन/एकड़।",
                'Tamil': "🍅 **தக்காளி சாகுபடி:**\n1. பருவம்: வருடம் முழுவதும்\n2. இடைவெளி: 60x45 செ.மீ\n3. குச்சி ஊன்றுதல்: அவசியம்\n4. நோய்: இலை கருகல் -> மான்கோசெப் தெளிக்கவும்\n5. மகசூல்: 25-30 டன்கள்."
            }.get(lang_name, "Tomato advice not available.")

        if 'cotton' in text_lower or 'kapas' in text_lower or 'பருத்தி' in text_lower:
            return {
                'English': "☁️ **Cotton Farming:**\n1. Sowing: May-June\n2. Spacing: 90x60 cm\n3. Fertilizer: High Nitrogen required\n4. Pest: Bollworm is major threat -> Use IPM traps\n5. Harvest: Pick when bolls fully open.",
                'Hindi': "☁️ **कपास की खेती:**\n1. बुवाई: मई-जून\n2. दूरी: 90x60 सेमी\n3. खाद: अधिक नाइट्रोजन की आवश्यकता\n4. कीट: सुंडी का खतरा -> IPM ट्रैप का उपयोग करें\n5. कटाई: जब गूलर पूरी तरह खुल जाएं।",
                'Tamil': "☁️ **பருத்தி சாகுபடி:**\n1. விதைப்பு: மே-ஜூன்\n2. இடைவெளி: 90x60 செ.மீ\n3. உரம்: அதிக தழைச்சத்து தேவை\n4. பூச்சி: காய்ப்புழு தாக்குதல் அதிகம் -> விளக்கு பொறி வைக்கவும்."
            }.get(lang_name, "Cotton advice not available.")

        if 'sugarcane' in text_lower or 'ganne' in text_lower or 'கரும்பு' in text_lower:
             return {
                'English': "🎋 **Sugarcane Farming:**\n1. Planting: Jan-Mar\n2. Soil: Deep rich loamy\n3. Duration: 10-12 months\n4. Fertilizer: High Nitrogen + Zinc\n5. Yield: 100 tons/hectare.",
                'Hindi': "🎋 **गन्ने की खेती:**\n1. बुवाई: जनवरी-मार्च\n2. मिट्टी: दोमट\n3. अवधि: 10-12 महीने\n4. खाद: नाइट्रोजन + जिंक डालें\n5. उपज: 100 टन/हेक्टेयर।",
                'Tamil': "🎋 **கரும்பு சாகுபடி:**\n1. நடவு: ஜனவரி-மார்ச்\n2. மண்: வண்டல் மண்\n3. காலம்: 10-12 மாதங்கள்\n4. உரம்: தழைச்சத்து + ஜிங்க் அவசியம்\n5. மகசூல்: ஹெக்டேருக்கு 100 டன்கள்."
            }.get(lang_name, "Sugarcane advice available in Offline Mode.")

        if 'maize' in text_lower or 'corn' in text_lower or 'makkajolam' in text_lower:
             return {
                'English': "🌽 **Maize Farming:**\n1. Sowing: June-July\n2. Seed Rate: 20kg/hectare\n3. Water: Critical at flowering stage\n4. Pest: Fall Armyworm -> Spray Emamectin Benzoate.\n5. Harvest: When husk turns dry.",
                'Hindi': "🌽 **मक्का की खेती:**\n1. बुवाई: जून-जुलाई\n2. बीज दर: 20 किग्रा/हेक्टेयर\n3. पानी: फूल आते समय महत्वपूर्ण\n4. कीट: फॉल आर्मीवर्म -> एमामेक्टिन बेंजोएट का छिड़काव करें।",
                'Tamil': "🌽 **மக்காச்சோளம்:**\n1. விதைப்பு: ஜூன்-ஜூலை\n2. விதை அளவு: 20 கிகி/ஹெக்டேர்\n3. நீர்: பூக்கும் தருணத்தில் அவசியம்\n4. பூச்சி: படைப்புழு -> எமாமெக்டின் பென்சோயேட் தெளிக்கவும்."
            }.get(lang_name, "Maize advice available.")

        if 'potato' in text_lower or 'aloo' in text_lower or 'urulai' in text_lower:
             return {
                'English': "🥔 **Potato Farming:**\n1. Planting: Oct-Nov\n2. Soil: Sandy Loam\n3. Earthing up: Essential after 30 days\n4. Disease: Late Blight is common -> Use Mancozeb.\n5. Yield: 20-30 tons/hectare.",
                'Hindi': "🥔 **आलू की खेती:**\n1. बुवाई: अक्टूबर-नवंबर\n2. मिट्टी: बलुई दोमट\n3. मिट्टी चढ़ाना: 30 दिन बाद जरूरी\n4. रोग: झुलसा रोग -> मैन्कोज़ेब का प्रयोग करें।",
                'Tamil': "🥔 **உருளைக்கிழங்கு:**\n1. நடவு: அக்டோபர்-நவம்பர்\n2. மண்: மணல் கலந்த வண்டல்\n3. மண் அணைத்தல்: 30 நாட்களுக்குப் பிறகு அவசியம்\n4. நோய்: இலை கருகல் -> மான்கோசெப் பயன்படுத்தவும்."
            }.get(lang_name, "Potato advice available.")

        if 'onion' in text_lower or 'pyaz' in text_lower or 'vengayam' in text_lower:
             return {
                'English': "🧅 **Onion Farming:**\n1. Nursery: Oct-Nov\n2. Transplanting: Dec-Jan\n3. Irrigation: Frequent light irrigation\n4. Harvest: When 50% tops fall over.\n5. Storage: Well ventilated room.",
                'Hindi': "🧅 **प्याज की खेती:**\n1. नर्सरी: अक्टूबर-नवंबर\n2. रोपाई: दिसंबर-जनवरी\n3. सिंचाई: हल्की और बार-बार\n4. कटाई: जब 50% पौधे गिर जाएं।\n5. भंडारण: हवादार कमरे में।",
                'Tamil': "🧅 **வெங்காயம்:**\n1. நாற்றங்கால்: அக்டோபர்-நவம்பர்\n2. நடவு: டிசம்பர்-ஜனவரி\n3. நீர்: அடிக்கடி லேசான பாசனம்\n4. அறுவடை: 50% தாள்கள் சாய்ந்தவுடன்.\n5. சேமிப்பு: காற்றோட்டமான அறை."
            }.get(lang_name, "Onion advice available.")

        # Default fallback
        return {
            'English': "I am in Offline Mode. I can answer about Wheat, Rice, Tomato, Cotton, Sugarcane, Maize, Potato, and Onion. Usage limit exceeded for other queries.",
            'Hindi': "मैं ऑफलाइन मोड में हूँ। मैं अभी केवल गेहूं, धान, टमाटर और कपास के बारे में बता सकता हूँ। पूरी सुविधाओं के लिए कृपया इंटरनेट/API कुंजी जांचें।",
            'Tamil': "நான் ஆஃப்லைன் பயன்முறையில் உள்ளேன். கோதுமை, நெல், தக்காளி பற்றி மட்டுமே பதிலளிக்க முடியும். முழு வசதிகளுக்கு இணையத்தை சரிபார்க்கவும்."
        }.get(lang_name, "Offline Mode: Limited functionality.")

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
