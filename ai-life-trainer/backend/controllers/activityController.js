const db = require('../config/db');

// Create a new punch (activity entry)
const createPunch = async (data) => {
  const { exercise, nutrition, sleep } = data;
  
  // Validate required fields
  if (!exercise || !nutrition || !sleep) {
    const error = new Error('Missing required fields');
    error.status = 400;
    throw error;
  }

  const query = `
    INSERT INTO user_activities (exercise, nutrition, sleep, created_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING *
  `;

  try {
    const result = await db.query(query, [exercise, nutrition, sleep]);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating punch:', error);
    const dbError = new Error('Failed to create activity entry');
    dbError.name = 'DatabaseError';
    throw dbError;
  }
};

// Get all punches
const getPunches = async () => {
  const query = `
    SELECT * FROM user_activities
    ORDER BY created_at DESC
  `;

  try {
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching punches:', error);
    const dbError = new Error('Failed to fetch activities');
    dbError.name = 'DatabaseError';
    throw dbError;
  }
};

// Update a punch
const updatePunch = async (id, data) => {
  const { exercise, nutrition, sleep } = data;

  // Validate required fields
  if (!exercise || !nutrition || !sleep) {
    const error = new Error('Missing required fields');
    error.status = 400;
    throw error;
  }

  const query = `
    UPDATE user_activities
    SET exercise = $1, nutrition = $2, sleep = $3, updated_at = NOW()
    WHERE id = $4
    RETURNING *
  `;

  try {
    const result = await db.query(query, [exercise, nutrition, sleep, id]);
    if (result.rows.length === 0) {
      const error = new Error('Activity not found');
      error.status = 404;
      throw error;
    }
    return result.rows[0];
  } catch (error) {
    if (error.status === 404) throw error;
    console.error('Error updating punch:', error);
    const dbError = new Error('Failed to update activity');
    dbError.name = 'DatabaseError';
    throw dbError;
  }
};

// Delete a punch
const deletePunch = async (id) => {
  const query = `
    DELETE FROM user_activities
    WHERE id = $1
    RETURNING id
  `;

  try {
    const result = await db.query(query, [id]);
    if (result.rows.length === 0) {
      const error = new Error('Activity not found');
      error.status = 404;
      throw error;
    }
  } catch (error) {
    if (error.status === 404) throw error;
    console.error('Error deleting punch:', error);
    const dbError = new Error('Failed to delete activity');
    dbError.name = 'DatabaseError';
    throw dbError;
  }
};

module.exports = {
  createPunch,
  getPunches,
  updatePunch,
  deletePunch
};
