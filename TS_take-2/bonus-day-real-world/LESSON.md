# 🌐 BONUS DAY: The Real World - Socket.io + TypeScript

## Welcome to the Final Boss! 🎉

You've mastered:

- **Day 1**: Discriminated Unions (The Guard)
- **Day 2**: Generics (The Factory)
- **Day 3**: Utility Types (The Toolkit)

Now it's time to **apply EVERYTHING** in a real-world scenario: building type-safe real-time applications with Socket.io!

This is where it all comes together. 🚀

---

## 🎯 Why Socket.io + TypeScript?

Real-time features are everywhere:

- 💬 Chat applications
- 🎮 Multiplayer games
- 📊 Live dashboards
- 🔔 Notifications
- 👥 Collaborative editing (like Google Docs)

**The Problem**: Socket.io events are strings. Easy to typo, easy to send wrong data types.

```typescript
// ❌ No type safety
socket.on("mesage", (data) => {
  // Typo! Should be 'message'
  console.log(data.txt); // What if it's 'text'?
});

socket.emit("user_join", 123); // Should this be a number or object?
```

**The Solution**: TypeScript + Socket.io types = Type-safe real-time apps!

```typescript
// ✅ Full type safety
socket.on("message", (data) => {
  // data is typed as { text: string; userId: string; timestamp: Date }
  console.log(data.text); // Auto-complete works!
});

socket.emit("user:join", { userId: "123", username: "Alice" }); // Checked!
```

---

## 🏗️ Setting Up Typed Socket.io

### Define Your Events

```typescript
// Server → Client events
interface ServerToClientEvents {
  message: (data: { text: string; userId: string; timestamp: Date }) => void;
  userJoined: (user: { id: string; username: string }) => void;
  userLeft: (userId: string) => void;
  typing: (userId: string) => void;
}

// Client → Server events
interface ClientToServerEvents {
  sendMessage: (text: string) => void;
  joinRoom: (roomId: string) => void;
  startTyping: () => void;
  stopTyping: () => void;
}

// Inter-server events (for clusters)
interface InterServerEvents {
  ping: () => void;
}

// Socket data (attached to each socket)
interface SocketData {
  userId: string;
  username: string;
  roomId?: string;
}
```

### Type the Server

```typescript
import { Server } from "socket.io";

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(3000);

io.on("connection", (socket) => {
  // socket.emit is now typed!
  socket.emit("userJoined", { id: "123", username: "Alice" }); // ✅
  // socket.emit('userJoined', { userId: '123' })  // ❌ Error! Wrong shape

  // socket.on is now typed!
  socket.on("sendMessage", (text) => {
    // text is string ✅
    console.log(text.toUpperCase());
  });

  // socket.data is typed!
  socket.data.userId = "123";
  socket.data.username = "Alice";
});
```

### Type the Client

```typescript
import { Socket } from "socket.io-client";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:3000"
);

// Emit with type checking
socket.emit("sendMessage", "Hello!"); // ✅
// socket.emit('sendMessage', 123)  // ❌ Error! Must be string

// Listen with typed callbacks
socket.on("message", (data) => {
  // data is fully typed!
  console.log(data.text);
  console.log(data.userId);
  console.log(data.timestamp.getTime());
});
```

---

## 🎮 Real-World Pattern: Chat Application

Let's build a type-safe chat app combining all 3 days of knowledge!

### Step 1: Define Message States (Day 1: Discriminated Unions)

```typescript
type MessageStatus =
  | { status: "sending"; tempId: string }
  | { status: "sent"; id: string; timestamp: Date }
  | { status: "failed"; error: string; tempId: string };

interface ChatMessage {
  text: string;
  userId: string;
  username: string;
  state: MessageStatus;
}

function renderMessage(msg: ChatMessage): string {
  switch (msg.state.status) {
    case "sending":
      return `⏳ ${msg.username}: ${msg.text} (Sending...)`;

    case "sent":
      return `✅ ${msg.username}: ${msg.text}`;

    case "failed":
      return `❌ ${msg.username}: ${msg.text} (Failed: ${msg.state.error})`;
  }
}
```

### Step 2: Generic Event Emitter (Day 2: Generics)

```typescript
class TypedEventEmitter<Events extends Record<string, any>> {
  private listeners: Partial<Record<keyof Events, Function[]>> = {};

  on<K extends keyof Events>(
    event: K,
    handler: (data: Events[K]) => void
  ): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(handler);
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    const handlers = this.listeners[event] || [];
    handlers.forEach((handler) => handler(data));
  }
}

// Usage:
interface ChatEvents {
  "message:received": ChatMessage;
  "user:joined": { userId: string; username: string };
  "user:left": { userId: string };
}

const emitter = new TypedEventEmitter<ChatEvents>();

emitter.on("message:received", (msg) => {
  // msg is typed as ChatMessage!
  console.log(msg.text);
});

emitter.emit("message:received", {
  text: "Hello",
  userId: "1",
  username: "Alice",
  state: { status: "sent", id: "msg_1", timestamp: new Date() },
});
```

### Step 3: Message DTOs (Day 3: Utility Types)

```typescript
interface FullMessage {
  id: string;
  text: string;
  userId: string;
  username: string;
  roomId: string;
  timestamp: Date;
  edited: boolean;
  editedAt?: Date;
  reactions: Record<string, string[]>;
}

// What the client sends (no id, timestamp, etc.)
type CreateMessage = Pick<FullMessage, "text" | "roomId">;

// What the server returns
type MessageResponse = Omit<FullMessage, "reactions"> & {
  reactions?: Record<string, string[]>;
};

// What the client can edit
type EditMessage = { id: string } & Partial<Pick<FullMessage, "text">>;

// Public message (hide internal IDs)
type PublicMessage = Omit<FullMessage, "userId" | "roomId">;
```

---

## 🔥 Advanced Pattern: Room Manager

Combining everything:

```typescript
// Room state (Day 1: Unions)
type RoomState =
  | { status: "empty" }
  | { status: "active"; users: string[]; messageCount: number }
  | { status: "full"; users: string[]; maxUsers: number };

// Generic room manager (Day 2: Generics)
class RoomManager<TUser extends { id: string }> {
  private rooms: Map<string, TUser[]> = new Map();

  joinRoom(roomId: string, user: TUser): void {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, []);
    }
    this.rooms.get(roomId)!.push(user);
  }

  leaveRoom(roomId: string, userId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      const index = room.findIndex((u) => u.id === userId);
      if (index !== -1) {
        room.splice(index, 1);
      }
    }
  }

  getRoomState(roomId: string, maxUsers: number = 10): RoomState {
    const room = this.rooms.get(roomId);

    if (!room || room.length === 0) {
      return { status: "empty" };
    }

    if (room.length >= maxUsers) {
      return {
        status: "full",
        users: room.map((u) => u.id),
        maxUsers,
      };
    }

    return {
      status: "active",
      users: room.map((u) => u.id),
      messageCount: 0, // Would track in real app
    };
  }
}

// Usage with utility types (Day 3)
interface FullUser {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
}

// Don't expose password in rooms!
type RoomUser = Omit<FullUser, "password" | "email">;

const manager = new RoomManager<RoomUser>();
manager.joinRoom("general", {
  id: "1",
  username: "Alice",
  avatar: "avatar1.png",
});
```

---

## 🎯 Full Example: Type-Safe Chat Server

```typescript
import { Server, Socket } from "socket.io";

// Events (Day 1 patterns)
interface ServerToClientEvents {
  "message:new": (message: ChatMessage) => void;
  "user:joined": (user: RoomUser) => void;
  "user:left": (userId: string) => void;
  "room:state": (state: RoomState) => void;
}

interface ClientToServerEvents {
  "message:send": (data: CreateMessage) => void;
  "room:join": (roomId: string) => void;
  "room:leave": () => void;
}

interface SocketData {
  userId: string;
  username: string;
  roomId?: string;
}

// Server
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  {},
  SocketData
>();

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("room:join", (roomId) => {
    // Set socket data
    socket.data.roomId = roomId;
    socket.join(roomId);

    // Notify room
    io.to(roomId).emit("user:joined", {
      id: socket.data.userId,
      username: socket.data.username,
      avatar: "default.png",
    });

    // Send room state
    const state: RoomState = {
      status: "active",
      users: [socket.data.userId],
      messageCount: 0,
    };
    socket.emit("room:state", state);
  });

  socket.on("message:send", (data) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    const message: ChatMessage = {
      text: data.text,
      userId: socket.data.userId,
      username: socket.data.username,
      state: {
        status: "sent",
        id: `msg_${Date.now()}`,
        timestamp: new Date(),
      },
    };

    io.to(roomId).emit("message:new", message);
  });

  socket.on("disconnect", () => {
    if (socket.data.roomId) {
      io.to(socket.data.roomId).emit("user:left", socket.data.userId);
    }
  });
});

io.listen(3000);
console.log("🚀 Server running on port 3000");
```

---

## 🎯 What You'll Build Today

In today's challenges, you'll:

1. ✅ Define typed Socket.io events
2. 💬 Build a type-safe chat message handler
3. 🎮 Create a multiplayer game state sync
4. 📊 Build a real-time dashboard
5. 🔥 **BOSS**: Complete chat application with rooms

---

## 🚀 Key Takeaways

You've learned to combine:

✅ **Discriminated Unions** for event states  
✅ **Generics** for reusable event handlers  
✅ **Utility Types** for DTOs and transformations  
✅ **Socket.io Types** for real-time safety

This is **production-ready** TypeScript! 🎉

---

<div align="center">

**"Real-time doesn't mean losing type safety. Master both."** 🌐

[Next: Final Challenge →](./CHALLENGE.md)

</div>
