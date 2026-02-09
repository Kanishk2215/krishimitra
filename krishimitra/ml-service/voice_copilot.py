import os
import io
from dotenv import load_dotenv

load_dotenv()

# Check if APIs are available
HAS_OPENAI = os.getenv("OPENAI_API_KEY") is not None
HAS_ANTHROPIC = os.getenv("ANTHROPIC_API_KEY") is not None
HAS_ELEVENLABS = os.getenv("ELEVENLABS_API_KEY") is not None

# Only import if keys exist
if HAS_OPENAI:
    from openai import OpenAI
    openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

if HAS_ANTHROPIC:
    from anthropic import Anthropic
    anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

if HAS_ELEVENLABS:
    from elevenlabs.client import ElevenLabs
    eleven_client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

# Fallback chatbot
from chatbot import ChatAssistant
fallback_assistant = ChatAssistant()

class VoiceCopilot:
    def __init__(self):
        self.system_prompt = """
        You are 'Krishimitra AI', a helpful farming assistant for Indian farmers.
        
        Rules:
        1. Always respond in the SAME LANGUAGE the user speaks in (Hindi, Tamil, Telugu, Marathi, etc.).
        2. Speak in simple, colloquial terms that a farmer can understand.
        3. Keep responses concise and practical.
        4. Provide advice on crops, fertilizers, pest control, and weather.
        5. If a farmer mentions a symptom, ask for a photo.
        6. If you provide a chemical recommendation, always mention a natural/organic alternative too.
        """

    def speech_to_text(self, audio_bytes):
        """Convert multi-language audio to text using Whisper with auto-detection."""
        if not HAS_OPENAI:
            return None  # Browser will handle this
            
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

    def get_claude_response(self, user_text):
        """Get intelligent response from Claude or fallback to local chatbot."""
        if HAS_ANTHROPIC:
            try:
                message = anthropic_client.messages.create(
                    model="claude-3-sonnet-20240229",
                    max_tokens=1024,
                    system=self.system_prompt,
                    messages=[{"role": "user", "content": user_text}]
                )
                if hasattr(message.content[0], 'text'):
                    return message.content[0].text
                return str(message.content[0])
            except Exception as e:
                print(f"Claude Error: {e}")
        
        # Fallback to local RAG chatbot
        result = fallback_assistant.process_query(user_text)
        return result['response']

    def text_to_speech(self, text):
        """Convert text to voice using ElevenLabs or return None for browser TTS."""
        if not HAS_ELEVENLABS:
            return None  # Browser will handle this
            
        try:
            audio_gen = eleven_client.generate(
                text=text,
                voice="Rachel",
                model="eleven_multilingual_v2"
            )
            audio_bytes = b"".join(list(audio_gen))
            return audio_bytes
        except Exception as e:
            print(f"TTS Error: {e}")
            return None

    def process_voice_query(self, audio_bytes):
        """Full pipeline with graceful fallbacks."""
        # Try Whisper, else return error for browser to handle
        user_text = self.speech_to_text(audio_bytes)
        if not user_text:
            return {"error": "STT_UNAVAILABLE", "message": "Use browser speech recognition"}

        # Get AI response (Claude or local chatbot)
        ai_text = self.get_claude_response(user_text)

        # Try ElevenLabs, else return None for browser TTS
        ai_audio = self.text_to_speech(ai_text)

        return {
            "user_text": user_text,
            "ai_text": ai_text,
            "ai_audio": ai_audio,
            "use_browser_tts": ai_audio is None
        }
