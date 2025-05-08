import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface User {
  id: string;
  username: string;
  online: boolean;
  lastSeen?: string;
}

export interface Message {
  id: string;
  sender: string;
  senderId: string;
  text: string;
  timestamp: string;
}

interface ChatContextType {
  socket: Socket | null;
  currentUser: User | null;
  users: User[];
  messages: Message[];
  login: (username: string) => void;
  sendMessage: (message: string) => void;
  loginError: string | null;
  isConnected: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    const serverUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:3001' 
      : window.location.origin;
      
    const newSocket = io(serverUrl);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected:', newSocket.id);
      
      // If user was previously logged in, log them in again
      if (currentUser) {
        newSocket.emit('login', currentUser.username);
      }
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Handle login success
    socket.on('login_success', (data) => {
      const user = {
        id: data.id,
        username: data.username,
        online: true
      };
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      setLoginError(null);
      setUsers(data.users);
    });

    // Handle login error
    socket.on('login_error', (error) => {
      setLoginError(error);
    });

    // Handle new message
    socket.on('receive_message', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    // Handle user list updates
    socket.on('user_list', (updatedUsers) => {
      setUsers(updatedUsers);
    });

    // Handle user connections
    socket.on('user_connected', (user) => {
      setUsers(prevUsers => {
        const exists = prevUsers.some(u => u.id === user.id);
        if (exists) {
          return prevUsers.map(u => 
            u.id === user.id ? { ...u, online: true } : u
          );
        } else {
          return [...prevUsers, user];
        }
      });
    });

    // Handle user disconnections
    socket.on('user_disconnected', ({ id, lastSeen }) => {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === id ? { ...user, online: false, lastSeen } : user
        )
      );
    });

    return () => {
      socket.off('login_success');
      socket.off('login_error');
      socket.off('receive_message');
      socket.off('user_list');
      socket.off('user_connected');
      socket.off('user_disconnected');
    };
  }, [socket]);

  // Login function
  const login = useCallback((username: string) => {
    if (socket && username.trim()) {
      socket.emit('login', username);
    }
  }, [socket]);

  // Send message function
  const sendMessage = useCallback((message: string) => {
    if (socket && message.trim() && currentUser) {
      socket.emit('send_message', message);
    }
  }, [socket, currentUser]);

  return (
    <ChatContext.Provider value={{
      socket,
      currentUser,
      users,
      messages,
      login,
      sendMessage,
      loginError,
      isConnected
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};