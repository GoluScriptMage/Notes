// Example: Basic Socket.io Setup with TypeScript
// This shows how to define and use typed Socket.io events

/**
 * THE CONCEPT:
 * Socket.io is like a two-way walkie-talkie between server and client.
 * TypeScript helps us ensure both sides are "speaking the same language"!
 */

// ============================================
// STEP 1: Define your event contracts
// ============================================

// Events the SERVER can send TO the client
interface ServerToClientEvents {
  // Server says "here's a new message"
  newMessage: (data: {
    text: string;
    username: string;
    timestamp: Date;
  }) => void;

  // Server says "user joined the chat"
  userJoined: (username: string) => void;

  // Server says "user left the chat"
  userLeft: (username: string) => void;
}

// Events the CLIENT can send TO the server
interface ClientToServerEvents {
  // Client says "I want to send a message"
  sendMessage: (text: string) => void;

  // Client says "I'm joining with this username"
  join: (username: string) => void;
}

// Data attached to each socket connection
interface SocketData {
  username: string;
  joinedAt: Date;
}

// ============================================
// STEP 2: Use types in server (example code)
// ============================================

/*
import { Server } from 'socket.io';

const io = new Server<
  ClientToServerEvents,  // What client can send
  ServerToClientEvents,  // What server can send
  {},                    // Inter-server events (for clusters)
  SocketData            // Data on each socket
>(3000);

io.on('connection', (socket) => {
  console.log('New connection!');

  // ✅ Typed event handler
  socket.on('join', (username) => {
    // username is automatically typed as string!
    socket.data.username = username;
    socket.data.joinedAt = new Date();
    
    // ✅ Typed emit
    io.emit('userJoined', username);
  });

  socket.on('sendMessage', (text) => {
    // text is automatically typed as string!
    io.emit('newMessage', {
      text,
      username: socket.data.username,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    io.emit('userLeft', socket.data.username);
  });
});
*/

// ============================================
// STEP 3: Use types in client (example code)
// ============================================

/*
import { io, Socket } from 'socket.io-client';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3000');

// ✅ Typed emit
socket.emit('join', 'Alice');
socket.emit('sendMessage', 'Hello World!');

// ✅ Typed event handlers
socket.on('newMessage', (data) => {
  // data is typed as { text: string; username: string; timestamp: Date }
  console.log(`${data.username}: ${data.text}`);
});

socket.on('userJoined', (username) => {
  // username is typed as string
  console.log(`${username} joined!`);
});
*/

// ============================================
// THE BENEFIT
// ============================================

console.log(`
✨ What TypeScript gives you:

1. Auto-complete for event names
   - No more typos like 'mesage' instead of 'message'

2. Auto-complete for event data
   - TypeScript knows exactly what fields exist

3. Compile-time errors
   - Can't send wrong data types
   - Can't forget required fields

4. Refactoring safety
   - Change event structure in one place
   - TypeScript catches all usages that need updates

This is the foundation for building type-safe real-time apps! 🚀
`);

export { ServerToClientEvents, ClientToServerEvents, SocketData };
