const express = require('express');
const router = express.Router();
const { generateResponse, getChatHistory } = require('../controllers/trainerController');

// Get chat history
router.get('/chat', async (req, res, next) => {
  try {
    const history = await getChatHistory();
    res.json(history);
  } catch (error) {
    next(error);
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
    next(error);
  }
});

module.exports = router;
