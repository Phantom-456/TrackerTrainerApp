import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PunchFlow from './components/PunchFlow';
import Charts from './components/Charts';
import AITrainer from './components/AITrainer';
import ThemeToggle from './components/ThemeToggle';
import './styles/theme.css';

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200 ${theme}`}>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/punch" replace />} />
            <Route path="/punch/*" element={<PunchFlow />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/trainer" element={<AITrainer />} />
          </Routes>
        </main>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
    </Router>
  );
}

export default App;
