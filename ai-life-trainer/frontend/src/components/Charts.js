import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ActivityCharts = () => {
  const [sleepData, setSleepData] = useState([]);
  const [workoutData, setWorkoutData] = useState([]);
  const [caloriesData, setCaloriesData] = useState([]);
  const [activeTab, setActiveTab] = useState('sleep');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivityData();
  }, []);

  const fetchActivityData = async () => {
    setLoading(true);
    try {
      const [sleepResponse, workoutResponse, caloriesResponse] = await Promise.all([
        axios.get('http://localhost:5001/api/activity/sleep'),
        axios.get('http://localhost:5001/api/activity/workout'),
        axios.get('http://localhost:5001/api/activity/calories')
      ]);

      setSleepData(sleepResponse.data.data);
      setWorkoutData(workoutResponse.data.data);
      setCaloriesData(caloriesResponse.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch activity data');
      console.error('Error fetching activity data:', err);
    } finally {
      setLoading(false);
    }
  };

  const prepareSleepChartData = () => {
    const dates = sleepData.map(item => 
      new Date(item.date).toLocaleDateString()
    );

    const qualities = sleepData.map(item => item.quality);

    return {
      labels: dates,
      datasets: [
        {
          label: 'Sleep Quality',
          data: qualities,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.4
        }
      ]
    };
  };

  const prepareWorkoutChartData = () => {
    const dates = workoutData.map(item => 
      new Date(item.date).toLocaleDateString()
    );

    const durations = workoutData.map(item => item.duration);
    
    // Create background colors based on intensity
    const backgroundColors = workoutData.map(item => {
      const intensity = item.intensity;
      if (intensity <= 3) return 'rgba(34, 197, 94, 0.7)'; // Green
      if (intensity <= 6) return 'rgba(234, 179, 8, 0.7)'; // Yellow
      return 'rgba(239, 68, 68, 0.7)'; // Red
    });

    return {
      labels: dates,
      datasets: [
        {
          label: 'Workout Duration (minutes)',
          data: durations,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
          borderWidth: 1
        }
      ]
    };
  };

  const prepareCaloriesChartData = () => {
    const dates = caloriesData.map(item => 
      new Date(item.date).toLocaleDateString()
    );

    const consumed = caloriesData.map(item => item.caloriesConsumed);
    const burned = caloriesData.map(item => item.caloriesBurned);

    return {
      labels: dates,
      datasets: [
        {
          label: 'Calories Consumed',
          data: consumed,
          borderColor: 'rgb(236, 72, 153)',
          backgroundColor: 'rgba(236, 72, 153, 0.5)',
          tension: 0.4
        },
        {
          label: 'Calories Burned',
          data: burned,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
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
        labels: {
          color: 'rgb(156, 163, 175)' // gray-400 for better visibility in both light and dark modes
        }
      },
      title: {
        display: true,
        text: activeTab === 'sleep' ? 'Sleep Quality Over Time' : 
              activeTab === 'workout' ? 'Workout Duration and Intensity' : 
              'Calories Consumed vs. Calories Burned',
        color: 'rgb(236, 72, 153)', // pink-500
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
          color: 'rgba(156, 163, 175, 0.2)' // gray-400 with lower opacity
        },
        ticks: {
          color: 'rgb(156, 163, 175)' // gray-400
        }
      },
      x: {
        grid: {
          color: 'rgba(156, 163, 175, 0.2)' // gray-400 with lower opacity
        },
        ticks: {
          color: 'rgb(156, 163, 175)' // gray-400
        }
      }
    }
  };

  // Sleep chart specific options
  const sleepChartOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        min: 1,
        max: 5,
        ticks: {
          stepSize: 1
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

  const noDataMessage = (dataType) => (
    <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <p className="text-gray-600 dark:text-gray-300">
        No {dataType} data available yet. Start logging your activities!
      </p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto fade-in">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 text-pink-600 dark:text-pink-400">
          Activity Charts 📊
        </h2>
        
        {/* Tab buttons */}
        <div className="flex mb-4 border-b border-gray-200">
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'sleep' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('sleep')}
          >
            Sleep
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'workout' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('workout')}
          >
            Workout
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'calories' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('calories')}
          >
            Calories
          </button>
        </div>
        
        {/* Chart content */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          {activeTab === 'sleep' && (
            sleepData.length === 0 ? noDataMessage('sleep') : (
              <Line data={prepareSleepChartData()} options={sleepChartOptions} />
            )
          )}
          
          {activeTab === 'workout' && (
            workoutData.length === 0 ? noDataMessage('workout') : (
              <Bar data={prepareWorkoutChartData()} options={chartOptions} />
            )
          )}
          
          {activeTab === 'calories' && (
            caloriesData.length === 0 ? noDataMessage('calories') : (
              <Line data={prepareCaloriesChartData()} options={chartOptions} />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityCharts;
