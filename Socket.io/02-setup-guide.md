# Part 2: The Setup ⚙️

> "You can't build a house without a foundation. Let's set up your Socket.io server and React client the RIGHT way."

## 🎯 Learning Objectives
-
By the end of this section, you will:

- ✅ Set up a Socket.io server with Express
- ✅ Understand why we need the `http` module
- ✅ Connect a React client without infinite loops
- ✅ Test the connection with a simple "ping-pong" example

---

## 📁 Project Structure

First, let's organize your CodeSync project:

```
codesync-project/
├── server/              # Backend (Node.js + Socket.io)
│   ├── package.json
│   └── index.js
└── client/              # Frontend (React + Socket.io-client)
    ├── package.json
    └── src/
        ├── App.jsx
        └── ...
```

---

## 🖥️ Part A: Server Setup (Node.js + Express)

### Step 1: Initialize the Server

```bash
mkdir codesync-project
cd codesync-project
mkdir server
cd server
npm init -y
```

### Step 2: Install Dependencies

```bash
npm install express socket.io cors
```

**What each does:**

- `express`: Web server framework
- `socket.io`: WebSocket library (server-side)
- `cors`: Allows frontend (port 3000) to talk to backend (port 3001)

---

### Step 3: Create `server/index.js`

```javascript
// ============================================
// MINIMAL SOCKET.IO SERVER SETUP
// ============================================

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// 1. Create Express app
const app = express();
app.use(cors());

// 2. Create HTTP server (wrapping Express)
const server = http.createServer(app);

// 3. Attach Socket.io to the HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // React app URL
    methods: ["GET", "POST"],
  },
});
ß
// 4. Listen for client connections
io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  // Listen for 'ping' event from client
  socket.on("ping", () => {
    console.log("📩 Received ping from client");
    socket.emit("pong", { message: "Hello from server!" });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// 5. Start the server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

---

### 🤔 Why Do We Need the `http` Module?

**Question:** Why can't we just do `const io = new Server(app)`?

**Answer:** Socket.io needs access to the **low-level HTTP server**, not just Express.

#### The Hidden Truth:

```javascript
// ❌ This DOESN'T work:
const app = express();
const io = new Server(app); // Error! app is not an HTTP server

// ✅ This WORKS:
const app = express();
const server = http.createServer(app); // Wrap Express in HTTP
const io = new Server(server); // Now Socket.io can attach
```

**Why?**

- Express is a **framework** (high-level)
- Socket.io needs the **raw HTTP server** (low-level) to hijack the connection
- `http.createServer(app)` gives Socket.io the underlying server while keeping Express routes working

**Visual:**

```
┌─────────────────┐
│  Socket.io      │ ← Needs the HTTP server
└────────┬────────┘
         │
┌────────▼────────┐
│  HTTP Server    │ ← Created by http.createServer()
└────────┬────────┘
         │
┌────────▼────────┐
│  Express App    │ ← Handles REST routes
└─────────────────┘
```

---

### Step 4: Run the Server

```bash
node index.js
```

You should see:

```
🚀 Server running on http://localhost:3001
```

**Keep this running!** Open a new terminal for the client setup.

---

## ⚛️ Part B: Client Setup (React)

### Step 1: Create React App (if you haven't)

```bash
# In the codesync-project folder (not inside server/)
npx create-react-app client
cd client
```

### Step 2: Install Socket.io Client

```bash
npm install socket.io-client
```

---

### Step 3: Create the Connection in `src/App.jsx`

```javascript
// ============================================
// REACT CLIENT WITH SOCKET.IO
// ============================================

import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";

// ⚠️ IMPORTANT: Define socket OUTSIDE the component!
const socket = io("http://localhost:3001");

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Listen for 'pong' from server
    socket.on("pong", (data) => {
      console.log("📩 Received from server:", data);
      setMessage(data.message);
    });

    // Cleanup: Remove listener when component unmounts
    return () => {
      socket.off("pong");
    };
  }, []); // ✅ Empty dependency array = runs once

  const sendPing = () => {
    console.log("📤 Sending ping to server...");
    socket.emit("ping");
  };

  return (
    <div className="App">
      <h1>CodeSync Client</h1>
      <button onClick={sendPing}>Send Ping to Server</button>
      {message && <p>Server says: {message}</p>}
    </div>
  );
}

export default App;
```

---

### 🚨 Critical: Avoiding the Infinite Loop Trap

#### ❌ WRONG WAY (Creates infinite connections):

```javascript
function App() {
  const socket = io('http://localhost:3001'); // ❌ BAD!
  // This runs on every render = 100s of connections!

  useEffect(() => {
    socket.on('pong', ...);
  }, []);
  // ...
}
```

**Why wrong?** Every time React re-renders, a NEW socket is created!

---

#### ✅ RIGHT WAY #1: Define Outside Component

```javascript
// Define ONCE outside the component
const socket = io('http://localhost:3001');

function App() {
  useEffect(() => {
    socket.on('pong', ...);
    return () => socket.off('pong');
  }, []); // Runs once
}
```

**Why right?** Socket is created **once** when the module loads.

---

#### ✅ RIGHT WAY #2: Use `useRef` (Advanced)

```javascript
import { useRef, useEffect } from 'react';

function App() {
  const socket = useRef(null);

  useEffect(() => {
    // Create socket only once
    socket.current = io('http://localhost:3001');

    socket.current.on('pong', ...);

    // Cleanup
    return () => {
      socket.current.disconnect();
    };
  }, []); // Runs once
}
```

**Why right?** `useRef` preserves the socket across renders.

---

### Step 4: Run the React App

```bash
npm start
```

React will open `http://localhost:3000`.

---

## 🧪 Testing the Connection

### What You Should See:

1. **Server terminal:**

   ```
   ✅ A user connected: abc123xyz
   ```

2. **Browser console (React):**

   ```
   Socket connected
   ```

3. **Click "Send Ping" button:**
   - Server terminal: `📩 Received ping from client`
   - Browser: `📩 Received from server: { message: 'Hello from server!' }`

---

## 🔍 Debugging Common Issues

### Issue 1: CORS Error

**Error:** `Access to XMLHttpRequest... blocked by CORS policy`

**Fix:** Add CORS to server:

```javascript
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
```

---

### Issue 2: Connection Refused

**Error:** `WebSocket connection to 'ws://localhost:3001' failed`

**Fix:**

- Make sure server is running (`node index.js`)
- Check the port number matches (3001)
- Check firewall settings

---

### Issue 3: Infinite Connections

**Symptom:** Server shows 10+ connections immediately

**Fix:** Move `socket = io()` **outside** the component or use `useRef`.

---

## 📊 Connection Lifecycle

Understanding when connections happen:

```
USER OPENS BROWSER
    │
    ├─> React App Loads
    │   └─> const socket = io() runs
    │       └─> Handshake with server
    │           └─> io.on('connection') fires
    │
    ├─> useEffect runs
    │   └─> socket.on('pong', ...) set up
    │
USER CLICKS "Send Ping"
    │
    ├─> socket.emit('ping') runs
    │   └─> Server receives it
    │       └─> socket.on('ping') fires
    │           └─> Server emits 'pong'
    │               └─> Client receives it
    │                   └─> socket.on('pong') fires
    │                       └─> setMessage() updates UI
```

---

## 🎯 Checkpoint Challenge

Before moving to Part 3, modify the code to:

1. **Add a "disconnect" button** that calls `socket.disconnect()`
2. **Show connection status** ("Connected" / "Disconnected")
3. **Count how many pings you've sent**

**Starter code:**

```javascript
function App() {
  const [connected, setConnected] = useState(false);
  const [pingCount, setPingCount] = useState(0);

  useEffect(() => {
    socket.on("connect", () => {
      setConnected(true);
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      setConnected(false);
      console.log("Disconnected from server");
    });

    // Your code here...
  }, []);

  // Your handlers here...

  return (
    <div>
      <h1>CodeSync Client</h1>
      <p>Status: {connected ? "🟢 Connected" : "🔴 Disconnected"}</p>
      <p>Pings sent: {pingCount}</p>
      {/* Your buttons here */}
    </div>
  );
}
```

---

## 🎓 Key Takeaways

- ✅ **Server:** `http.createServer(app)` is required for Socket.io
- ✅ **Client:** Define socket **outside** component or use `useRef`
- ✅ **useEffect:** Always use empty `[]` dependency array for connection
- ✅ **Cleanup:** Use `return () => socket.off()` to prevent memory leaks
- ✅ **CORS:** Must be configured if client and server are on different ports

---

## 🚀 Ready for Part 3?

You now have:

- ✅ Working Socket.io server
- ✅ React client that connects properly
- ✅ Bidirectional communication (ping-pong)
- ✅ Understanding of `http` module necessity

**Next up:** `03-codesync-implementation.md` where you'll build the actual **real-time code synchronization** for CodeSync!

This is where it gets exciting - you'll implement the core logic:

- User types → emit `code-change`
- Server broadcasts → all others receive `code-update`
- Multiple users editing simultaneously

Let's build something real! 🔥
