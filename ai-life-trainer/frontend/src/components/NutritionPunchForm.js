import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';

const NutritionPunchForm = () => {
  const [formData, setFormData] = useState({
    timestamp: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDThh:mm
    meal_type: 'breakfast',
    description: '',
    calories: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'morning_snack', label: 'Morning Snack' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'afternoon_snack', label: 'Afternoon Snack' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'evening_snack', label: 'Evening Snack' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const payload = {
        ...formData,
        calories: formData.calories ? parseInt(formData.calories) : null
      };

      await axios.post(`${config.apiUrl}/api/punch/nutrition`, payload);
      
      setSuccess(true);
      // Reset form
      setFormData({
        timestamp: new Date().toISOString().slice(0, 16),
        meal_type: 'breakfast',
        description: '',
        calories: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit nutrition data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Log Nutrition</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date & Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date & Time
          </label>
          <input
            type="datetime-local"
            name="timestamp"
            value={formData.timestamp}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            required
          />
        </div>

        {/* Meal Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meal Type
          </label>
          <select
            name="meal_type"
            value={formData.meal_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            required
          >
            {mealTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What did you eat?
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            placeholder="Describe your meal in detail..."
            required
          />
        </div>

        {/* Calories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calories (optional)
          </label>
          <input
            type="number"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            placeholder="Enter calories..."
          />
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        {success && (
          <div className="text-green-500 text-sm">Nutrition logged successfully!</div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
            loading
              ? 'bg-pink-400 cursor-not-allowed'
              : 'bg-pink-600 hover:bg-pink-700 active:bg-pink-800'
          } transition-colors duration-200`}
        >
          {loading ? 'Logging...' : 'Log Nutrition'}
        </button>
      </form>
    </div>
  );
};

export default NutritionPunchForm;
