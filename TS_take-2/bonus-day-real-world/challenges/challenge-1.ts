// 🎯 Challenge 1: Event Type Definitions
// Define strongly-typed Socket.io events using discriminated unions

/**
 * YOUR TASK:
 * Create event interfaces for a notification system
 *
 * Server → Client: Alert notifications (3 types)
 * - Error: { type: "error", message: string, code: number }
 * - Success: { type: "success", message: string, duration: number }
 * - Warning: { type: "warning", message: string, dismissible: boolean }
 *
 * Client → Server:
 * - Subscribe: { userId: string, topics: string[] }
 * - Dismiss: { notificationId: string }
 */

// Define your Alert notification type (discriminated union)
type AlertNotification =
  | { type: "error"; message: string; code: number }
  | { type: "success"; message: string; duration: number }
  | { type: "warning"; message: string; dismissible: boolean };

// Define Server → Client events
interface ServerToClientEvents {
  alert: (notification: AlertNotification) => void;
}

// Define Client → Server events
interface ClientToServerEvents {
  subscribe: (data: { userId: string; topics: string[] }) => void;
  dismiss: (data: { notificationId: string }) => void;
}

// ✅ Test your types!
function testAlerts() {
  // Simulate receiving different alerts
  const handleAlert = (notification: AlertNotification) => {
    switch (notification.type) {
      case "error":
        console.log(`❌ Error ${notification.code}: ${notification.message}`);
        break;
      case "success":
        console.log(
          `✅ Success: ${notification.message} (${notification.duration}ms)`
        );
        break;
      case "warning":
        console.log(
          `⚠️ Warning: ${notification.message} ${
            notification.dismissible ? "(can dismiss)" : ""
          }`
        );
        break;
    }
  };

  // Test different notification types
  handleAlert({ type: "error", message: "Connection failed", code: 500 });
  handleAlert({ type: "success", message: "Profile updated", duration: 3000 });
  handleAlert({ type: "warning", message: "Low storage", dismissible: true });
}

testAlerts();

console.log("✅ Challenge 1 Complete! Event types are strongly typed.");

export { ServerToClientEvents, ClientToServerEvents, AlertNotification };
