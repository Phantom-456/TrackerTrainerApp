import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AITrainer = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatHistory = async () => {
    setHistoryLoading(true);
    try {
      console.log(`[${new Date().toISOString()}] Fetching chat history...`);
      const response = await axios.get('http://localhost:5001/api/trainer/chat');
      console.log(`[${new Date().toISOString()}] Chat history fetched:`, JSON.stringify(response.data, null, 2));
      setMessages(response.data);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error fetching chat history:`, error);
      console.error('Error details:', JSON.stringify(error.response?.data || error.message, null, 2));
      const errorMessage = error.response?.data?.error || 'Failed to fetch chat history. Please try again later.';
      setMessages([{
        sender: 'ai',
        message: errorMessage,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = newMessage.trim();
    setNewMessage('');
    setLoading(true);

    console.log(`[${new Date().toISOString()}] Submitting user message:`, userMessage);

    // Optimistically add user message
    setMessages(prev => [...prev, { sender: 'user', message: userMessage, timestamp: new Date().toISOString() }]);

    try {
      console.log(`[${new Date().toISOString()}] Sending request to AI trainer...`);
      const response = await axios.post('http://localhost:5001/api/trainer/chat', {
        message: userMessage
      });
      console.log(`[${new Date().toISOString()}] Received AI response:`, JSON.stringify(response.data, null, 2));

      // Add AI response
      setMessages(prev => [...prev, {
        sender: 'ai',
        message: response.data.message,
        timestamp: response.data.timestamp
      }]);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error sending message:`, error);
      console.error('Error details:', JSON.stringify(error.response?.data || error.message, null, 2));
      
      let errorMessage;
      if (error.response) {
        switch (error.response.status) {
          case 429:
            errorMessage = 'Too many requests. Please wait a moment before trying again.';
            break;
          case 503:
            errorMessage = 'The AI service is currently unavailable. Please try again later.';
            break;
          case 500:
            errorMessage = 'An unexpected error occurred. Our team has been notified.';
            break;
          default:
            errorMessage = 'Sorry, I encountered an error. Please try again.';
        }
      } else if (error.request) {
        errorMessage = 'Unable to reach the server. Please check your internet connection.';
      } else {
        errorMessage = 'An unexpected error occurred. Please try again.';
      }

      // Show error in chat
      setMessages(prev => [...prev, {
        sender: 'ai',
        message: errorMessage,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="max-w-2xl mx-auto fade-in">
      <div className="card h-[600px] flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-pink-600 dark:text-pink-400">
          AI Trainer Chat 🤖
        </h2>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {historyLoading ? (
            <div className="text-center py-4">
              <p>Loading chat history...</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender === 'user'
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className={`text-xs mt-1 ${
                    msg.sender === 'user'
                      ? 'text-pink-100'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {formatTimestamp(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <form onSubmit={handleSubmit} className="mt-auto">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask your AI trainer something..."
              className="flex-1 p-3 rounded-lg border focus:ring-2 focus:ring-pink-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !newMessage.trim()}
              className={`px-6 py-3 rounded-lg text-white font-medium ${
                loading || !newMessage.trim()
                  ? 'bg-pink-400 cursor-not-allowed'
                  : 'bg-pink-600 hover:bg-pink-700 active:bg-pink-800'
              } transition-colors duration-200`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending
                </span>
              ) : (
                'Send'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AITrainer;
