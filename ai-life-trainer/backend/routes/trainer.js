const express = require('express');
const router = express.Router();
const { generateResponse, getChatHistory, RateLimitError, OpenAIError, DatabaseError } = require('../controllers/trainerController');

// Get chat history
router.get('/chat', async (req, res, next) => {
  try {
    const history = await getChatHistory();
    res.json(history);
  } catch (error) {
    console.error('Error in GET /chat:', error);
    if (error instanceof DatabaseError) {
      res.status(500).json({ error: 'Failed to fetch chat history. Please try again later.' });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    }
  }
});

// Generate AI trainer response
router.post('/chat', async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await generateResponse(message);
    res.json(response);
  } catch (error) {
    console.error('Error in POST /chat:', error);
    if (error instanceof RateLimitError) {
      res.status(429).json({ error: error.message });
    } else if (error instanceof OpenAIError) {
      res.status(503).json({ error: error.message });
    } else if (error instanceof DatabaseError) {
      res.status(500).json({ error: 'Failed to save chat message. Please try again later.' });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    }
  }
});

module.exports = router;
