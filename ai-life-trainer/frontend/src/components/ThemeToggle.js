import React from 'react';

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <div className="text-yellow-500 hover:text-yellow-400 transition-colors">
          <i className="fas fa-sun text-xl"></i>
          <span className="sr-only">Switch to light mode</span>
        </div>
      ) : (
        <div className="text-gray-700 hover:text-gray-600 transition-colors">
          <i className="fas fa-moon text-xl"></i>
          <span className="sr-only">Switch to dark mode</span>
        </div>
      )}
    </button>
  );
};

export default ThemeToggle;
