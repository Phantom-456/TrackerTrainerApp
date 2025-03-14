import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';

const ExercisePunchForm = () => {
  const [formData, setFormData] = useState({
    timestamp: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDThh:mm
    duration_minutes: '',
    intensity: 5,
    tiredness: 0,
    goal_met: true,
    notes: '',
    calories_burned: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Convert form data to proper types
      const payload = {
        ...formData,
        duration_minutes: parseInt(formData.duration_minutes),
        intensity: parseInt(formData.intensity),
        tiredness: parseInt(formData.tiredness),
        calories_burned: formData.calories_burned ? parseInt(formData.calories_burned) : null
      };

      await axios.post(`${config.apiUrl}/api/punch/exercise`, payload);
      
      setSuccess(true);
      // Reset form
      setFormData({
        timestamp: new Date().toISOString().slice(0, 16),
        duration_minutes: '',
        intensity: 5,
        tiredness: 0,
        goal_met: true,
        notes: '',
        calories_burned: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit exercise data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Log Exercise</h2>
      
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

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (minutes)
          </label>
          <input
            type="number"
            name="duration_minutes"
            value={formData.duration_minutes}
            onChange={handleChange}
            min="1"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            required
          />
        </div>

        {/* Intensity Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intensity: {formData.intensity}
          </label>
          <input
            type="range"
            name="intensity"
            min="1"
            max="10"
            value={formData.intensity}
            onChange={handleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 (Light)</span>
            <span>10 (Intense)</span>
          </div>
        </div>

        {/* Tiredness Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiredness: {formData.tiredness}
          </label>
          <input
            type="range"
            name="tiredness"
            min="-10"
            max="10"
            value={formData.tiredness}
            onChange={handleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>-10 (Exhausted)</span>
            <span>10 (Energized)</span>
          </div>
        </div>

        {/* Goal Met */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Goal Met
          </label>
          <select
            name="goal_met"
            value={formData.goal_met}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            required
          >
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            placeholder="Add any notes about your exercise session..."
          />
        </div>

        {/* Calories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calories Burned (optional)
          </label>
          <input
            type="number"
            name="calories_burned"
            value={formData.calories_burned}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            placeholder="Enter calories burned..."
          />
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        {success && (
          <div className="text-green-500 text-sm">Exercise logged successfully!</div>
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
          {loading ? 'Logging...' : 'Log Exercise'}
        </button>
      </form>
    </div>
  );
};

export default ExercisePunchForm;
