const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route with API documentation
app.get('/', (req, res) => {
  res.json({
    status: 'AI Life Trainer API is running',
    endpoints: {
      punch: {
        base: '/api/punch',
        routes: {
          'POST /api/punch/exercise': 'Log exercise activity',
          'POST /api/punch/sleep': 'Log sleep activity',
          'POST /api/punch/nutrition': 'Log nutrition activity',
          'GET /api/punch/history': 'Get all activity history'
        }
      },
      trainer: {
        base: '/api/trainer',
        routes: {
          'POST /api/trainer/chat': 'Chat with AI trainer',
          'GET /api/trainer/chat': 'Get chat history'
        }
      }
    }
  });
});

// Import routes
const punchRoutes = require('./routes/punch');
const trainerRoutes = require('./routes/trainer');

// Use routes
app.use('/api/punch', punchRoutes);
app.use('/api/trainer', trainerRoutes);

// Error handling middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Get port from environment variables
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
