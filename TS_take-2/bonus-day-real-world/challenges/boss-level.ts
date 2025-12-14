// 🔥 BOSS LEVEL: Type-Safe Room System
// Combine EVERYTHING from Days 1, 2, and 3!

/**
 * YOUR TASK:
 * Build a complete chat room system using:
 * - Day 1: Discriminated unions for room states
 * - Day 2: Generic RoomManager class
 * - Day 3: Utility types for message DTOs
 *
 * This is the final test! Good luck! 🚀
 */

// ============================================
// PART 1: Room States (Day 1)
// ============================================

type RoomStatus =
  | { status: "waiting"; minUsers: number; currentUsers: string[] }
  | { status: "active"; users: string[]; messageCount: number; startedAt: Date }
  | { status: "closed"; reason: string; closedAt: Date };

// ============================================
// PART 2: Generic Room Manager (Day 2)
// ============================================

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

    // Don't add duplicate users
    if (!room.find((u) => u.id === user.id)) {
      room.push(user);

      // Activate room when first user joins
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

// ============================================
// PART 3: Message DTOs (Day 3)
// ============================================

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

// What client sends
type CreateMessageDTO = Pick<FullMessage, "roomId" | "text"> & {
  attachments?: string[];
};

// What server returns (hide senderId for security)
type MessageResponse = Omit<FullMessage, "senderId">;

// For editing
type EditMessageDTO = Pick<FullMessage, "id" | "text">;

// For list previews
type MessagePreview = Pick<FullMessage, "id" | "senderName" | "timestamp"> & {
  textPreview: string;
};

// ============================================
// PART 4: Complete Integration
// ============================================

interface RoomUser {
  id: string;
  username: string;
  avatar: string;
}

function handleMessage(
  manager: RoomManager<RoomUser>,
  roomId: string,
  dto: CreateMessageDTO,
  userId: string,
  username: string
): MessageResponse | { error: string } {
  // Check room status
  const status = manager.getRoomStatus(roomId);

  // Only allow messages in active rooms
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

  // Increment message count
  manager.incrementMessageCount(roomId);

  // Return response (without senderId)
  const { senderId, ...response } = fullMessage;
  return response;
}

// ✅ Test the complete system!
function testRoomSystem() {
  const manager = new RoomManager<RoomUser>();

  console.log("🏗️ Creating rooms...");
  manager.createRoom("general");
  manager.createRoom("tech-talk");

  console.log("\n👥 Adding users...");
  manager.addUser("general", {
    id: "user_1",
    username: "Alice",
    avatar: "avatar1.png",
  });
  console.log("Room status:", manager.getRoomStatus("general")); // waiting

  manager.addUser("general", {
    id: "user_2",
    username: "Bob",
    avatar: "avatar2.png",
  });
  console.log("Room status:", manager.getRoomStatus("general")); // active!

  console.log("\n💬 Sending messages...");
  const msg1 = handleMessage(
    manager,
    "general",
    { roomId: "general", text: "Hello everyone!" },
    "user_1",
    "Alice"
  );
  console.log("Message 1:", msg1);

  const msg2 = handleMessage(
    manager,
    "general",
    { roomId: "general", text: "Hey Alice! 👋", attachments: ["wave.gif"] },
    "user_2",
    "Bob"
  );
  console.log("Message 2:", msg2);

  // Try sending to inactive room
  const msg3 = handleMessage(
    manager,
    "tech-talk",
    { roomId: "tech-talk", text: "Anyone here?" },
    "user_1",
    "Alice"
  );
  console.log("Message 3:", msg3); // Should show error

  console.log("\n📊 Final room status:");
  console.log("General:", manager.getRoomStatus("general"));
  console.log("Tech-talk:", manager.getRoomStatus("tech-talk"));
}

testRoomSystem();

console.log("\n🏆 BOSS LEVEL COMPLETE! You're a Real-Time TypeScript Master!");

export {
  RoomStatus,
  RoomManager,
  FullMessage,
  CreateMessageDTO,
  MessageResponse,
  EditMessageDTO,
  MessagePreview,
  handleMessage,
};
