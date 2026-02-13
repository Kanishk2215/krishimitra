
/**
 * KrishiMitra Frontend - Integration Example
 * How to connect your React/Vue/HTML frontend to the fixed backend
 */

// ============================================
// 1. TEXT CHAT WITH AUTO LANGUAGE DETECTION
// ============================================

async function sendTextMessage(userMessage) {
    try {
        const response = await fetch('http://localhost:5001/chat/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: userMessage,
                language: 'auto',  // Let backend auto-detect
                user_id: 'user123'
            })
        });

        const data = await response.json();

        if (data.success) {
            console.log('Bot response:', data.data.response);
            console.log('Detected language:', data.data.language);
            return data.data;
        } else {
            console.error('Chat error:', data.error);
            return { response: 'Sorry, something went wrong.' };
        }
    } catch (error) {
        console.error('Network error:', error);
        return { response: 'Unable to connect to server.' };
    }
}

// Usage examples:
// sendTextMessage("How to grow wheat?");  // English
// sendTextMessage("गेहूं कैसे उगाएं?");     // Hindi - auto-detected
// sendTextMessage("கோதுமை எப்படி வளர்ப்பது?");  // Tamil - auto-detected


// ============================================
// 2. VOICE INPUT WITH TRANSCRIPTION
// ============================================

let mediaRecorder;
let audioChunks = [];

// Start recording
async function startVoiceRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            await sendVoiceMessage(audioBlob);
        };

        mediaRecorder.start();
        console.log('🎤 Recording started...');

    } catch (error) {
        console.error('Microphone error:', error);
        alert('Please allow microphone access to use voice input.');
    }
}

// Stop recording
function stopVoiceRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        console.log('🛑 Recording stopped');
    }
}

// Send voice to backend
async function sendVoiceMessage(audioBlob) {
    try {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        formData.append('language', 'auto');  // Auto-detect language

        const response = await fetch('http://localhost:5001/voice/chat', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            console.log('You said:', data.user_text);
            console.log('Bot replied:', data.ai_text);
            console.log('Language:', data.language);

            // Display transcription
            displayMessage('user', data.user_text);
            displayMessage('bot', data.ai_text);

            // Play audio response if available
            if (data.audio_b64) {
                playAudioResponse(data.audio_b64);
            } else {
                // Fallback: Use browser's speech synthesis
                speakText(data.ai_text, data.language);
            }
        } else {
            console.error('Voice error:', data.error);
            alert(data.hint || data.error);
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('Unable to process voice input. Please try again.');
    }
}


// ============================================
// 3. PLAY AUDIO RESPONSE
// ============================================

function playAudioResponse(base64Audio) {
    try {
        // Convert base64 to audio blob
        const audioData = atob(base64Audio);
        const audioArray = new Uint8Array(audioData.length);
        for (let i = 0; i < audioData.length; i++) {
            audioArray[i] = audioData.charCodeAt(i);
        }
        const audioBlob = new Blob([audioArray], { type: 'audio/mpeg' });

        // Play audio
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();

        console.log('🔊 Playing audio response...');
    } catch (error) {
        console.error('Audio playback error:', error);
    }
}


// ============================================
// 4. FALLBACK: BROWSER TEXT-TO-SPEECH
// ============================================

function speakText(text, language = 'en') {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);

        // Map language codes to browser voices
        const voiceMap = {
            'en': 'en-US',
            'hi': 'hi-IN',
            'ta': 'ta-IN',
            'te': 'te-IN',
            'mr': 'mr-IN',
            'kn': 'kn-IN',
            'ml': 'ml-IN',
            'gu': 'gu-IN',
            'bn': 'bn-IN',
            'pa': 'pa-IN'
        };

        utterance.lang = voiceMap[language] || 'en-US';
        utterance.rate = 0.9;  // Slightly slower for clarity

        window.speechSynthesis.speak(utterance);
        console.log('🔊 Speaking (browser TTS):', language);
    }
}


// ============================================
// 5. DISPLAY MESSAGES IN UI
// ============================================

function displayMessage(sender, text) {
    const chatContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const avatar = sender === 'user' ? '👤' : '🤖';
    messageDiv.innerHTML = `
        <span class="avatar">${avatar}</span>
        <div class="message-text">${text}</div>
    `;

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}


// ============================================
// 6. DISEASE ANALYSIS WITH IMAGE UPLOAD
// ============================================

async function analyzePlantDisease(imageFile, soilType = 'Black', weather = 'Sunny') {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('soil_type', soilType);
        formData.append('weather', weather);

        const response = await fetch('http://localhost:5001/analyze-disease', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            console.log('Disease detected:', data.disease);
            console.log('Confidence:', data.confidence);
            console.log('Severity:', data.severity);
            console.log('Smart Advisory:', data.smart_advisory);

            // Display results in UI
            displayDiseaseResults(data);
            return data;
        } else {
            console.error('Analysis error:', data.error);
            return null;
        }
    } catch (error) {
        console.error('Network error:', error);
        return null;
    }
}


// ============================================
// 7. COMPLETE EXAMPLE - REACT COMPONENT
// ============================================

/**
 * React Example Component
 */
/*
import React, { useState } from 'react';

function KrishiMitraChat() {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isRecording, setIsRecording] = useState(false);

    const sendMessage = async () => {
        if (!inputText.trim()) return;

        // Add user message to chat
        setMessages(prev => [...prev, { sender: 'user', text: inputText }]);

        // Send to backend
        const response = await sendTextMessage(inputText);
        
        // Add bot response to chat
        setMessages(prev => [...prev, { 
            sender: 'bot', 
            text: response.response,
            language: response.language 
        }]);

        setInputText('');
    };

    const toggleVoiceRecording = () => {
        if (isRecording) {
            stopVoiceRecording();
        } else {
            startVoiceRecording();
        }
        setIsRecording(!isRecording);
    };

    return (
        <div className="chat-container">
            <div className="messages">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.sender}`}>
                        <span>{msg.sender === 'user' ? '👤' : '🤖'}</span>
                        <p>{msg.text}</p>
                    </div>
                ))}
            </div>
            
            <div className="input-area">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your question... (any language)"
                />
                <button onClick={sendMessage}>Send</button>
                <button 
                    onClick={toggleVoiceRecording}
                    className={isRecording ? 'recording' : ''}
                >
                    {isRecording ? '🔴 Stop' : '🎤 Voice'}
                </button>
            </div>
        </div>
    );
}

export default KrishiMitraChat;
*/


// ============================================
// 8. HTML EXAMPLE - SIMPLE CHAT UI
// ============================================

/*
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KrishiMitra Chat</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
        }
        #chat-messages {
            height: 400px;
            overflow-y: auto;
            border: 1px solid #ccc;
            padding: 10px;
            margin-bottom: 20px;
            background: #f9f9f9;
        }
        .message {
            margin: 10px 0;
            padding: 10px;
            border-radius: 5px;
        }
        .user-message {
            background: #007bff;
            color: white;
            margin-left: 20%;
        }
        .bot-message {
            background: #28a745;
            color: white;
            margin-right: 20%;
        }
        #input-area {
            display: flex;
            gap: 10px;
        }
        input {
            flex: 1;
            padding: 10px;
            font-size: 16px;
        }
        button {
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
        }
        .recording {
            background: red;
            color: white;
        }
    </style>
</head>
<body>
    <h1>🌾 KrishiMitra AI Assistant</h1>
    <div id="chat-messages"></div>
    <div id="input-area">
        <input type="text" id="user-input" placeholder="Ask me anything... (Hindi/Tamil/English)">
        <button onclick="sendMessage()">Send</button>
        <button id="voice-btn" onclick="toggleVoice()">🎤 Voice</button>
    </div>

    <script src="frontend-integration.js"></script>
    <script>
        // Simple wrapper functions
        async function sendMessage() {
            const input = document.getElementById('user-input');
            const text = input.value.trim();
            if (!text) return;

            displayMessage('user', text);
            input.value = '';

            const response = await sendTextMessage(text);
            displayMessage('bot', response.response);
        }

        let recording = false;
        function toggleVoice() {
            const btn = document.getElementById('voice-btn');
            if (recording) {
                stopVoiceRecording();
                btn.textContent = '🎤 Voice';
                btn.classList.remove('recording');
            } else {
                startVoiceRecording();
                btn.textContent = '🔴 Stop';
                btn.classList.add('recording');
            }
            recording = !recording;
        }

        // Press Enter to send
        document.getElementById('user-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    </script>
</body>
</html>
*/


// ============================================
// 9. ERROR HANDLING EXAMPLE
// ============================================

async function sendMessageWithRetry(text, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await sendTextMessage(text);
            return response;
        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error);

            if (attempt === maxRetries) {
                alert('Unable to connect to server. Please check your internet connection.');
                return { response: 'Service temporarily unavailable. Please try again.' };
            }

            // Wait before retry (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        }
    }
}


// ============================================
// 10. TESTING UTILITIES
// ============================================

// Test backend connection
async function testBackendConnection() {
    try {
        const response = await fetch('http://localhost:5001/health');
        const data = await response.json();
        console.log('✅ Backend:', data.status);
        return true;
    } catch (error) {
        console.error('❌ Backend offline:', error);
        return false;
    }
}

// Test all languages
async function testAllLanguages() {
    const tests = [
        { lang: 'English', text: 'How to grow wheat?' },
        { lang: 'Hindi', text: 'गेहूं कैसे उगाएं?' },
        { lang: 'Tamil', text: 'கோதுமை எப்படி வளர்ப்பது?' },
        { lang: 'Telugu', text: 'గోధుమలు ఎలా పెంచాలి?' }
    ];

    console.log('🧪 Testing multilingual support...\n');

    for (const test of tests) {
        console.log(`Testing ${test.lang}:`);
        const response = await sendTextMessage(test.text);
        console.log(`  Input: ${test.text}`);
        console.log(`  Output: ${response.response.substring(0, 100)}...`);
        console.log(`  Detected: ${response.language}\n`);
    }
}

// Run tests on page load
window.addEventListener('load', async () => {
    const backendOk = await testBackendConnection();
    if (!backendOk) {
        alert('Backend server is not running. Please start it with: python backend_fixed.py');
    }
});


// ============================================
// EXPORT FOR MODULE USE
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sendTextMessage,
        startVoiceRecording,
        stopVoiceRecording,
        sendVoiceMessage,
        analyzePlantDisease,
        testBackendConnection,
        testAllLanguages
    };
}
