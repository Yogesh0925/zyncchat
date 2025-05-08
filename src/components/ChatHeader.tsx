import React from 'react';
import { useChat } from '../context/ChatContext';
import { useTheme } from '../context/ThemeContext';
import { MessageSquare, Moon, Sun, LogOut } from 'lucide-react';

const ChatHeader: React.FC = () => {
  const { currentUser } = useChat();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.reload();
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center">
      <div className="flex items-center">
        <div className="bg-blue-500 p-1.5 rounded-md text-white mr-2">
          <MessageSquare size={20} />
        </div>
        <h1 className="font-bold text-gray-800 dark:text-white">SimpleChat</h1>
      </div>
      
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-2">
            {currentUser?.username.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-800 dark:text-white">
            {currentUser?.username}
          </span>
        </div>
        
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <button 
          onClick={handleLogout}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors ml-2"
          aria-label="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;