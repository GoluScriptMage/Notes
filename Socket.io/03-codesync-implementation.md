# Part 3: The Core Logic - CodeSync Implementation 💻

> "Theory is good. Code is better. Let's build real-time code synchronization from scratch."

## 🎯 Learning Objectives

By the end of this section, you will:

- ✅ Implement real-time code synchronization
- ✅ Master `socket.broadcast.emit()` for broadcasting to others
- ✅ Handle multiple users in the same coding session
- ✅ Understand rooms for different code sessions
- ✅ Handle edge cases (user disconnect, errors)

---

## 🏗️ What We're Building

**CodeSync Feature:** When User A types code, User B sees it instantly.

```
USER A (Browser 1)              SERVER              USER B (Browser 2)
      |                           |                        |
      | Types: console.log("Hi")  |                        |
      |-------------------------->|                        |
      |  emit('code-change')      |                        |
      |                           |                        |
      |                           | Broadcasts to B        |
      |                           |----------------------->|
      |                           |  emit('code-update')   |
      |                           |                        |
      |                           |                        | Editor updates
      |                           |                        | Shows: console.log("Hi")
```

---

## 🎨 The Three Key Events

For CodeSync, we need **three custom events:**

### 1. **`code-change`** (Client → Server)

- **Who emits:** User who types
- **What it carries:** The new code + metadata
- **Who listens:** Server

### 2. **`code-update`** (Server → Other Clients)

- **Who emits:** Server
- **What it carries:** The new code
- **Who listens:** All other users in the room

### 3. **`get-code`** (Optional: Initial sync)

- **Who emits:** New user joining
- **What it carries:** Request for current code
- **Who listens:** Server

---

## 🖥️ Part A: Server Implementation

### Complete `server/index.js`

```javascript
// ============================================
// CODESYNC SERVER - REAL-TIME CODE EDITOR
// ============================================

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Store current code for each room
// In production, use Redis or a database
const roomCodeStore = {};

// ============================================
// SOCKET.IO CONNECTION HANDLER
// ============================================

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // --------------------------------------------
  // EVENT 1: User joins a room
  // --------------------------------------------
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`👤 ${socket.id} joined room: ${roomId}`);

    // Send current code to the new user
    const currentCode = roomCodeStore[roomId] || "";
    socket.emit("room-joined", {
      roomId,
      code: currentCode,
      message: `You joined room ${roomId}`,
    });

    // Notify others in the room
    socket.to(roomId).emit("user-joined", {
      userId: socket.id,
      message: "A new user joined the room",
    });
  });

  // --------------------------------------------
  // EVENT 2: User types code (code-change)
  // --------------------------------------------
  socket.on("code-change", (data) => {
    const { roomId, code, userId } = data;

    console.log(`📝 Code change in room ${roomId} by ${userId}`);

    // Update the room's code in memory
    roomCodeStore[roomId] = code;

    // ⚡ CRITICAL: Broadcast to EVERYONE ELSE in the room
    // (Not back to the sender!)
    socket.to(roomId).emit("code-update", {
      code,
      userId,
      timestamp: Date.now(),
    });
  });

  // --------------------------------------------
  // EVENT 3: User requests current code
  // --------------------------------------------
  socket.on("get-code", (roomId) => {
    const currentCode = roomCodeStore[roomId] || "";
    socket.emit("current-code", currentCode);
  });

  // --------------------------------------------
  // EVENT 4: User disconnects
  // --------------------------------------------
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);

    // Notify all rooms this user was in
    // (In production, track which rooms user is in)
    io.emit("user-left", {
      userId: socket.id,
      message: "A user left",
    });
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 CodeSync Server running on http://localhost:${PORT}`);
});
```

---

## 🔍 Understanding `socket.broadcast.emit()` vs `socket.to()`

### The Three Ways to Emit:

```javascript
// 1. Send to THIS client only
socket.emit("event", data);

// 2. Send to EVERYONE in a room EXCEPT sender
socket.to(roomId).emit("event", data);

// 3. Send to EVERYONE (including sender)
io.emit("event", data);

// 4. Send to EVERYONE in a room (including sender)
io.to(roomId).emit("event", data);

// 5. Send to EVERYONE EXCEPT sender (no specific room)
socket.broadcast.emit("event", data);
```

### Visual Diagram:

```
ROOM: "room-1"
├── Client A (sender)
├── Client B
└── Client C

socket.emit('msg', data)
    → Only Client A receives

socket.to('room-1').emit('msg', data)
    → Client B and C receive (NOT A)

io.to('room-1').emit('msg', data)
    → All (A, B, C) receive

socket.broadcast.emit('msg', data)
    → Everyone EXCEPT A (across ALL rooms)
```

---

## ⚛️ Part B: React Client Implementation

### Complete `client/src/App.jsx`

```javascript
// ============================================
// CODESYNC CLIENT - REACT
// ============================================

import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:3001");
const ROOM_ID = "room-1"; // In production, user chooses this

function App() {
  const [code, setCode] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState([]);

  // Prevent emitting when receiving updates from others
  const isRemoteChange = useRef(false);

  // ============================================
  // SOCKET CONNECTION & LISTENERS
  // ============================================

  useEffect(() => {
    // Connection status
    socket.on("connect", () => {
      setIsConnected(true);
      console.log("✅ Connected to server");

      // Join room on connect
      socket.emit("join-room", ROOM_ID);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("❌ Disconnected from server");
    });

    // --------------------------------------------
    // Room joined - receive initial code
    // --------------------------------------------
    socket.on("room-joined", (data) => {
      console.log("🎉", data.message);
      isRemoteChange.current = true; // Mark as remote change
      setCode(data.code);
    });

    // --------------------------------------------
    // Receive code updates from other users
    // --------------------------------------------
    socket.on("code-update", (data) => {
      console.log("📩 Code update from", data.userId);
      isRemoteChange.current = true; // Mark as remote change
      setCode(data.code);
    });

    // --------------------------------------------
    // User notifications
    // --------------------------------------------
    socket.on("user-joined", (data) => {
      console.log("👤", data.message);
    });

    socket.on("user-left", (data) => {
      console.log("👋", data.message);
    });

    // Cleanup
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("room-joined");
      socket.off("code-update");
      socket.off("user-joined");
      socket.off("user-left");
    };
  }, []);

  // ============================================
  // HANDLE CODE CHANGES (User typing)
  // ============================================

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);

    // Only emit if this is a LOCAL change (not from server)
    if (!isRemoteChange.current) {
      socket.emit("code-change", {
        roomId: ROOM_ID,
        code: newCode,
        userId: socket.id,
      });
    }

    // Reset flag
    isRemoteChange.current = false;
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="App">
      <header>
        <h1>🚀 CodeSync - Real-Time Code Editor</h1>
        <div className="status">
          {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
        </div>
        <div className="room-info">
          Room: <strong>{ROOM_ID}</strong>
        </div>
      </header>

      <main>
        <textarea
          value={code}
          onChange={handleCodeChange}
          placeholder="Start typing code..."
          className="code-editor"
          spellCheck="false"
        />
      </main>

      <footer>
        <p>Open this in multiple browser windows to see real-time sync!</p>
      </footer>
    </div>
  );
}

export default App;
```

---

### Add Some Basic Styles (`src/App.css`)

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.App {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  color: #fff;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

header {
  background: #2d2d2d;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

header h1 {
  font-size: 24px;
  flex: 1;
}

.status {
  font-size: 14px;
  padding: 8px 16px;
  background: #3d3d3d;
  border-radius: 20px;
}

.room-info {
  font-size: 14px;
  padding: 8px 16px;
  background: #0066cc;
  border-radius: 20px;
}

main {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

.code-editor {
  width: 100%;
  height: 100%;
  background: #1e1e1e;
  color: #d4d4d4;
  border: 1px solid #3d3d3d;
  border-radius: 8px;
  padding: 20px;
  font-family: "Courier New", monospace;
  font-size: 16px;
  line-height: 1.6;
  resize: none;
  outline: none;
}

.code-editor:focus {
  border-color: #0066cc;
}

footer {
  background: #2d2d2d;
  padding: 15px;
  text-align: center;
  font-size: 14px;
  color: #888;
}
```

---

## 🧪 Testing CodeSync

### Step 1: Start the Server

```bash
cd server
node index.js
```

### Step 2: Start React (Terminal 2)

```bash
cd client
npm start
```

### Step 3: Open Multiple Windows

1. Open `http://localhost:3000` in Chrome
2. Open `http://localhost:3000` in Firefox (or another Chrome window)
3. Type in **one window** → See it appear in **the other**! ⚡

---

## 🔥 The Magic Moment

When you type in Window 1:

```
WINDOW 1 (Chrome)          SERVER                WINDOW 2 (Firefox)
     |                       |                          |
     | User types "hello"    |                          |
     |---------------------->|                          |
     | emit('code-change')   |                          |
     |                       |                          |
     |                       | socket.to(room)         |
     |                       |------------------------>|
     |                       | emit('code-update')     |
     |                       |                          |
     |                       |                          | ✨ Shows "hello"
```

**You just built real-time collaboration!** 🎉

---

## 🛡️ Handling Edge Cases

### Issue 1: Infinite Loop (Cursor Jumps)

**Problem:** When you receive code from server, it triggers `onChange`, which emits again!

**Solution:** Use `isRemoteChange` flag:

```javascript
const isRemoteChange = useRef(false);

socket.on('code-update', (data) => {
  isRemoteChange.current = true; // Mark as remote
  setCode(data.code);
});

const handleCodeChange = (e) => {
  setCode(e.target.value);

  if (!isRemoteChange.current) {
    socket.emit('code-change', ...); // Only emit if local
  }

  isRemoteChange.current = false; // Reset
};
```

---

### Issue 2: Race Conditions

**Problem:** User A and User B type at the same time → conflicts!

**Solution (Advanced):**

- Use Operational Transformation (OT) or CRDTs
- Libraries: Yjs, ShareDB, Automerge
- For now: "Last write wins" (good enough for learning)

---

### Issue 3: Memory Leak (Too Many Listeners)

**Problem:** Every re-render adds new listeners.

**Solution:** Always clean up in `useEffect`:

```javascript
useEffect(() => {
  socket.on("event", handler);

  return () => {
    socket.off("event", handler); // ✅ Cleanup
  };
}, []);
```

---

## 🎯 Bonus Features (Try These!)

### 1. Add Cursor Position Sync

```javascript
// Client
const handleSelectionChange = () => {
  const textarea = textareaRef.current;
  socket.emit("cursor-move", {
    roomId: ROOM_ID,
    start: textarea.selectionStart,
    end: textarea.selectionEnd,
  });
};

// Server
socket.on("cursor-move", (data) => {
  socket.to(data.roomId).emit("cursor-update", data);
});
```

---

### 2. Show Active Users

```javascript
// Server: Track users in room
const roomUsers = {};

socket.on("join-room", (roomId) => {
  if (!roomUsers[roomId]) roomUsers[roomId] = [];
  roomUsers[roomId].push(socket.id);

  io.to(roomId).emit("users-update", roomUsers[roomId]);
});
```

---

### 3. Add Username

```javascript
// Client
socket.emit("join-room", {
  roomId: ROOM_ID,
  username: "Alice",
});

// Server
socket.on("join-room", (data) => {
  socket.username = data.username;
  socket.join(data.roomId);

  socket.to(data.roomId).emit("user-joined", {
    username: data.username,
  });
});
```

---

## 🎓 Key Takeaways

- ✅ **`socket.to(roomId).emit()`** broadcasts to room (except sender)
- ✅ **Use `isRemoteChange` flag** to prevent emit loops
- ✅ **Rooms** let you have isolated code sessions
- ✅ **In-memory store** works for demos; use Redis for production
- ✅ **Clean up listeners** in `useEffect` return function

---

## 🚀 Ready for Part 4?

You've built a working real-time code editor! Now let's test your understanding.

**Next up:** `04-exam.md` where I'll give you **3 real-world scenarios** and you tell me which Socket.io method to use.

This is where you prove you understand the "why" behind the code! 💪
