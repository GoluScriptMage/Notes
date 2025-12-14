// Example: Real-Time State Synchronization
// How to keep client and server state in sync using TypeScript

/**
 * THE ANALOGY:
 * Think of this like Google Docs:
 * - Multiple people editing the same document
 * - Changes sync in real-time
 * - Everyone sees the same state
 *
 * TypeScript ensures the state format is consistent everywhere!
 */

// ============================================
// Define Shared State Types
// ============================================

// Base entity with timestamp tracking
interface Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// User presence (who's online?)
interface UserPresence extends Entity {
  userId: string;
  username: string;
  status: "online" | "away" | "offline";
  lastSeen: Date;
}

// Document state (collaborative editing)
interface DocumentState extends Entity {
  title: string;
  content: string;
  version: number;
  editors: string[]; // User IDs currently editing
}

// Cursor position (where are others typing?)
interface CursorPosition {
  userId: string;
  line: number;
  column: number;
  color: string; // Visual indicator
}

// ============================================
// State Change Events (Discriminated Unions!)
// ============================================

type StateChangeEvent =
  | {
      type: "user:presence";
      data: UserPresence;
    }
  | {
      type: "document:updated";
      data: DocumentState;
    }
  | {
      type: "cursor:moved";
      data: CursorPosition;
    }
  | {
      type: "document:locked";
      data: { documentId: string; lockedBy: string };
    };

// ============================================
// State Manager (Centralized State)
// ============================================

class StateManager<T extends Entity> {
  private state: Map<string, T> = new Map();
  private subscribers: Set<(state: T[]) => void> = new Set();

  // Get current state snapshot
  getAll(): T[] {
    return Array.from(this.state.values());
  }

  // Get specific entity
  get(id: string): T | undefined {
    return this.state.get(id);
  }

  // Update or create entity
  set(entity: T): void {
    this.state.set(entity.id, {
      ...entity,
      updatedAt: new Date(),
    });
    this.notifySubscribers();
  }

  // Remove entity
  delete(id: string): void {
    this.state.delete(id);
    this.notifySubscribers();
  }

  // Subscribe to state changes
  subscribe(callback: (state: T[]) => void): () => void {
    this.subscribers.add(callback);

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  // Notify all subscribers of state change
  private notifySubscribers(): void {
    const currentState = this.getAll();
    this.subscribers.forEach((callback) => callback(currentState));
  }
}

// ============================================
// Example: Collaborative Document Editor
// ============================================

// Create state managers
const userPresence = new StateManager<UserPresence>();
const documents = new StateManager<DocumentState>();
const cursors = new Map<string, CursorPosition>();

// Subscribe to presence changes
userPresence.subscribe((users) => {
  const online = users.filter((u) => u.status === "online").length;
  console.log(`👥 ${online} user(s) online`);
});

// Subscribe to document changes
documents.subscribe((docs) => {
  docs.forEach((doc) => {
    console.log(
      `📄 Document "${doc.title}" v${doc.version} - ${doc.editors.length} editor(s)`
    );
  });
});

// Simulate real-time events
console.log("--- Simulating Real-Time Collaboration ---\n");

// User Alice joins
userPresence.set({
  id: "presence_1",
  userId: "user_alice",
  username: "Alice",
  status: "online",
  lastSeen: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Create a document
documents.set({
  id: "doc_1",
  title: "Project Plan",
  content: "Initial content...",
  version: 1,
  editors: ["user_alice"],
  createdAt: new Date(),
  updatedAt: new Date(),
});

// User Bob joins
userPresence.set({
  id: "presence_2",
  userId: "user_bob",
  username: "Bob",
  status: "online",
  lastSeen: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Bob starts editing the document
const doc = documents.get("doc_1");
if (doc) {
  documents.set({
    ...doc,
    editors: [...doc.editors, "user_bob"],
    version: doc.version + 1,
  });
}

// Track cursor positions
cursors.set("user_alice", {
  userId: "user_alice",
  line: 1,
  column: 10,
  color: "#FF6B6B",
});

cursors.set("user_bob", {
  userId: "user_bob",
  line: 2,
  column: 5,
  color: "#4ECDC4",
});

// Display cursor positions
console.log("\n📍 Cursor Positions:");
cursors.forEach((cursor) => {
  console.log(
    `  ${cursor.userId}: Line ${cursor.line}, Column ${cursor.column}`
  );
});

// Alice goes away
const alice = userPresence.get("presence_1");
if (alice) {
  userPresence.set({
    ...alice,
    status: "away",
    lastSeen: new Date(),
  });
}

// ============================================
// Pattern: Optimistic Updates
// ============================================

class OptimisticStateManager<T extends Entity> extends StateManager<T> {
  private pendingUpdates: Map<string, T> = new Map();

  // Apply update optimistically (before server confirms)
  optimisticUpdate(entity: T): void {
    this.pendingUpdates.set(entity.id, entity);
    this.set(entity);
  }

  // Server confirms update
  confirmUpdate(id: string): void {
    this.pendingUpdates.delete(id);
  }

  // Server rejects update (rollback)
  rollbackUpdate(id: string, previousState: T): void {
    this.pendingUpdates.delete(id);
    this.set(previousState);
    console.log(`⚠️ Rolled back changes to ${id}`);
  }

  // Check if update is pending
  isPending(id: string): boolean {
    return this.pendingUpdates.has(id);
  }
}

// Example usage
console.log("\n--- Optimistic Updates Example ---\n");

const optimisticDocs = new OptimisticStateManager<DocumentState>();

// Initial state
const initialDoc: DocumentState = {
  id: "doc_2",
  title: "Notes",
  content: "Original content",
  version: 1,
  editors: ["user_alice"],
  createdAt: new Date(),
  updatedAt: new Date(),
};

optimisticDocs.set(initialDoc);

// User makes an edit (optimistic update)
console.log("✏️ Making optimistic edit...");
optimisticDocs.optimisticUpdate({
  ...initialDoc,
  content: "Updated content (not confirmed yet)",
  version: 2,
});

console.log("Is pending?", optimisticDocs.isPending("doc_2")); // true

// Simulate server response (success)
setTimeout(() => {
  console.log("✅ Server confirmed update");
  optimisticDocs.confirmUpdate("doc_2");
  console.log("Is pending?", optimisticDocs.isPending("doc_2")); // false
}, 1000);

// ============================================
// Pattern: Conflict Resolution
// ============================================

function resolveConflict(
  local: DocumentState,
  remote: DocumentState
): DocumentState {
  // Use version number for conflict resolution
  if (remote.version > local.version) {
    console.log("📥 Accepting remote changes (newer version)");
    return remote;
  } else if (remote.version < local.version) {
    console.log("📤 Keeping local changes (newer version)");
    return local;
  } else {
    // Same version - merge strategies could be:
    // - Last write wins (simple)
    // - Operational transforms (complex, like Google Docs)
    // - Three-way merge (Git-style)
    console.log("⚔️ Conflict detected - using last write wins");
    return remote.updatedAt > local.updatedAt ? remote : local;
  }
}

// ============================================
// THE TAKEAWAY
// ============================================

console.log(`
✨ Real-Time State Sync Patterns:

1. **Centralized State**: Single source of truth
2. **Subscriptions**: Reactive updates when state changes
3. **Optimistic Updates**: Update UI before server responds
4. **Conflict Resolution**: Handle concurrent edits
5. **Type Safety**: Consistent state shape everywhere

Real-world examples:
- Google Docs (collaborative editing)
- Figma (multiplayer design)
- Notion (real-time notes)
- Trello (live board updates)
- Discord (presence, typing indicators)

You just learned the patterns behind modern collaborative apps! 🎉
`);

export {
  Entity,
  UserPresence,
  DocumentState,
  CursorPosition,
  StateChangeEvent,
  StateManager,
  OptimisticStateManager,
  resolveConflict,
};
