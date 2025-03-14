const db = require('../config/db');

/**
 * Get sleep data for the past week
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getSleepData = async (req, res) => {
  try {
    // Get sleep data for the past week
    const query = `
      SELECT 
        DATE(timestamp) as date,
        timestamp,
        quality
      FROM sleep_logs
      WHERE timestamp >= NOW() - INTERVAL '7 days'
      ORDER BY timestamp ASC
    `;
    
    const result = await db.query(query);
    
    // Format the data for the chart
    const formattedData = result.rows.map(row => ({
      date: row.date,
      time: new Date(row.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      quality: row.quality
    }));
    
    res.status(200).json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error('Error fetching sleep data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sleep data',
      error: error.message
    });
  }
};

/**
 * Get workout data for the past month
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getWorkoutData = async (req, res) => {
  try {
    // Get workout data for the past month
    const query = `
      SELECT 
        DATE(timestamp) as date,
        timestamp,
        duration_minutes,
        intensity,
        calories_burned
      FROM exercise_logs
      WHERE timestamp >= NOW() - INTERVAL '30 days'
      ORDER BY timestamp ASC
    `;
    
    const result = await db.query(query);
    
    // Format the data for the chart
    const formattedData = result.rows.map(row => ({
      date: row.date,
      time: new Date(row.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      duration: row.duration_minutes,
      intensity: row.intensity,
      caloriesBurned: row.calories_burned
    }));
    
    res.status(200).json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error('Error fetching workout data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch workout data',
      error: error.message
    });
  }
};

/**
 * Get calories data for the past month
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCaloriesData = async (req, res) => {
  try {
    // Get calories consumed per day for the past month
    const caloriesConsumedQuery = `
      SELECT 
        DATE(timestamp) as date,
        SUM(calories) as calories_consumed
      FROM nutrition_logs
      WHERE timestamp >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(timestamp)
      ORDER BY date ASC
    `;
    
    // Get calories burned per day for the past month
    const caloriesBurnedQuery = `
      SELECT 
        DATE(timestamp) as date,
        SUM(calories_burned) as calories_burned
      FROM exercise_logs
      WHERE timestamp >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(timestamp)
      ORDER BY date ASC
    `;
    
    const [consumedResult, burnedResult] = await Promise.all([
      db.query(caloriesConsumedQuery),
      db.query(caloriesBurnedQuery)
    ]);
    
    // Create a map of dates to store both consumed and burned calories
    const dateMap = new Map();
    
    // Set default values for all dates in the past month
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dateMap.set(dateStr, {
        date: dateStr,
        caloriesConsumed: 0,
        caloriesBurned: 0
      });
    }
    
    // Update with actual consumed calories
    consumedResult.rows.forEach(row => {
      const dateStr = new Date(row.date).toISOString().split('T')[0];
      if (dateMap.has(dateStr)) {
        const entry = dateMap.get(dateStr);
        entry.caloriesConsumed = row.calories_consumed;
        dateMap.set(dateStr, entry);
      }
    });
    
    // Update with actual burned calories
    burnedResult.rows.forEach(row => {
      const dateStr = new Date(row.date).toISOString().split('T')[0];
      if (dateMap.has(dateStr)) {
        const entry = dateMap.get(dateStr);
        entry.caloriesBurned = row.calories_burned;
        dateMap.set(dateStr, entry);
      }
    });
    
    // Convert map to array and sort by date
    const formattedData = Array.from(dateMap.values())
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    res.status(200).json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error('Error fetching calories data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch calories data',
      error: error.message
    });
  }
};

module.exports = {
  getSleepData,
  getWorkoutData,
  getCaloriesData
};