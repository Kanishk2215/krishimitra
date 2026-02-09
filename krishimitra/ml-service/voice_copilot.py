import os
import io
from openai import OpenAI
from anthropic import Anthropic
from elevenlabs.client import ElevenLabs
from dotenv import load_dotenv

load_dotenv()

# Initialize Clients
# Note: User must provide these in Render Environment Variables
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
eleven_client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

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
        try:
            audio_file = io.BytesIO(audio_bytes)
            audio_file.name = "recording.webm" 
            
            transcript = openai_client.audio.transcriptions.create(
                model="whisper-1", 
                file=audio_file
                # No language hint = auto-detect
            )
            return transcript.text
        except Exception as e:
            print(f"STT Error: {e}")
            return None

    def get_claude_response(self, user_text):
        """Get intelligent Tamil response from Claude."""
        try:
            message = anthropic_client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=1024,
                system=self.system_prompt,
                messages=[
                    {"role": "user", "content": user_text}
                ]
            )
            # Handle the response content based on the SDK version
            if hasattr(message.content[0], 'text'):
                return message.content[0].text
            return str(message.content[0])
        except Exception as e:
            print(f"Claude Error: {e}")
            return "மன்னிக்கவும், என்னால் இப்போது பதிலளிக்க முடியவில்லை." # Tamil: Sorry, I can't respond now.

    def text_to_speech(self, text):
        """Convert text to Tamil voice using ElevenLabs."""
        try:
            # Using a friendly female voice for AI (e.g., 'Rachel' or custom Tamil voice)
            audio_gen = eleven_client.generate(
                text=text,
                voice="Rachel", # User can change this to a specific Tamil-tuned voice ID
                model="eleven_multilingual_v2"
            )
            
            # Combine chunks into bytes
            audio_bytes = b"".join(list(audio_gen))
            return audio_bytes
        except Exception as e:
            print(f"TTS Error: {e}")
            return None

    def process_voice_query(self, audio_bytes):
        """Full pipeline: Voice -> Text -> AI Response -> Voice."""
        # 1. Voice to Text (Tamil)
        user_text = self.speech_to_text(audio_bytes)
        if not user_text:
            return {"error": "Could not understand audio"}

        # 2. AI Logic (Tamil)
        ai_text = self.get_claude_response(user_text)

        # 3. Text to Voice (Tamil)
        ai_audio = self.text_to_speech(ai_text)

        return {
            "user_text": user_text,
            "ai_text": ai_text,
            "ai_audio": ai_audio # This will be sent as base64 or stored
        }
