import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Charts = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/punch');
      setActivities(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch activity data');
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = () => {
    const dates = activities.map(activity => 
      new Date(activity.created_at).toLocaleDateString()
    );

    const exerciseData = activities.map(activity => 
      activity.exercise.length // Simple metric: length of exercise description
    );

    const nutritionData = activities.map(activity => 
      activity.nutrition.length // Simple metric: length of nutrition description
    );

    const sleepData = activities.map(activity => 
      activity.sleep.length // Simple metric: length of sleep description
    );

    return {
      labels: dates,
      datasets: [
        {
          label: 'Exercise Activity',
          data: exerciseData,
          borderColor: 'rgb(236, 72, 153)',
          backgroundColor: 'rgba(236, 72, 153, 0.5)',
          tension: 0.4
        },
        {
          label: 'Nutrition Tracking',
          data: nutritionData,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
          tension: 0.4
        },
        {
          label: 'Sleep Quality',
          data: sleepData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.4
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Activity Tracking Over Time',
        color: 'rgb(236, 72, 153)',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(236, 72, 153, 0.1)'
        }
      },
      x: {
        grid: {
          color: 'rgba(236, 72, 153, 0.1)'
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto fade-in">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 text-pink-600 dark:text-pink-400">
          Activity Charts 📊
        </h2>
        
        {activities.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300">
              No activity data available yet. Start logging your activities!
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <Line data={prepareChartData()} options={chartOptions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Charts;
