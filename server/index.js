import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve static files from the dist directory
app.use(express.static(path.join(process.cwd(), 'dist')));

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

// Store connected users
const users = new Map();

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);
  
  // Handle user login
  socket.on('login', (username) => {
    // Check if username is already taken by an active user
    const existingUser = Array.from(users.values()).find(
      user => user.username === username && user.online
    );
    
    if (existingUser) {
      socket.emit('login_error', 'Username already taken');
      return;
    }
    
    // Store user information
    users.set(socket.id, {
      id: socket.id,
      username,
      online: true,
      lastSeen: new Date().toISOString()
    });
    
    // Send success response to the user
    socket.emit('login_success', {
      id: socket.id,
      username,
      users: Array.from(users.values())
    });
    
    // Broadcast to all clients that a new user has joined
    socket.broadcast.emit('user_connected', {
      id: socket.id,
      username,
      online: true,
      lastSeen: new Date().toISOString()
    });
    
    // Send the updated user list to all clients
    io.emit('user_list', Array.from(users.values()));
    
    console.log(`${username} logged in`);
  });
  
  // Handle chat messages
  socket.on('send_message', (message) => {
    const user = users.get(socket.id);
    if (!user) return;
    
    const messageData = {
      id: Date.now().toString(),
      sender: user.username,
      senderId: socket.id,
      text: message,
      timestamp: new Date().toISOString()
    };
    
    // Broadcast message to all connected clients
    io.emit('receive_message', messageData);
  });
  
  // Handle disconnections
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      user.online = false;
      user.lastSeen = new Date().toISOString();
      console.log(`${user.username} disconnected`);
      io.emit('user_disconnected', {
        id: socket.id,
        lastSeen: user.lastSeen
      });
      io.emit('user_list', Array.from(users.values()));
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});