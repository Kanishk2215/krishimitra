import os
import io
import google.generativeai as genai
from openai import OpenAI
from anthropic import Anthropic

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

from dotenv import load_dotenv

load_dotenv()

# Initialize Clients
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY")) if os.getenv("OPENAI_API_KEY") else None
anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY")) if os.getenv("ANTHROPIC_API_KEY") else None
eleven_client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY")) if (ELEVENLABS_AVAILABLE and os.getenv("ELEVENLABS_API_KEY")) else None

# Initialize Gemini
if os.getenv("GOOGLE_API_KEY"):
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    gemini_model = genai.GenerativeModel('gemini-pro')
else:
    gemini_model = None

class VoiceCopilot:
    def __init__(self):
        self.base_system_prompt = """
        You are 'Krishimitra AI', a helpful farming assistant for Indian farmers.
        
        Rules:
        1. You MUST respond in the target language: {language}.
        2. Speak in simple, colloquial terms that a farmer can understand.
        3. Keep responses concise and practical.
        4. Provide advice on crops, fertilizers, pest control, and weather.
        5. If a farmer mentions a symptom, ask for a photo.
        6. If you provide a chemical recommendation, always mention a natural/organic alternative too.
        """

    def get_text_response(self, user_text, language="English"):
        """Get intelligent response from Gemini/Claude/OpenAI."""
        try:
            # Format prompt with language
            lang_name = self._get_language_name(language)
            system_prompt = self.base_system_prompt.format(language=lang_name)
            
            # Prioritize: Gemini (Free/Fast) -> Claude -> OpenAI -> Fallback
            if gemini_model:
                full_prompt = f"{system_prompt}\n\nUser Question: {user_text}"
                response = gemini_model.generate_content(full_prompt)
                return response.text
            
            elif anthropic_client:
                message = anthropic_client.messages.create(
                    model="claude-3-sonnet-20240229",
                    max_tokens=1024,
                    system=system_prompt,
                    messages=[
                        {"role": "user", "content": user_text}
                    ]
                )
                if hasattr(message.content[0], 'text'):
                    return message.content[0].text
                return str(message.content[0])
            
            elif openai_client:
                response = openai_client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_text}
                    ]
                )
                return response.choices[0].message.content
                
            else:
                return f"({lang_name}) API Keys missing (Google/OpenAI/Anthropic). Please add one to .env to enable AI."

        except Exception as e:
            print(f"AI Error: {e}")
            return "Sorry, I am facing technical issues. Please try again."

    def _get_language_name(self, code):
        mapping = {
            'en': 'English', 'hi': 'Hindi', 'ta': 'Tamil', 'te': 'Telugu',
            'mr': 'Marathi', 'kn': 'Kannada', 'ml': 'Malayalam',
            'gu': 'Gujarati', 'bn': 'Bengali', 'pa': 'Punjabi'
        }
        return mapping.get(code, code)

    def speech_to_text(self, audio_bytes):
        """Convert multi-language audio to text using Whisper or Google STT (future)."""
        if not openai_client:
            # TODO: Add Google STT fallback here if needed
            return None
            
        try:
            audio_file = io.BytesIO(audio_bytes)
            audio_file.name = "recording.webm" 
            
            transcript = openai_client.audio.transcriptions.create(
                model="whisper-1", 
                file=audio_file
            )
            return transcript.text
        except Exception as e:
            print(f"STT Error: {e}")
            return None

    def text_to_speech(self, text):
        """Convert text to Tamil voice using ElevenLabs."""
        if not ELEVENLABS_AVAILABLE or not eleven_client:
            return None
            
        try:
            audio_gen = eleven_client.generate(
                text=text,
                voice="Rachel", 
                model="eleven_multilingual_v2"
            )
            return b"".join(list(audio_gen))
        except Exception as e:
            print(f"TTS Error: {e}")
            return None

    def process_voice_query(self, audio_bytes):
        """Full pipeline: Voice -> Text -> AI Response -> Voice."""
        user_text = self.speech_to_text(audio_bytes)
        if not user_text:
            return {"error": "Could not understand audio", "user_text": "", "ai_text": ""}

        ai_text = self.get_text_response(user_text, language="User's Language")
        ai_audio = self.text_to_speech(ai_text)

        return {
            "user_text": user_text,
            "ai_text": ai_text,
            "ai_audio": ai_audio 
        }
