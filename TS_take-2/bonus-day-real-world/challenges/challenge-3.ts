// 🎮 Challenge 3: Generic Event Router
// Build a type-safe event system using Generics

/**
 * YOUR TASK:
 * Create a generic EventRouter class that works with ANY event structure
 *
 * Methods:
 * - on<K extends keyof Events>(event: K, handler: (data: Events[K]) => void): void
 * - off<K extends keyof Events>(event: K, handler: (data: Events[K]) => void): void
 * - emit<K extends keyof Events>(event: K, data: Events[K]): void
 *
 * BONUS: Add once() method
 */

class EventRouter<Events extends Record<string, any>> {
  private listeners: Partial<Record<keyof Events, Function[]>> = {};

  // Register an event handler
  on<K extends keyof Events>(
    event: K,
    handler: (data: Events[K]) => void
  ): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(handler);
  }

  // Remove an event handler
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

  // Emit an event to all handlers
  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    const handlers = this.listeners[event] || [];
    handlers.forEach((handler) => handler(data));
  }

  // BONUS: Register a one-time handler
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

// ✅ Test with game events!
interface GameEvents {
  "player:moved": { playerId: string; x: number; y: number };
  "player:scored": { playerId: string; points: number };
  "game:over": { winner: string; score: number };
}

function testEventRouter() {
  const router = new EventRouter<GameEvents>();

  // Register handlers
  router.on("player:moved", (data) => {
    console.log(`Player ${data.playerId} moved to (${data.x}, ${data.y})`);
  });

  router.on("player:scored", (data) => {
    console.log(`Player ${data.playerId} scored ${data.points} points!`);
  });

  // One-time handler
  router.once("game:over", (data) => {
    console.log(
      `🏆 Game Over! Winner: ${data.winner} with ${data.score} points`
    );
  });

  // Emit events
  router.emit("player:moved", { playerId: "player_1", x: 10, y: 20 });
  router.emit("player:moved", { playerId: "player_2", x: 15, y: 25 });
  router.emit("player:scored", { playerId: "player_1", points: 100 });
  router.emit("game:over", { winner: "player_1", score: 500 });

  // This won't trigger (once was used)
  router.emit("game:over", { winner: "player_2", score: 300 });
}

testEventRouter();

console.log("\n✅ Challenge 3 Complete! Generic event router is type-safe.");

export { EventRouter };
