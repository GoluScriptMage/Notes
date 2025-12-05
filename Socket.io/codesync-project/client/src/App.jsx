import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

function App() {
  const [connected, setConnected] = useState(false);
  const [currentCode, setCurrentCode] = useState("");
  const [message, setMessage] = useState("");

  // ✅ THIS IS GOOD! Silent storage for logic variables.
  const roomId = useRef("Star"); // Hardcoded for now
  const userId = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:3001");

    socket.current.on("connect", () => {
      setConnected(true);
      console.log("Connected to server");
      
      // 🛠️ FIX 1: Send String, not Object
      socket.current.emit("join-room", roomId.current);
    });

    socket.current.on("disconnect", () => {
      setConnected(false);
      console.log("Disconnected from server");
    });

    // 🛠️ FIX 2: Receive 'data' Object, then extract fields
    socket.current.on("room-joined", (data) => {
      console.log("Room Joined Data:", data);
      
      setCurrentCode(data.code);
      setMessage(data.message);
      
      // Update the Ref silently
      userId.current = data.userId; 
      // Note: roomId.current is already set, but you could update it here too
    });

    // Listen if any user joined
    socket.current.on("user-joined", (data) => {
      setMessage(data.message); // Server sends { userId, message }
    });

    // 🛠️ FIX 3: Receive 'data' Object for code updates
    socket.current.on("code-update", (data) => {
      // Only update if the code is actually different? 
      // For now, just setting it is fine.
      console.log("New code from:", data.userId);
      setCurrentCode(data.code);
    });

    return function () {
      // Standard cleanup
      socket.current.disconnect(); 
      // Note: socket.disconnect() automatically removes listeners attached to it
    };
  }, []);

  const codeChangeHandler = (e) => {
    const newCode = e.target.value;
    setCurrentCode(newCode); // Update my screen instantly
  

    // Emit to server
    socket.current.emit("code-change", {
      roomId: roomId.current,
      code: newCode,
      userId: userId.current,
    });
    console.log(`Emitted code-change from user: ${currentCode}`);
  };

  const handleReconnect = () => {
    if (socket.current && !connected) {
      socket.current.connect();
    }
  };

  const handleDisconnect = () => {
    if (socket.current && connected) {
      socket.current.disconnect();
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center p-6 gap-2 bg-red-300 text-white">
      <h1 className="text-2xl font-bold">CodeSync Client 🚀</h1>
      <p>Status: {connected ? "🟢 Connected" : "🔴 Disconnected"}</p>
      
      {message && <div className="bg-black/20 p-2 rounded">{message}</div>}

      <textarea
        className="w-full h-64 p-4 rounded-md text-black font-mono"
        placeholder="Start writing code..."
        value={currentCode}
        onChange={codeChangeHandler}
      />

      {connected ? (
        <button className="bg-red-500 py-2 px-4 rounded-xl hover:bg-red-600" onClick={handleDisconnect}>
          Disconnect
        </button>
      ) : (
        <button className="bg-green-500 py-2 px-4 rounded-xl hover:bg-green-600" onClick={handleReconnect}>
          Reconnect
        </button>
      )}
    </div>
  );
}

export default App;