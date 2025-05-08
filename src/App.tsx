import React from 'react';
import { useChat } from './context/ChatContext';
import Login from './components/Login';
import ChatInterface from './components/ChatInterface';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';

const AppContent: React.FC = () => {
  const { currentUser } = useChat();
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      {currentUser ? <ChatInterface /> : <Login />}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </ThemeProvider>
  );
}

export default App;