// 💬 Challenge 2: Message State Machine
// Build a message state machine using discriminated unions

/**
 * YOUR TASK:
 * Create a message state machine for chat messages
 *
 * States:
 * - sending: { status: "sending", tempId: string }
 * - sent: { status: "sent", id: string, serverTimestamp: Date }
 * - delivered: { status: "delivered", id: string, deliveredTo: string[] }
 * - read: { status: "read", id: string, readBy: Record<string, Date> }
 */

// Define MessageState discriminated union
type MessageState =
  | { status: "sending"; tempId: string }
  | { status: "sent"; id: string; serverTimestamp: Date }
  | { status: "delivered"; id: string; deliveredTo: string[] }
  | { status: "read"; id: string; readBy: Record<string, Date> };

// Define ChatMessage interface
interface ChatMessage {
  text: string;
  senderId: string;
  state: MessageState;
}

// Write the status handler function
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

// ✅ Test your state machine!
function testMessageStates() {
  const messages: ChatMessage[] = [
    {
      text: "Hello World!",
      senderId: "user_1",
      state: { status: "sending", tempId: "temp_123" },
    },
    {
      text: "How are you?",
      senderId: "user_1",
      state: { status: "sent", id: "msg_456", serverTimestamp: new Date() },
    },
    {
      text: "TypeScript is awesome!",
      senderId: "user_1",
      state: {
        status: "delivered",
        id: "msg_789",
        deliveredTo: ["user_2", "user_3"],
      },
    },
    {
      text: "See you tomorrow!",
      senderId: "user_1",
      state: {
        status: "read",
        id: "msg_999",
        readBy: {
          user_2: new Date(),
          user_3: new Date(),
          user_4: new Date(),
        },
      },
    },
  ];

  messages.forEach((msg) => {
    console.log(`"${msg.text}" - ${getMessageStatus(msg)}`);
  });
}

testMessageStates();

console.log("\n✅ Challenge 2 Complete! Message states are type-safe.");

export { MessageState, ChatMessage, getMessageStatus };
