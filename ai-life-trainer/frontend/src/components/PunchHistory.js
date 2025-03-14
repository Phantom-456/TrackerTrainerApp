import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const PunchHistory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/api/punch/history`);
      setLogs(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch history');
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const renderExerciseLog = (log) => (
    <div className="bg-white p-4 rounded-lg shadow space-y-2">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-pink-600">Exercise Session</h3>
        <span className="text-sm text-gray-500">{formatDate(log.timestamp)}</span>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Duration:</span>
          <span className="ml-2 font-medium">{log.duration_minutes} minutes</span>
        </div>
        <div>
          <span className="text-gray-600">Intensity:</span>
          <span className="ml-2 font-medium">{log.intensity}/10</span>
        </div>
        <div>
          <span className="text-gray-600">Tiredness:</span>
          <span className="ml-2 font-medium">{log.tiredness}</span>
        </div>
        <div>
          <span className="text-gray-600">Goal Met:</span>
          <span className={`ml-2 font-medium ${log.goal_met ? 'text-green-600' : 'text-red-600'}`}>
            {log.goal_met ? 'Yes' : 'No'}
          </span>
        </div>
        {log.calories_burned && (
          <div>
            <span className="text-gray-600">Calories:</span>
            <span className="ml-2 font-medium">{log.calories_burned} kcal</span>
          </div>
        )}
      </div>
      {log.notes && (
        <div className="mt-2 text-sm">
          <span className="text-gray-600">Notes:</span>
          <p className="mt-1 text-gray-700">{log.notes}</p>
        </div>
      )}
    </div>
  );

  const renderSleepLog = (log) => (
    <div className="bg-white p-4 rounded-lg shadow space-y-2">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-indigo-600">Sleep Log</h3>
        <span className="text-sm text-gray-500">{formatDate(log.timestamp)}</span>
      </div>
      <div className="text-sm">
        <div>
          <span className="text-gray-600">Quality:</span>
          <span className="ml-2 font-medium">
            {log.intensity} - {
              ['Very Poor', 'Poor', 'Okay', 'Good', 'Very Good'][log.intensity - 1]
            }
          </span>
        </div>
        {log.notes && (
          <div className="mt-2">
            <span className="text-gray-600">Notes:</span>
            <p className="mt-1 text-gray-700">{log.notes}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderNutritionLog = (log) => (
    <div className="bg-white p-4 rounded-lg shadow space-y-2">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-green-600">Nutrition Log</h3>
        <span className="text-sm text-gray-500">{formatDate(log.timestamp)}</span>
      </div>
      <div className="text-sm">
        <div>
          <span className="text-gray-600">Description:</span>
          <p className="mt-1 text-gray-700">{log.notes}</p>
        </div>
        {log.calories_burned && (
          <div className="mt-2">
            <span className="text-gray-600">Calories:</span>
            <span className="ml-2 font-medium">{log.calories_burned} kcal</span>
          </div>
        )}
      </div>
    </div>
  );

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.type === filter);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">History</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 "
        >
          <option value="all">All Entries</option>
          <option value="exercise">Exercise Only</option>
          <option value="sleep">Sleep Only</option>
          <option value="nutrition">Nutrition Only</option>
        </select>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No entries found
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log, index) => (
            <div key={`${log.type}-${log.id}-${index}`}>
              {log.type === 'exercise' && renderExerciseLog(log)}
              {log.type === 'sleep' && renderSleepLog(log)}
              {log.type === 'nutrition' && renderNutritionLog(log)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PunchHistory;
