// Import PostgreSQL library
const { Pool } = require('pg');

// In-memory storage for development
const inMemoryDB = {
  exercise_logs: [],
  sleep_logs: [],
  nutrition_logs: [],
  chat_history: []
};

// Helper function to generate timestamp
const getCurrentTimestamp = () => new Date().toISOString();

// Mock database query function
const mockQuery = async (text, params) => {
  // Exercise logs
  if (text.includes('INSERT INTO exercise_logs')) {
    const [timestamp, duration_minutes, intensity, tiredness, goal_met, notes, calories_burned] = params;
    const id = inMemoryDB.exercise_logs.length + 1;
    const log = {
      id,
      type: 'exercise',
      timestamp: timestamp || getCurrentTimestamp(),
      duration_minutes: parseInt(duration_minutes),
      intensity: parseInt(intensity),
      tiredness: parseInt(tiredness),
      goal_met: goal_met === 'true' || goal_met === true,
      notes,
      calories_burned: calories_burned ? parseInt(calories_burned) : null,
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp()
    };
    inMemoryDB.exercise_logs.push(log);
    return { rows: [log] };
  }

  // Sleep logs
  if (text.includes('INSERT INTO sleep_logs')) {
    const [timestamp, quality, notes] = params;
    const id = inMemoryDB.sleep_logs.length + 1;
    const log = {
      id,
      type: 'sleep',
      timestamp: timestamp || getCurrentTimestamp(),
      quality: parseInt(quality),
      notes,
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp()
    };
    inMemoryDB.sleep_logs.push(log);
    return { rows: [log] };
  }

  // Nutrition logs
  if (text.includes('INSERT INTO nutrition_logs')) {
    const [timestamp, meal_type, description, calories] = params;
    const id = inMemoryDB.nutrition_logs.length + 1;
    const log = {
      id,
      type: 'nutrition',
      timestamp: timestamp || getCurrentTimestamp(),
      meal_type,
      description,
      calories: calories ? parseInt(calories) : null,
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp()
    };
    inMemoryDB.nutrition_logs.push(log);
    return { rows: [log] };
  }

  // Combined history query
  if (text.includes('UNION ALL')) {
    const allLogs = [
      ...inMemoryDB.exercise_logs,
      ...inMemoryDB.sleep_logs,
      ...inMemoryDB.nutrition_logs
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return { rows: allLogs };
  }

  // Individual table queries
  if (text.includes('SELECT * FROM exercise_logs')) {
    return { 
      rows: inMemoryDB.exercise_logs.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      )
    };
  }

  if (text.includes('SELECT * FROM sleep_logs')) {
    return { 
      rows: inMemoryDB.sleep_logs.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      )
    };
  }

  if (text.includes('SELECT * FROM nutrition_logs')) {
    return { 
      rows: inMemoryDB.nutrition_logs.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      )
    };
  }

  // Chat history
  if (text.includes('INSERT INTO chat_history')) {
    const [sender, message] = params;
    const id = inMemoryDB.chat_history.length + 1;
    const chat = {
      id,
      sender,
      message,
      timestamp: getCurrentTimestamp()
    };
    inMemoryDB.chat_history.push(chat);
    return { rows: [chat] };
  }

  if (text.includes('SELECT * FROM chat_history')) {
    return { 
      rows: inMemoryDB.chat_history.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      )
    };
  }

  // Generic update and delete operations
  if (text.includes('UPDATE')) {
    const table = text.match(/UPDATE (\w+)/)[1];
    const id = params[params.length - 1];
    const index = inMemoryDB[table].findIndex(item => item.id === id);
    
    if (index === -1) return { rows: [] };
    
    inMemoryDB[table][index] = {
      ...inMemoryDB[table][index],
      ...params.slice(0, -1).reduce((acc, val, idx) => {
        const columns = text.match(/SET (.+) WHERE/)[1].split(',');
        const column = columns[idx].trim().split('=')[0].trim();
        return { ...acc, [column]: val };
      }, {}),
      updated_at: getCurrentTimestamp()
    };
    
    return { rows: [inMemoryDB[table][index]] };
  }

  if (text.includes('DELETE')) {
    const table = text.match(/FROM (\w+)/)[1];
    const [id] = params;
    const index = inMemoryDB[table].findIndex(item => item.id === id);
    
    if (index === -1) return { rows: [] };
    
    inMemoryDB[table].splice(index, 1);
    return { rows: [{ id }] };
  }

  return { rows: [] };
};

// Create PostgreSQL pool
const pgPool = process.env.USE_POSTGRES === 'true' ? new Pool({
  user: process.env.PG_USER || 'avishi',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'ai_life_trainer',
  password: process.env.PG_PASSWORD || '',
  port: process.env.PG_PORT || 5432,
}) : null;

// Mock pool object for in-memory DB
const mockPool = {
  query: mockQuery,
  connect: () => console.log('Using in-memory database for development')
};

// Determine which database to use based on environment variable
const usePostgres = process.env.USE_POSTGRES === 'true';
const pool = usePostgres ? pgPool : mockPool;

console.log(`Using ${usePostgres ? 'PostgreSQL' : 'in-memory'} database`);

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};