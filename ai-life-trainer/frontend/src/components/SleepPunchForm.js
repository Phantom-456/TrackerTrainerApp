import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';

const SleepPunchForm = () => {
  const [formData, setFormData] = useState({
    timestamp: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDThh:mm
    quality: '3', // Default to "Okay"
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const qualityOptions = [
    { value: '1', label: 'Very Poor' },
    { value: '2', label: 'Poor' },
    { value: '3', label: 'Okay' },
    { value: '4', label: 'Good' },
    { value: '5', label: 'Very Good' }
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
        quality: parseInt(formData.quality)
      };

      await axios.post(`${config.apiUrl}/api/punch/sleep`, payload);
      
      setSuccess(true);
      // Reset form
      setFormData({
        timestamp: new Date().toISOString().slice(0, 16),
        quality: '3',
        notes: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit sleep data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Log Sleep</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date & Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date & Time
          </label>
          <input
            type="datetime-local"
            name="timestamp"
            value={formData.timestamp}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            required
          />
        </div>

        {/* Sleep Quality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sleep Quality
          </label>
          <select
            name="quality"
            value={formData.quality}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            required
          >
            {qualityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.value} - {option.label}
              </option>
            ))}
          </select>
          <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>1 (Very Poor)</span>
            <span>5 (Very Good)</span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            placeholder="Add any notes about your sleep..."
          />
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        {success && (
          <div className="text-green-500 text-sm">Sleep quality logged successfully!</div>
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
          {loading ? 'Logging...' : 'Log Sleep'}
        </button>
      </form>
    </div>
  );
};

export default SleepPunchForm;
