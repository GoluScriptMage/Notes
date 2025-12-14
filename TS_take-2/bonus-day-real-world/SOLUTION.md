# 🎯 BONUS DAY SOLUTIONS

Here are the complete solutions with detailed explanations!

---

## 🔥 Challenge 1: Event Type Definitions

### The Problem

Socket.io events are just strings - no type safety by default. We need to make them type-safe!

### The Solution

```typescript
// Use discriminated unions for different alert types
type AlertNotification =
  | { type: "error"; message: string; code: number }
  | { type: "success"; message: string; duration: number }
  | { type: "warning"; message: string; dismissible: boolean };

interface ServerToClientEvents {
  alert: (notification: AlertNotification) => void;
}

interface ClientToServerEvents {
  subscribe: (data: { userId: string; topics: string[] }) => void;
  dismiss: (data: { notificationId: string }) => void;
}
```

### Why This Works

- **Discriminated Union**: The `type` field acts as a discriminator
- **Type Narrowing**: When you check `notification.type`, TypeScript knows exactly which fields exist
- **Type Safety**: Can't send wrong event structure

### Key Concept (Day 1)

This is the **same pattern** as the Guard challenge! The `type` field tells TypeScript which shape the data has.

---

## 💬 Challenge 2: Message State Machine

### The Problem

Chat messages go through multiple states. We need to track them safely.

### The Solution

```typescript
type MessageState =
  | { status: "sending"; tempId: string }
  | { status: "sent"; id: string; serverTimestamp: Date }
  | { status: "delivered"; id: string; deliveredTo: string[] }
  | { status: "read"; id: string; readBy: Record<string, Date> };

interface ChatMessage {
  text: string;
  senderId: string;
  state: MessageState;
}

function getMessageStatus(msg: ChatMessage): string {
  switch (msg.state.status) {
    case "sending":
      return "Sending...";

    case "sent":
      return "Sent ✓";

    case "delivered":
      return "Delivered ✓✓";

    case "read":
      const userCount = Object.keys(msg.state.readBy).length;
      return `Read ✓✓ by ${userCount} user${userCount !== 1 ? "s" : ""}`;
  }
}
```

### Why This Works

- **State Machine**: Each state has exactly the data it needs
- **Exhaustive Checking**: TypeScript ensures you handle all states
- **Type Safety**: Can't access `serverTimestamp` when status is "sending"

### Key Concept (Day 1)

This is a **state machine** pattern! Same as the traffic light bonus challenge.

---

## 🎮 Challenge 3: Generic Event Router

### The Problem

We need an event system that works with ANY event structure while staying type-safe.

### The Solution

```typescript
class EventRouter<Events extends Record<string, any>> {
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

  off<K extends keyof Events>(
    event: K,
    handler: (data: Events[K]) => void
  ): void {
    const handlers = this.listeners[event];
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    const handlers = this.listeners[event] || [];
    handlers.forEach((handler) => handler(data));
  }

  // BONUS!
  once<K extends keyof Events>(
    event: K,
    handler: (data: Events[K]) => void
  ): void {
    const onceWrapper = (data: Events[K]) => {
      handler(data);
      this.off(event, onceWrapper);
    };
    this.on(event, onceWrapper);
  }
}
```

### Why This Works

- **Generic Type Parameter**: `Events` can be ANY object of event types
- **Indexed Access**: `Events[K]` gets the exact data type for event `K`
- **Type Constraint**: `K extends keyof Events` ensures event names are valid

### Key Concept (Day 2)

This is **exactly like Collection class**! We're using generics to make it reusable with any event structure.

**The Magic**:

```typescript
interface GameEvents {
  "player:moved": { x: number; y: number };
  "player:scored": { points: number };
}

const router = new EventRouter<GameEvents>();

router.on("player:moved", (data) => {
  // data is { x: number; y: number } ✅
});

router.on("player:scored", (data) => {
  // data is { points: number } ✅
});
```

---

## 📊 Challenge 4: API Response Transformations

### The Problem

We have full user data, but need different views for different use cases.

### The Solution

```typescript
interface DatabaseUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: "admin" | "moderator" | "user";
  profile: {
    avatar: string;
    bio: string;
    joinedAt: Date;
  };
  settings: {
    notifications: boolean;
    privacy: "public" | "private";
  };
}

// 1. Hide sensitive data
type PublicUser = Omit<DatabaseUser, "passwordHash" | "email" | "settings">;

// 2. Minimal preview
type UserPreview = Pick<DatabaseUser, "id" | "username"> & {
  avatar: string;
};

// 3. Editable fields
type EditableProfile = {
  profile: {
    avatar: string;
    bio?: string;
    joinedAt: Date;
  };
  settings?: {
    notifications: boolean;
    privacy: "public" | "private";
  };
};

// 4. Admin view with extra data
type AdminView = DatabaseUser & {
  lastLogin: Date;
};
```

### Why This Works

- **Omit**: Removes fields you don't want to expose
- **Pick**: Selects only the fields you need
- **Partial**: Makes fields optional for updates
- **Intersection (&)**: Adds extra fields

### Key Concept (Day 3)

This is the **Toolkit** in action! Each utility type is a tool for reshaping data.

**Use Cases**:

- `PublicUser`: API response for profile pages (hide passwords!)
- `UserPreview`: List views (minimize data transfer)
- `EditableProfile`: Update forms (only allow certain fields)
- `AdminView`: Admin panel (show everything + extra)

---

## 🔥 BOSS LEVEL: Type-Safe Room System

This combines **EVERYTHING**!

### Part 1: Room States (Day 1)

```typescript
type RoomStatus =
  | { status: "waiting"; minUsers: number; currentUsers: string[] }
  | { status: "active"; users: string[]; messageCount: number; startedAt: Date }
  | { status: "closed"; reason: string; closedAt: Date };
```

**Why**: Each room state has exactly the data it needs. "waiting" has `minUsers`, "active" has `messageCount`, etc.

### Part 2: Generic Room Manager (Day 2)

```typescript
class RoomManager<TUser extends { id: string; username: string }> {
  private rooms: Map<string, TUser[]> = new Map();
  private roomMetadata: Map<
    string,
    { messageCount: number; startedAt?: Date }
  > = new Map();

  createRoom(id: string): void {
    this.rooms.set(id, []);
    this.roomMetadata.set(id, { messageCount: 0 });
  }

  addUser(roomId: string, user: TUser): void {
    if (!this.rooms.has(roomId)) {
      this.createRoom(roomId);
    }
    const room = this.rooms.get(roomId)!;
    if (!room.find((u) => u.id === user.id)) {
      room.push(user);
      const metadata = this.roomMetadata.get(roomId)!;
      if (room.length === 1) {
        metadata.startedAt = new Date();
      }
    }
  }

  removeUser(roomId: string, userId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      const index = room.findIndex((u) => u.id === userId);
      if (index !== -1) {
        room.splice(index, 1);
      }
    }
  }

  getRoomStatus(roomId: string, minUsers: number = 2): RoomStatus {
    const room = this.rooms.get(roomId);
    const metadata = this.roomMetadata.get(roomId);

    if (!room || room.length === 0) {
      return { status: "closed", reason: "No users", closedAt: new Date() };
    }

    const userIds = room.map((u) => u.id);

    if (room.length < minUsers) {
      return { status: "waiting", minUsers, currentUsers: userIds };
    }

    return {
      status: "active",
      users: userIds,
      messageCount: metadata?.messageCount || 0,
      startedAt: metadata?.startedAt || new Date(),
    };
  }

  getAllRooms(): Map<string, TUser[]> {
    return new Map(this.rooms);
  }

  incrementMessageCount(roomId: string): void {
    const metadata = this.roomMetadata.get(roomId);
    if (metadata) {
      metadata.messageCount++;
    }
  }
}
```

**Why**: Generic `TUser` means this works with ANY user type (as long as it has `id` and `username`).

### Part 3: Message DTOs (Day 3)

```typescript
interface FullMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  edited: boolean;
  editedAt?: Date;
  attachments: string[];
}

// Client sends minimal data
type CreateMessageDTO = Pick<FullMessage, "roomId" | "text"> & {
  attachments?: string[];
};

// Server hides senderId
type MessageResponse = Omit<FullMessage, "senderId">;

// Only allow editing text
type EditMessageDTO = Pick<FullMessage, "id" | "text">;

// Preview for lists
type MessagePreview = Pick<FullMessage, "id" | "senderName" | "timestamp"> & {
  textPreview: string;
};
```

**Why**: Different views for different purposes. API design 101!

### Part 4: Complete Integration

```typescript
function handleMessage(
  manager: RoomManager<RoomUser>,
  roomId: string,
  dto: CreateMessageDTO,
  userId: string,
  username: string
): MessageResponse | { error: string } {
  // Check room status (Day 1: discriminated union)
  const status = manager.getRoomStatus(roomId);

  if (status.status !== "active") {
    return { error: `Cannot send message: room is ${status.status}` };
  }

  // Create full message
  const fullMessage: FullMessage = {
    id: `msg_${Date.now()}`,
    roomId: dto.roomId,
    senderId: userId,
    senderName: username,
    text: dto.text,
    timestamp: new Date(),
    edited: false,
    attachments: dto.attachments || [],
  };

  manager.incrementMessageCount(roomId);

  // Transform to response (Day 3: Omit senderId)
  const { senderId, ...response } = fullMessage;
  return response;
}
```

**Why**: This function uses ALL three days of knowledge!

- **Day 1**: Check room status with exhaustive checking
- **Day 2**: Works with generic RoomManager
- **Day 3**: Transforms FullMessage to MessageResponse

---

## 🎓 What You Learned

### Day 1 Applied

✅ Used discriminated unions for alert types  
✅ Built a message state machine  
✅ Created room status states

### Day 2 Applied

✅ Built a generic EventRouter  
✅ Created a generic RoomManager  
✅ Made reusable type-safe systems

### Day 3 Applied

✅ Used Omit to hide sensitive data  
✅ Used Pick to select specific fields  
✅ Combined utility types for complex transformations

---

## 🚀 Real-World Impact

These patterns are used in:

- **Discord**: Type-safe event system
- **Slack**: Room management
- **WhatsApp**: Message state tracking
- **Google Docs**: Real-time collaboration
- **Figma**: Multiplayer editing

You just learned **production-level** TypeScript! 🎉

---

## 🎯 Next Steps

Want to go deeper?

1. **Add authentication**: Extend RoomManager with auth checks
2. **Add persistence**: Connect to a database
3. **Add rate limiting**: Prevent spam
4. **Add reactions**: Use Record<string, string[]> for emoji reactions
5. **Add typing indicators**: Use EventRouter for real-time typing status

---

<div align="center">

**"You didn't just learn TypeScript. You learned to build real systems."** 🔥

Congratulations! 🏆

</div>
