const db = require('../config/db');

// Mock AI responses based on keywords
const mockAIResponses = {
  exercise: [
    "Remember to warm up properly before intense workouts!",
    "Great job on staying consistent with your exercise routine!",
    "Try incorporating more compound exercises for better results.",
    "Don't forget to take rest days to allow your body to recover.",
  ],
  nutrition: [
    "Make sure you're getting enough protein in your diet!",
    "Stay hydrated! Aim for at least 8 glasses of water daily.",
    "Consider adding more colorful vegetables to your meals.",
    "Remember to eat within 30 minutes after your workout.",
  ],
  sleep: [
    "Aim for 7-9 hours of quality sleep each night.",
    "Create a consistent sleep schedule, even on weekends.",
    "Avoid screens at least an hour before bedtime.",
    "Make sure your bedroom is cool and dark for optimal sleep.",
  ],
  default: [
    "Keep pushing towards your fitness goals!",
    "Small progress is still progress.",
    "Consistency is key to achieving your goals.",
    "Remember, every expert was once a beginner.",
  ]
};

// Generate AI response based on user message
const generateResponse = async (message) => {
  try {
    // Convert message to lowercase for easier matching
    const lowerMessage = message.toLowerCase();
    
    // Store the chat message
    await saveChat('user', message);

    // Determine response category based on keywords
    let response;
    if (lowerMessage.includes('exercise') || lowerMessage.includes('workout') || lowerMessage.includes('training')) {
      response = mockAIResponses.exercise[Math.floor(Math.random() * mockAIResponses.exercise.length)];
    } else if (lowerMessage.includes('nutrition') || lowerMessage.includes('food') || lowerMessage.includes('diet')) {
      response = mockAIResponses.nutrition[Math.floor(Math.random() * mockAIResponses.nutrition.length)];
    } else if (lowerMessage.includes('sleep') || lowerMessage.includes('rest') || lowerMessage.includes('recovery')) {
      response = mockAIResponses.sleep[Math.floor(Math.random() * mockAIResponses.sleep.length)];
    } else {
      response = mockAIResponses.default[Math.floor(Math.random() * mockAIResponses.default.length)];
    }

    // Store the AI response
    await saveChat('ai', response);

    return {
      message: response,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating response:', error);
    const dbError = new Error('Failed to process chat message');
    dbError.name = 'DatabaseError';
    throw dbError;
  }
};

// Save chat message to database
const saveChat = async (sender, message) => {
  const query = `
    INSERT INTO chat_history (sender, message, timestamp)
    VALUES ($1, $2, NOW())
  `;

  try {
    await db.query(query, [sender, message]);
  } catch (error) {
    console.error('Error saving chat:', error);
    throw error;
  }
};

// Get chat history
const getChatHistory = async () => {
  const query = `
    SELECT * FROM chat_history
    ORDER BY timestamp ASC
  `;

  try {
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    const dbError = new Error('Failed to fetch chat history');
    dbError.name = 'DatabaseError';
    throw dbError;
  }
};

module.exports = {
  generateResponse,
  getChatHistory
};
