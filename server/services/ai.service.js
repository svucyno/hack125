const axios = require('axios');

/**
 * AI Service for symptom analysis and healthcare guidance.
 * This service interfaces with the Gemini API (MOCKED for initial build).
 */
const analyzeSymptoms = async (symptoms) => {
    // Return early if no symptoms
    if (!symptoms) return { guidance: "Please enter your symptoms to receive guidance.", urgency: "routine" };

    try {
        /*
        // REAL API CALL (Requires GEMINI_API_KEY)
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{
                    parts: [{
                        text: `You are MEDI-CONNECT AI, a medical symptom analyzer. 
                        User Symptoms: ${symptoms}. 
                        Analyze urgency and provide general guidance. 
                        If symptoms include chest pain, severe bleeding, or loss of consciousness, return URGENCY: EMERGENCY.
                        Respond with a JSON object: { guidance: "text", urgency: "routine|urgent|emergency" }`
                    }]
                }]
            }
        );
        return JSON.parse(response.data.candidates[0].content.parts[0].text);
        */

        // MOCK LOGIC for demonstration
        const lowerSymptoms = symptoms.toLowerCase();
        
        let urgency = 'routine';
        let guidance = "Based on your symptoms, we recommend scheduling a routine appointment with a general practitioner.";

        if (lowerSymptoms.includes('chest pain') || lowerSymptoms.includes('breathing') || lowerSymptoms.includes('unconscious')) {
            urgency = 'emergency';
            guidance = "CRITICAL: Your symptoms suggest a potential emergency. Please click the SOS button immediately or call emergency services (911).";
        } else if (lowerSymptoms.includes('fever') || lowerSymptoms.includes('severe') || lowerSymptoms.includes('abdominal')) {
            urgency = 'urgent';
            guidance = "URGENT: Your symptoms should be evaluated soon. We recommend booking an urgent consultation today.";
        }

        return { guidance, urgency };
    } catch (error) {
        console.error('AI Service Error:', error.message);
        return { guidance: "Our AI service is temporarily unavailable. Please consult a doctor for advice.", urgency: "routine" };
    }
};

module.exports = { analyzeSymptoms };
