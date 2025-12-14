# 🎯 BONUS DAY CHALLENGES: Real-Time Applications

Time to put **EVERYTHING** you've learned into action!

These challenges will use Socket.io patterns, but focus on **TypeScript mastery** from Days 1-3.

---

## 🎮 Challenge Structure

Each challenge builds on the previous one:

1. **Challenge 1**: Define typed events (Foundation)
2. **Challenge 2**: Message handler with state (Day 1 Applied)
3. **Challenge 3**: Generic event router (Day 2 Applied)
4. **Challenge 4**: DTO transformations (Day 3 Applied)
5. **BOSS LEVEL**: Full chat system (Everything Combined!)

---

## 🔥 Challenge 1: Event Type Definitions

**The Setup**: You're building a notification system that sends different types of alerts.

**Your Task**: Define strongly-typed Socket.io events using **discriminated unions** (Day 1 skill).

### Requirements:

Create event interfaces for:

- **Server → Client**: Three notification types

  - `"alert"`: Error notification with `{ type: "error", message: string, code: number }`
  - `"alert"`: Success notification with `{ type: "success", message: string, duration: number }`
  - `"alert"`: Warning notification with `{ type: "warning", message: string, dismissible: boolean }`

- **Client → Server**:
  - `"subscribe"`: Subscribe to notifications with `{ userId: string, topics: string[] }`
  - `"dismiss"`: Dismiss notification with `{ notificationId: string }`

**Hint**: Remember discriminated unions from Day 1? The `type` field is your discriminator!

---

## 💬 Challenge 2: Message State Machine

**The Setup**: Chat messages go through states: `sending → sent → delivered → read`.

**Your Task**: Build a message state machine and a handler function.

### Requirements:

1. Define a discriminated union for `MessageState`:

   - `sending`: Has `tempId: string`
   - `sent`: Has `id: string, serverTimestamp: Date`
   - `delivered`: Has `id: string, deliveredTo: string[]`
   - `read`: Has `id: string, readBy: Record<string, Date>`

2. Create a `ChatMessage` interface with:

   - `text: string`
   - `senderId: string`
   - `state: MessageState`

3. Write a function `getMessageStatus(msg: ChatMessage): string` that returns:
   - "Sending..." if sending
   - "Sent ✓" if sent
   - "Delivered ✓✓" if delivered
   - "Read ✓✓ by X users" if read (count users in readBy)

**Hint**: Use exhaustive `switch` from Day 1!

---

## 🎮 Challenge 3: Generic Event Router

**The Setup**: You need a type-safe event system that works for ANY event structure.

**Your Task**: Build a generic event router using **Generics** (Day 2 skill).

### Requirements:

Create a `EventRouter<Events>` class with:

- `on<K extends keyof Events>(event: K, handler: (data: Events[K]) => void): void`
- `off<K extends keyof Events>(event: K, handler: (data: Events[K]) => void): void`
- `emit<K extends keyof Events>(event: K, data: Events[K]): void`

Test it with these events:

```typescript
interface GameEvents {
  "player:moved": { playerId: string; x: number; y: number };
  "player:scored": { playerId: string; points: number };
  "game:over": { winner: string; score: number };
}
```

**Bonus**: Add a `once()` method that removes the handler after first call.

**Hint**: Remember the Collection class from Day 2? Same generic pattern!

---

## 📊 Challenge 4: API Response Transformations

**The Setup**: Your server returns full user data, but clients need different views.

**Your Task**: Use **Utility Types** (Day 3) to create transformation types.

### Requirements:

Given this full user interface:

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
```

Create these transformation types:

1. `PublicUser`: Omit `passwordHash`, `email`, and `settings`
2. `UserPreview`: Only `id`, `username`, and `profile.avatar` (use Pick and nested access)
3. `EditableProfile`: Make `profile.bio` and `settings` Partial
4. `AdminView`: Everything from DatabaseUser, but add `lastLogin: Date`

**Hint**: Combine Pick, Omit, Partial, and type intersections!

---

## 🔥 BOSS LEVEL: Type-Safe Room System

**The Setup**: Build a complete chat room system with state management.

**Your Task**: Combine ALL three days of knowledge!

### Requirements:

#### Part 1: Room States (Day 1)

Define discriminated union for `RoomStatus`:

- `"waiting"`: `{ minUsers: number, currentUsers: string[] }`
- `"active"`: `{ users: string[], messageCount: number, startedAt: Date }`
- `"closed"`: `{ reason: string, closedAt: Date }`

#### Part 2: Generic Room Manager (Day 2)

Create `RoomManager<TUser extends { id: string, username: string }>` class with:

- `createRoom(id: string): void`
- `addUser(roomId: string, user: TUser): void`
- `removeUser(roomId: string, userId: string): void`
- `getRoomStatus(roomId: string): RoomStatus`
- `getAllRooms(): Map<string, TUser[]>`

#### Part 3: Message DTOs (Day 3)

Given:

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
```

Create:

- `CreateMessageDTO`: Client sends only `roomId`, `text`, and optional `attachments`
- `MessageResponse`: Server sends everything except `senderId` (security!)
- `EditMessageDTO`: For editing, only `id` and `text` are editable
- `MessagePreview`: For list views, only `id`, `senderName`, first 50 chars of `text`, and `timestamp`

#### Part 4: Complete Integration

Write a function:

```typescript
function handleMessage(
  manager: RoomManager<any>,
  roomId: string,
  dto: CreateMessageDTO
): MessageResponse | { error: string };
```

That:

1. Checks if room status is "active" (Day 1 exhaustive check)
2. Creates a FullMessage with generated id and timestamp
3. Returns a MessageResponse (Day 3 transformation)
4. Returns error if room isn't active

**Hint**: This is everything you've learned! Take your time.

---

## 🎖️ Achievement Unlocks

- **Challenge 1**: "Event Architect" - Master typed events
- **Challenge 2**: "State Machine Expert" - Handle message states
- **Challenge 3**: "Generic Guru" - Build reusable event system
- **Challenge 4**: "Data Transformer" - Master utility types
- **Boss Level**: "Real-Time Master" 🏆 - Complete type-safe system

---

## 💡 Testing Your Solutions

You can test each challenge independently:

```bash
# Run any challenge file
ts-node bonus-day-real-world/challenges/challenge-1.ts
ts-node bonus-day-real-world/challenges/challenge-2.ts
# etc...
```

Look for TypeScript errors as you work - they're your friends!

---

## 🚀 Ready?

Start with Challenge 1 and work your way up. Each challenge prepares you for the next!

Remember:

- **Day 1**: Discriminated unions for state
- **Day 2**: Generics for reusability
- **Day 3**: Utility types for transformations

You've got all the tools. Now build something awesome! 🎉

---

<div align="center">

**"The best way to learn is to build something real."** 🔥

[View Solutions →](./SOLUTION.md) (But try first!)

</div>
