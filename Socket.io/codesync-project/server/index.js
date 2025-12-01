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

// Step 3. Create Socket.io Server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Listen for client connection
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // listen for ping event from client
  socket.on("ping", (data) => {
    console.log(`Ping received from ${socket.id}: ${data}`);

    // responding to ping event
    socket.emit("pong", { message: "Pong received!" });
  });

  // disconnect event
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
