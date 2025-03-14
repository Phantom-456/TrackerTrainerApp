import React, { useState } from 'react';
import ExercisePunchForm from './ExercisePunchForm';
import SleepPunchForm from './SleepPunchForm';
import NutritionPunchForm from './NutritionPunchForm';
import PunchHistory from './PunchHistory';

const PunchFlow = () => {
  const [selectedCategory, setSelectedCategory] = useState('history');

  const renderContent = () => {
    switch (selectedCategory) {
      case 'exercise':
        return <ExercisePunchForm />;
      case 'sleep':
        return <SleepPunchForm />;
      case 'nutrition':
        return <NutritionPunchForm />;
      default:
        return <PunchHistory />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Make a Punch</h2>
            <nav className="space-y-2">
              {['exercise', 'nutrition', 'sleep'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full px-4 py-2 text-left rounded-lg transition-colors duration-150 ${
                    selectedCategory === category
                      ? 'bg-pink-500 text-white'
                      : 'text-gray-600 hover:bg-pink-50'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </nav>
          </div>
          
          {/* History button at bottom */}
          <div className="mt-auto p-4 border-t">
            <button
              onClick={() => setSelectedCategory('history')}
              className={`w-full px-4 py-2 text-left rounded-lg transition-colors duration-150 ${
                selectedCategory === 'history'
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-600 hover:bg-pink-50'
              }`}
            >
              History
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default PunchFlow;
