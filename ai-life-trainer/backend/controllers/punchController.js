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
    const { startDate, endDate, limit = 50, offset = 0 } = req.query;

    let dateFilter = '';
    const values = [limit, offset];
    let paramIndex = 3;

    if (startDate && endDate) {
      dateFilter = `WHERE timestamp BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      values.push(startDate, endDate);
      paramIndex += 2;
    } else if (startDate) {
      dateFilter = `WHERE timestamp >= $${paramIndex}`;
      values.push(startDate);
      paramIndex += 1;
    } else if (endDate) {
      dateFilter = `WHERE timestamp <= $${paramIndex}`;
      values.push(endDate);
      paramIndex += 1;
    }

    const query = `
      (SELECT 
        'exercise' as type,
        id,
        timestamp,
        duration_minutes::text as duration_minutes,
        intensity::text as intensity,
        tiredness::text as tiredness,
        goal_met::text as goal_met,
        notes,
        calories_burned::text as calories_burned,
        NULL as quality,
        NULL as meal_type,
        NULL as calories,
        NULL as description
      FROM exercise_logs)
      UNION ALL
      (SELECT 
        'sleep' as type,
        id,
        timestamp,
        NULL as duration_minutes,
        NULL as intensity,
        NULL as tiredness,
        NULL as goal_met,
        notes,
        NULL as calories_burned,
        quality::text as quality,
        NULL as meal_type,
        NULL as calories,
        NULL as description
      FROM sleep_logs)
      UNION ALL
      (SELECT 
        'nutrition' as type,
        id,
        timestamp,
        NULL as duration_minutes,
        NULL as intensity,
        NULL as tiredness,
        NULL as goal_met,
        NULL as notes,
        NULL as calories_burned,
        NULL as quality,
        meal_type,
        calories::text as calories,
        description
      FROM nutrition_logs)
      ${dateFilter}
      ORDER BY timestamp DESC
      LIMIT $1 OFFSET $2
    `;

    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching punch history:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to fetch punch history', details: error.message });
  }
};

module.exports = {
  createExercisePunch,
  createSleepPunch,
  createNutritionPunch,
  getPunchHistory
};
