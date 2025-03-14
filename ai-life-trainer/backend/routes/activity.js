const express = require('express');
const router = express.Router();
const {
    getSleepData,
    getWorkoutData,
    getCaloriesData,
} = require('../controllers/activityController');

// POST routes for chart data
router.get('/sleep', getSleepData);
router.get('/workout', getWorkoutData);
router.get('/calories', getCaloriesData);

module.exports = router;