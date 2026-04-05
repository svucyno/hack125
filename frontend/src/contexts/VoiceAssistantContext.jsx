import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VoiceAssistantContext = createContext();

export const VoiceAssistantProvider = ({ children }) => {
  const navigate = useNavigate();
  const [lang, setLang] = useState('en-US');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = React.useRef(null);

  const languages = {
    'en-US': { name: 'English', welcome: 'How can I help you today?', login: 'Opening login portal.', register: 'Opening registration.', sos: 'Emergency alert activated.' },
    'hi-IN': { name: 'हिंदी', welcome: 'मैं आज आपकी कैसे मदद कर सकता हूँ?', login: 'लॉगिन पोर्टल खुल रहा है।', register: 'पंजीकरण खुल रहा है।', sos: 'आपातकालीन अलर्ट सक्रिय।' },
    'te-IN': { name: 'తెలుగు', welcome: 'నేను మీకు ఎలా సహాయం చేయగలను?', login: 'లాగిన్ పోర్టల్ ఓపెన్ అవుతోంది.', register: 'రిజిస్ట్రేషన్ ఓపెన్ అవుతోంది.', sos: 'అత్యవసర హెచ్చరిక సక్రియం చేయబడింది.' },
    'ta-IN': { name: 'தமிழ்', welcome: 'நான் உங்களுக்கு எப்படி உதவ முடியும்?', login: 'உள்நுழைவு போர்டல் திறக்கப்படுகிறது.', register: 'பதிவு திறக்கப்படுகிறது.', sos: 'அவசரகால எச்சரிக்கை செயல்படுத்தப்பட்டது.' },
    'kn-IN': { name: 'ಕನ್ನಡ', welcome: 'ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?', login: 'ಲಾಗಿನ್ ಪೋರ್ಟಲ್ ತೆರೆಯುತ್ತಿದೆ.', register: 'ನೋಂದಣಿ ತೆರೆಯುತ್ತಿದೆ.', sos: 'ತುರ್ತು ಎಚ್ಚರಿಕೆ ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ.' }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event) => {
        const result = event.results[event.resultIndex][0].transcript;
        setTranscript(result);
        processCommand(result);
      };
      
      recognitionRef.current = recognition;
    }
  }, [lang]);

  const processCommand = (text) => {
    const t = text.toLowerCase();
    // Voice Navigation
    if (t.includes('login') || t.includes('लॉगिन') || t.includes('లాగిన్') || t.includes('உள்நுழைவு')) {
        speak(languages[lang].login);
        setTimeout(() => navigate('/login'), 500);
    } else if (t.includes('register') || t.includes('पंजीकरण') || t.includes('రిజిస్ట్రేషన్') || t.includes('பதிவு')) {
        speak(languages[lang].register);
        setTimeout(() => navigate('/register'), 500);
    } else if (t.includes('emergency') || t.includes('sos') || t.includes('आपातकालीन')) {
        speak(languages[lang].sos);
        window.dispatchEvent(new CustomEvent('voice_sos'));
    } else {
        processSymptoms(text);
    }
  };

  const processSymptoms = async (text) => {
    let responseText = languages[lang].welcome;
    const lowerText = text.toLowerCase();
    if (lowerText.includes('chest pain') || lowerText.includes('heart') || lowerText.includes('దగ్గు') || lowerText.includes('నొప్పి')) {
        responseText = languages[lang].sos;
    }
    setAiResponse(responseText);
    speak(responseText);
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.pitch = 1.1;
      utterance.rate = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <VoiceAssistantContext.Provider value={{ 
      lang, setLang, languages,
      isListening, transcript, aiResponse, isSpeaking, 
      startListening: () => {
        try { recognitionRef.current?.start(); } catch(e) {}
      },
      stopListening: () => {
        try { recognitionRef.current?.stop(); } catch(e) {}
      },
      speak 
    }}>
      {children}
    </VoiceAssistantContext.Provider>
  );
};

export const useVoiceAssistant = () => useContext(VoiceAssistantContext);
