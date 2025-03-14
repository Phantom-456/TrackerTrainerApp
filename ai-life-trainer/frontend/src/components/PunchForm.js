import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QUALITY_OPTIONS = [
  { value: 1, label: 'Very Poor' },
  { value: 2, label: 'Poor' },
  { value: 3, label: 'Okay' },
  { value: 4, label: 'Good' },
  { value: 5, label: 'Very Good' }
];

const PunchForm = () => {
  const [selectedType, setSelectedType] = useState('history');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Exercise form state
  const [exerciseForm, setExerciseForm] = useState({
    timestamp: new Date().toISOString().slice(0, 16),
    duration_minutes: '',
    intensity: 5,
    tiredness: 0,
    goal_met: 'false',
    notes: '',
    calories_burned: ''
  });

  // Sleep form state
  const [sleepForm, setSleepForm] = useState({
    timestamp: new Date().toISOString().slice(0, 16),
    quality: '3'
  });

  // Nutrition form state
  const [nutritionForm, setNutritionForm] = useState({
    timestamp: new Date().toISOString().slice(0, 16),
    meal_type: 'breakfast',
    description: '',
    calories: ''
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/punch/history`);
      setHistory(response.data);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to fetch history'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      let response;
      switch (selectedType) {
        case 'exercise':
          response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/punch/exercise`,
            exerciseForm
          );
          break;
        case 'sleep':
          response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/punch/sleep`,
            sleepForm
          );
          break;
        case 'nutrition':
          response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/punch/nutrition`,
            nutritionForm
          );
          break;
        default:
          return;
      }

      setMessage({
        type: 'success',
        text: 'Activity logged successfully!'
      });

      // Reset forms
      setExerciseForm({
        timestamp: new Date().toISOString().slice(0, 16),
        duration_minutes: '',
        intensity: 5,
        tiredness: 0,
        goal_met: 'false',
        notes: '',
        calories_burned: ''
      });
      setSleepForm({
        timestamp: new Date().toISOString().slice(0, 16),
        quality: '3'
      });
      setNutritionForm({
        timestamp: new Date().toISOString().slice(0, 16),
        meal_type: 'breakfast',
        description: '',
        calories: ''
      });

      // Refresh history
      fetchHistory();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to log activity'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (selectedType) {
      case 'exercise':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date & Time</label>
              <input
                type="datetime-local"
                value={exerciseForm.timestamp}
                onChange={(e) => setExerciseForm(prev => ({ ...prev, timestamp: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
              <input
                type="number"
                value={exerciseForm.duration_minutes}
                onChange={(e) => setExerciseForm(prev => ({ ...prev, duration_minutes: e.target.value }))}
                className="w-full p-2 border rounded"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Intensity (1-10): {exerciseForm.intensity}
              </label>
              <input
                type="range"
                value={exerciseForm.intensity}
                onChange={(e) => setExerciseForm(prev => ({ ...prev, intensity: e.target.value }))}
                className="w-full"
                min="1"
                max="10"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tiredness (-10 to 10): {exerciseForm.tiredness}
              </label>
              <input
                type="range"
                value={exerciseForm.tiredness}
                onChange={(e) => setExerciseForm(prev => ({ ...prev, tiredness: e.target.value }))}
                className="w-full"
                min="-10"
                max="10"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Goal Met?</label>
              <select
                value={exerciseForm.goal_met}
                onChange={(e) => setExerciseForm(prev => ({ ...prev, goal_met: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                value={exerciseForm.notes}
                onChange={(e) => setExerciseForm(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full p-2 border rounded"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Calories Burned (optional)</label>
              <input
                type="number"
                value={exerciseForm.calories_burned}
                onChange={(e) => setExerciseForm(prev => ({ ...prev, calories_burned: e.target.value }))}
                className="w-full p-2 border rounded"
                min="0"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 disabled:bg-pink-400"
            >
              {loading ? 'Logging...' : 'Log Exercise'}
            </button>
          </form>
        );

      case 'sleep':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date & Time</label>
              <input
                type="datetime-local"
                value={sleepForm.timestamp}
                onChange={(e) => setSleepForm(prev => ({ ...prev, timestamp: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sleep Quality</label>
              <select
                value={sleepForm.quality}
                onChange={(e) => setSleepForm(prev => ({ ...prev, quality: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              >
                {QUALITY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 disabled:bg-pink-400"
            >
              {loading ? 'Logging...' : 'Log Sleep'}
            </button>
          </form>
        );

      case 'nutrition':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date & Time</label>
              <input
                type="datetime-local"
                value={nutritionForm.timestamp}
                onChange={(e) => setNutritionForm(prev => ({ ...prev, timestamp: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Meal Type</label>
              <select
                value={nutritionForm.meal_type}
                onChange={(e) => setNutritionForm(prev => ({ ...prev, meal_type: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={nutritionForm.description}
                onChange={(e) => setNutritionForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 border rounded"
                rows="3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Calories (optional)</label>
              <input
                type="number"
                value={nutritionForm.calories}
                onChange={(e) => setNutritionForm(prev => ({ ...prev, calories: e.target.value }))}
                className="w-full p-2 border rounded"
                min="0"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 disabled:bg-pink-400"
            >
              {loading ? 'Logging...' : 'Log Nutrition'}
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  const renderHistory = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      );
    }

    if (history.length === 0) {
      return (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300">No activity logs yet. Start logging!</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {history.map((log) => (
          <div
            key={`${log.type}-${log.id}`}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-block px-2 py-1 text-xs font-semibold rounded capitalize mb-2"
                  style={{
                    backgroundColor: log.type === 'exercise' ? '#fecdd3' : 
                                   log.type === 'sleep' ? '#bfdbfe' : '#bbf7d0',
                    color: log.type === 'exercise' ? '#be123c' :
                          log.type === 'sleep' ? '#1e40af' : '#15803d'
                  }}
                >
                  {log.type}
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            </div>

            {log.type === 'exercise' && (
              <div className="mt-2">
                <p>Duration: {log.duration_minutes} minutes</p>
                <p>Intensity: {log.intensity}/10</p>
                <p>Tiredness: {log.tiredness}</p>
                <p>Goal Met: {log.goal_met ? 'Yes' : 'No'}</p>
                {log.calories_burned && <p>Calories Burned: {log.calories_burned}</p>}
                {log.notes && <p className="mt-2 text-gray-600 dark:text-gray-300">{log.notes}</p>}
              </div>
            )}

            {log.type === 'sleep' && (
              <div className="mt-2">
                <p>Quality: {QUALITY_OPTIONS.find(q => q.value === log.quality)?.label}</p>
              </div>
            )}

            {log.type === 'nutrition' && (
              <div className="mt-2">
                <p>Meal: {log.meal_type}</p>
                <p>{log.description}</p>
                {log.calories && <p>Calories: {log.calories}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex mb-6">
        <div className="w-64 pr-6">
          <div className="space-y-2">
            <button
              onClick={() => setSelectedType('history')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                selectedType === 'history'
                  ? 'bg-pink-600 text-white'
                  : 'hover:bg-pink-100 dark:hover:bg-pink-900'
              }`}
            >
              History
            </button>
            <button
              onClick={() => setSelectedType('exercise')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                selectedType === 'exercise'
                  ? 'bg-pink-600 text-white'
                  : 'hover:bg-pink-100 dark:hover:bg-pink-900'
              }`}
            >
              Exercise
            </button>
            <button
              onClick={() => setSelectedType('sleep')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                selectedType === 'sleep'
                  ? 'bg-pink-600 text-white'
                  : 'hover:bg-pink-100 dark:hover:bg-pink-900'
              }`}
            >
              Sleep
            </button>
            <button
              onClick={() => setSelectedType('nutrition')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                selectedType === 'nutrition'
                  ? 'bg-pink-600 text-white'
                  : 'hover:bg-pink-100 dark:hover:bg-pink-900'
              }`}
            >
              Nutrition
            </button>
          </div>
        </div>

        <div className="flex-1">
          {message.text && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100'
                  : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              {selectedType === 'history' ? 'Activity History' : `Log ${selectedType}`}
            </h2>
            
            {selectedType === 'history' ? renderHistory() : renderForm()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PunchForm;