const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// Step 1. Create express App
const app = express(); // this is manager
app.use(cors());

// Step 2. Create http server
// http is the main building
// So we are telling manager to work inside the building
const server = http.createServer(app);

// Code saved by room id
const roomCode = {};

// user joined
let roomUsers = {};

// Step 3. Create Socket.io Server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// add user to roomUsers Obj
const addUserToRoom = (roomId, userId) => {
  // Giving the room id if not present
  if (!roomUsers[roomId]) {
    // Create the set for room id if not exist
    roomUsers[roomId] = new Set();
  }
  // adding userId to roomUsers set
  roomUsers[roomId].add(userId);
};

// remove user to roomUser obj
const removeUserFromRoom = (roomId, userId) => {
  if (roomUsers[roomId]) {
    // deleting the user from the room
    roomUsers[roomId].delete(userId);
  }
  console.log("Deleted user from room:", roomId);
};

// Listen for client connection
io.on("connection", (socket) => {
  socket.on("connect", () => {
    console.log(`User joined: ${socket.id}`);
  });

  // Join a room
  socket.on("join-room", (roomId) => {
    // socket join the room
    socket.join(roomId);

    // Add user to roomUsers
    addUserToRoom(roomId, socket.id);

    const currentCode = roomCode[roomId] || "";

    /// giving the code details to the user that joined
    socket.emit("room-joined", {
      code: currentCode,
      roomId,
      userId: socket.id,
      message: `You joined room ${roomId}`,
    });

    // add user to room
    socket.to(roomId).emit("user-joined", {
      userId: socket.id,
      message: `A user joined room ${roomId} with ID: ${socket.id}`,
    });
  });

  // Listen for code changes
  socket.on("code-change", ({ roomId, code, UserId }) => {
    // update the code for room
    roomCode[roomId] = code;

    // Tell others in the room about the code change
    socket
      .to(roomId)
      .emit("code-update", { code, userId: socket.id, timeStamp: Date.now() });
  });

  // Get the current code to get in sync
  socket.on("get-code", (roomId) => {
    const currentCode = roomCode[roomId] || "";
    socket.emit("code-update", {
      code: currentCode,
      timeStamp: Date.now(),
    });
  });

  // handle user disconnect
  socket.on("disconnect", () => {
    // Check if user in the room
    for (const roomId in roomUsers) {
      const roomUser = roomUsers[roomId];

      if (roomUser.has(socket.id)) {
        removeUserFromRoom(roomId, socket.id);

        // Notify others that user logged out
        io.to(roomId).emit("user-left", {
          message: `User with ID: ${socket.id} has left the room.`,
        });
      }
    }

    // remove user from room
    console.log(`User Left: ${socket.id}`);
  });
});

// Start the server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
