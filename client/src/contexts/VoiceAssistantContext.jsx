import React, { createContext, useContext, useState, useEffect } from 'react';

const VoiceAssistantContext = createContext();

export const VoiceAssistantProvider = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Initialize Speech Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const result = event.results[current][0].transcript;
      setTranscript(result);
      processSymptoms(result);
    };
  }

  const startListening = () => {
    if (recognition) {
      setTranscript('');
      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const stopListening = () => {
    if (recognition) recognition.stop();
  };

  const processSymptoms = async (text) => {
    // Mocking AI response logic for symptom guidance
    let responseText = "I've noted your symptoms. Based on what you said, I recommend booking a consultation with a specialist. Would you like me to find a doctor for you?";
    
    if (text.toLowerCase().includes('chest pain') || text.toLowerCase().includes('heart')) {
        responseText = "WARNING: Chest pain can be serious. I have activated the emergency SOS alert for you. Please stay calm while I notify nearby medical staff.";
    }
    
    setAiResponse(responseText);
    speak(responseText);
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1.0;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <VoiceAssistantContext.Provider value={{ 
      isListening, 
      transcript, 
      aiResponse, 
      isSpeaking, 
      startListening, 
      stopListening,
      speak 
    }}>
      {children}
    </VoiceAssistantContext.Provider>
  );
};

export const useVoiceAssistant = () => useContext(VoiceAssistantContext);
