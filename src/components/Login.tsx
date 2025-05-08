import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { MessageSquare } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const { login, loginError } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full transition-all duration-300 transform hover:shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-500 p-4 rounded-full mb-4 text-white">
            <MessageSquare size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">SimpleChat</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-center">
            Connect with others in real-time
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Choose a username"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {loginError && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{loginError}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
          >
            Join Chat
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>No sign-up required. Just enter a username and start chatting!</p>
        </div>
      </div>
    </div>
  );
};

export default Login;