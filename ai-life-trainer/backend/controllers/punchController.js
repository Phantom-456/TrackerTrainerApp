const db = require('../config/db');

// Create exercise punch
const createExercisePunch = async (req, res) => {
  try {
    const {
      timestamp = new Date(),
      duration_minutes,
      intensity,
      tiredness,
      goal_met,
      notes,
      calories_burned
    } = req.body;

    // Input validation
    if (!duration_minutes || duration_minutes <= 0) {
      return res.status(400).json({ error: 'Duration must be a positive number' });
    }
    if (intensity < 1 || intensity > 10) {
      return res.status(400).json({ error: 'Intensity must be between 1 and 10' });
    }
    if (tiredness < -10 || tiredness > 10) {
      return res.status(400).json({ error: 'Tiredness must be between -10 and 10' });
    }
    if (typeof goal_met !== 'boolean') {
      return res.status(400).json({ error: 'Goal met must be a boolean value' });
    }
    if (calories_burned && calories_burned <= 0) {
      return res.status(400).json({ error: 'Calories burned must be a positive number' });
    }

    const query = `
      INSERT INTO exercise_logs 
      (timestamp, duration_minutes, intensity, tiredness, goal_met, notes, calories_burned)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [timestamp, duration_minutes, intensity, tiredness, goal_met, notes, calories_burned];
    const result = await db.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating exercise punch:', error);
    res.status(500).json({ error: 'Failed to create exercise punch' });
  }
};

// Create sleep punch
const createSleepPunch = async (req, res) => {
  try {
    const {
      timestamp = new Date(),
      quality,
      notes
    } = req.body;

    // Input validation
    if (!quality || quality < 1 || quality > 5) {
      return res.status(400).json({ error: 'Quality must be between 1 and 5' });
    }

    const query = `
      INSERT INTO sleep_logs 
      (timestamp, quality, notes)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const values = [timestamp, quality, notes];
    const result = await db.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating sleep punch:', error);
    res.status(500).json({ error: 'Failed to create sleep punch' });
  }
};

// Create nutrition punch
const createNutritionPunch = async (req, res) => {
  try {
    const {
      timestamp = new Date(),
      meal_type,
      description,
      calories
    } = req.body;

    // Input validation
    if (!meal_type || !meal_type.trim()) {
      return res.status(400).json({ error: 'Meal type is required' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Description is required' });
    }
    if (calories && calories <= 0) {
      return res.status(400).json({ error: 'Calories must be a positive number' });
    }

    const query = `
      INSERT INTO nutrition_logs 
      (timestamp, meal_type, description, calories)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [timestamp, meal_type, description, calories];
    const result = await db.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating nutrition punch:', error);
    res.status(500).json({ error: 'Failed to create nutrition punch' });
  }
};

// Get punch history (combined from all tables)
const getPunchHistory = async (req, res) => {
  try {
    const query = `
      SELECT 
        'exercise' as type,
        id,
        timestamp,
        duration_minutes,
        intensity,
        tiredness,
        goal_met,
        notes,
        calories_burned,
        created_at
      FROM exercise_logs
      UNION ALL
      SELECT 
        'sleep' as type,
        id,
        timestamp,
        NULL as duration_minutes,
        quality as intensity,
        NULL as tiredness,
        NULL as goal_met,
        notes,
        NULL as calories_burned,
        created_at
      FROM sleep_logs
      UNION ALL
      SELECT 
        'nutrition' as type,
        id,
        timestamp,
        NULL as duration_minutes,
        NULL as intensity,
        NULL as tiredness,
        NULL as goal_met,
        description as notes,
        calories as calories_burned,
        created_at
      FROM nutrition_logs
      ORDER BY timestamp DESC
    `;

    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching punch history:', error);
    res.status(500).json({ error: 'Failed to fetch punch history' });
  }
};

module.exports = {
  createExercisePunch,
  createSleepPunch,
  createNutritionPunch,
  getPunchHistory
};
