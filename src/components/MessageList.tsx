import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Message, useChat } from '../context/ChatContext';

const MessageList: React.FC = () => {
  const { messages, currentUser } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 text-center">
          <p className="mb-2">No messages yet</p>
          <p className="text-sm">Be the first to send a message!</p>
        </div>
      ) : (
        messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            isOwn={message.senderId === currentUser?.id}
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

const MessageItem: React.FC<{ message: Message; isOwn: boolean }> = ({ message, isOwn }) => {
  const formattedTime = format(new Date(message.timestamp), 'h:mm a');
  
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isOwn 
            ? 'bg-blue-500 text-white rounded-br-none' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none'
        }`}
      >
        {!isOwn && (
          <div className="font-medium text-xs text-blue-700 dark:text-blue-300 mb-1">
            {message.sender}
          </div>
        )}
        <p className="text-sm break-words">{message.text}</p>
        <div className={`text-xs mt-1 ${isOwn ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}>
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default MessageList;