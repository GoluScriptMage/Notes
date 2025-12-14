// Example: Event-Driven Architecture with TypeScript
// Real-world pattern for managing complex event flows

/**
 * THE ANALOGY:
 * Think of this like a radio station:
 * - Broadcasters (emit events)
 * - Listeners (subscribe to channels)
 * - Type-safe channels (can't send wrong signal format)
 */

// ============================================
// Pattern 1: Typed Event Emitter
// ============================================

type EventCallback<T = any> = (data: T) => void;

class TypedEventEmitter<Events extends Record<string, any>> {
  private listeners: Partial<Record<keyof Events, EventCallback[]>> = {};

  // Subscribe to an event
  on<K extends keyof Events>(
    event: K,
    callback: EventCallback<Events[K]>
  ): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback);

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  // Unsubscribe from an event
  off<K extends keyof Events>(
    event: K,
    callback: EventCallback<Events[K]>
  ): void {
    const callbacks = this.listeners[event];
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Trigger an event
  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    const callbacks = this.listeners[event] || [];
    callbacks.forEach((callback) => callback(data));
  }

  // Subscribe once (auto-unsubscribe after first trigger)
  once<K extends keyof Events>(
    event: K,
    callback: EventCallback<Events[K]>
  ): void {
    const wrappedCallback = (data: Events[K]) => {
      callback(data);
      this.off(event, wrappedCallback);
    };
    this.on(event, wrappedCallback);
  }
}

// ============================================
// Example Usage: Chat Application Events
// ============================================

interface ChatEvents {
  "message:sent": {
    id: string;
    text: string;
    userId: string;
    timestamp: Date;
  };
  "message:edited": {
    id: string;
    newText: string;
    editedAt: Date;
  };
  "message:deleted": {
    id: string;
    deletedBy: string;
  };
  "user:typing": {
    userId: string;
    roomId: string;
  };
  "user:online": {
    userId: string;
    status: "online" | "away" | "offline";
  };
}

// Create event bus
const chatEvents = new TypedEventEmitter<ChatEvents>();

// Subscribe to events
const unsubscribe = chatEvents.on("message:sent", (data) => {
  // data is fully typed!
  console.log(`📨 New message from ${data.userId}: ${data.text}`);
});

chatEvents.on("user:typing", (data) => {
  console.log(`⌨️ User ${data.userId} is typing in ${data.roomId}...`);
});

// One-time listener
chatEvents.once("user:online", (data) => {
  console.log(`👋 ${data.userId} is now ${data.status}`);
});

// Emit events
chatEvents.emit("message:sent", {
  id: "msg_1",
  text: "Hello World!",
  userId: "user_123",
  timestamp: new Date(),
});

chatEvents.emit("user:typing", {
  userId: "user_456",
  roomId: "general",
});

chatEvents.emit("user:online", {
  userId: "user_789",
  status: "online",
});

// This won't trigger (once was used)
chatEvents.emit("user:online", {
  userId: "user_789",
  status: "away",
});

// Unsubscribe when done
unsubscribe();

// ============================================
// Pattern 2: Event Pipeline (Middleware)
// ============================================

type EventMiddleware<T> = (data: T, next: () => void) => void;

class EventPipeline<
  Events extends Record<string, any>
> extends TypedEventEmitter<Events> {
  private middlewares: Partial<Record<keyof Events, EventMiddleware<any>[]>> =
    {};

  // Add middleware for an event
  use<K extends keyof Events>(
    event: K,
    middleware: EventMiddleware<Events[K]>
  ): void {
    if (!this.middlewares[event]) {
      this.middlewares[event] = [];
    }
    this.middlewares[event]!.push(middleware);
  }

  // Override emit to run through middleware
  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    const middlewares = this.middlewares[event] || [];

    let index = 0;
    const next = () => {
      if (index < middlewares.length) {
        const middleware = middlewares[index++];
        if (middleware) {
          middleware(data, next);
        }
      } else {
        // All middleware passed, emit the event
        super.emit(event, data);
      }
    };

    next();
  }
}

// Example: Message validation pipeline
const messagePipeline = new EventPipeline<ChatEvents>();

// Middleware 1: Log all messages
messagePipeline.use("message:sent", (data, next) => {
  console.log(`[LOG] Message ${data.id} sent`);
  next();
});

// Middleware 2: Validate message
messagePipeline.use("message:sent", (data, next) => {
  if (data.text.length === 0) {
    console.log("❌ Empty message blocked");
    return; // Don't call next()
  }
  next();
});

// Middleware 3: Check for spam
messagePipeline.use("message:sent", (data, next) => {
  if (data.text.includes("SPAM")) {
    console.log("❌ Spam detected");
    return;
  }
  next();
});

// Subscribe to final event
messagePipeline.on("message:sent", (data) => {
  console.log(`✅ Message delivered: ${data.text}`);
});

// Test the pipeline
console.log("\n--- Testing Event Pipeline ---");

messagePipeline.emit("message:sent", {
  id: "msg_1",
  text: "Hello!",
  userId: "user_1",
  timestamp: new Date(),
}); // ✅ Passes all middleware

messagePipeline.emit("message:sent", {
  id: "msg_2",
  text: "",
  userId: "user_1",
  timestamp: new Date(),
}); // ❌ Blocked by validation

messagePipeline.emit("message:sent", {
  id: "msg_3",
  text: "Check out this SPAM link!",
  userId: "user_1",
  timestamp: new Date(),
}); // ❌ Blocked by spam filter

// ============================================
// THE TAKEAWAY
// ============================================

console.log(`
✨ Event-Driven Architecture Benefits:

1. **Decoupling**: Components don't know about each other
2. **Scalability**: Add new listeners without changing emitters
3. **Type Safety**: Can't emit wrong event structure
4. **Middleware**: Intercept and validate events
5. **Testing**: Easy to mock event emitters

This pattern is used in:
- Redux (state management)
- Node.js EventEmitter
- Vue.js event bus
- Socket.io
- Message queues (RabbitMQ, Kafka)

You just learned a fundamental software architecture pattern! 🎉
`);

export { TypedEventEmitter, EventPipeline };
