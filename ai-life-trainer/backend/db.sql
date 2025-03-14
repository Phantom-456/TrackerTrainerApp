-- Drop tables if they exist
DROP TABLE IF EXISTS exercise_logs;
DROP TABLE IF EXISTS sleep_logs;
DROP TABLE IF EXISTS nutrition_logs;
DROP TABLE IF EXISTS chat_history;

-- Create exercise logs table
CREATE TABLE exercise_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
    tiredness INTEGER CHECK (tiredness >= -10 AND tiredness <= 10),
    goal_met BOOLEAN NOT NULL,
    notes TEXT,
    calories_burned INTEGER CHECK (calories_burned > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sleep logs table
CREATE TABLE sleep_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quality INTEGER CHECK (quality >= 1 AND quality <= 5),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create nutrition logs table
CREATE TABLE nutrition_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    meal_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    calories INTEGER CHECK (calories > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create chat history table
CREATE TABLE chat_history (
    id SERIAL PRIMARY KEY,
    sender VARCHAR(10) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_exercise_timestamp ON exercise_logs(timestamp);
CREATE INDEX idx_sleep_timestamp ON sleep_logs(timestamp);
CREATE INDEX idx_nutrition_timestamp ON nutrition_logs(timestamp);
CREATE INDEX idx_chat_timestamp ON chat_history(timestamp);

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_exercise_modtime
    BEFORE UPDATE ON exercise_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sleep_modtime
    BEFORE UPDATE ON sleep_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nutrition_modtime
    BEFORE UPDATE ON nutrition_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
