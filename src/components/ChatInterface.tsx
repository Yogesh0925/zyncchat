import React from 'react';
import ChatHeader from './ChatHeader';
import UserList from './UserList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatInterface: React.FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <ChatHeader />
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar with users - hidden on mobile */}
        <div className="hidden md:block w-64 border-r border-gray-200 dark:border-gray-700">
          <UserList />
        </div>
        
        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          <MessageList />
          <MessageInput />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;