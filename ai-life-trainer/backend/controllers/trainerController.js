const db = require('../config/db');
const axios = require('axios');
require('dotenv').config();

const GPT_API_KEY = process.env.GPT_API_KEY;
const GPT_API_URL = 'https://api.openai.com/v1/chat/completions';

// Custom error classes
class RateLimitError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RateLimitError';
  }
}

class OpenAIError extends Error {
  constructor(message) {
    super(message);
    this.name = 'OpenAIError';
  }
}

class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DatabaseError';
  }
}

// Simple rate limiting
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20; // Adjust this based on your API plan
let requestTimestamps = [];

const isRateLimited = () => {
  const now = Date.now();
  requestTimestamps = requestTimestamps.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
  if (requestTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  requestTimestamps.push(now);
  return false;
};

// Fetch user data for the current day
const fetchUserData = async () => {
  const today = new Date().toISOString().split('T')[0];
  const query = `
    SELECT 
      (SELECT json_agg(row_to_json(n)) FROM (SELECT * FROM nutrition WHERE date = $1) n) as nutrition,
      (SELECT json_agg(row_to_json(e)) FROM (SELECT * FROM exercise WHERE date = $1) e) as exercise,
      (SELECT json_agg(row_to_json(s)) FROM (SELECT * FROM sleep WHERE date = $1) s) as sleep,
      (SELECT json_agg(row_to_json(c)) FROM (
        SELECT date, total_calories 
        FROM calorie_trends 
        WHERE date >= $1 - INTERVAL '7 days' 
        ORDER BY date DESC
      ) c) as calorie_trends
    FROM dual
  `;

  try {
    const result = await db.query(query, [today]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new DatabaseError('Failed to fetch user data from the database.');
  }
};

// Generate AI response based on user message and data
const generateResponse = async (message) => {
  try {
    if (isRateLimited()) {
      throw new RateLimitError('Rate limit exceeded. Please try again in a few minutes.');
    }

    // Store the chat message
    await saveChat('user', message);

    // Fetch user data
    const userData = await fetchUserData();

    // Prepare the prompt for GPT
    const prompt = `
As an AI fitness trainer, provide a helpful response to the following user message: "${message}"

Here's the user's data for today:
Nutrition: ${JSON.stringify(userData.nutrition)}
Exercise: ${JSON.stringify(userData.exercise)}
Sleep: ${JSON.stringify(userData.sleep)}
Calorie trends (last 7 days): ${JSON.stringify(userData.calorie_trends)}

Based on this data and the user's message, provide a personalized response.
    `;

    // Make a request to the GPT API
    const response = await axios.post(
      GPT_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a knowledgeable and supportive AI fitness trainer.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${GPT_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiResponse = response.data.choices[0].message.content.trim();

    // Store the AI response
    await saveChat('ai', aiResponse);

    return {
      message: aiResponse,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating response:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    console.error('GPT API Key:', GPT_API_KEY ? 'Present' : 'Missing');
    
    if (error instanceof RateLimitError) {
      throw error;
    } else if (error instanceof DatabaseError) {
      throw error;
    } else if (error.response && error.response.status === 429) {
      throw new OpenAIError('OpenAI API rate limit exceeded. Please try again later.');
    } else if (error.response && error.response.status === 401) {
      throw new OpenAIError('Authentication error with OpenAI API. Please check your API key.');
    } else if (error.code === 'ECONNREFUSED') {
      throw new OpenAIError('Unable to connect to OpenAI API. Please check your internet connection.');
    } else {
      throw new OpenAIError('An unexpected error occurred while generating the AI response. Please try again later.');
    }
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
    throw new DatabaseError('Failed to save chat message to the database.');
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
    throw new DatabaseError('Failed to fetch chat history from the database.');
  }
};

module.exports = {
  generateResponse,
  getChatHistory,
  RateLimitError,
  OpenAIError,
  DatabaseError
};
