const express = require('express');
const router = express.Router();
const {
  createExercisePunch,
  createSleepPunch,
  createNutritionPunch,
  getPunchHistory
} = require('../controllers/punchController');

// POST routes for creating new punches
router.post('/exercise', createExercisePunch);
router.post('/sleep', createSleepPunch);
router.post('/nutrition', createNutritionPunch);

// GET route for fetching punch history
router.get('/history', getPunchHistory);

module.exports = router;
