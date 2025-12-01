import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

function App() {
  const [connected, setConnected] = useState(false);
  const [pingCount, setPingCount] = useState(0);
  const [message, setMessage] = useState("");

  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:3001");

    socket.current.on("connect", () => {
      setConnected(true);
      console.log("Connected to server");
    });

    socket.current.on("disconnect", () => {
      setConnected(false);
      console.log("Disconnected from server");
    });

    // ✅ FIXED: Listen for 'pong' from server (not 'ping')
    socket.current.on("pong", (data) => {
      console.log(`Pong received from server: ${data.message}`);
      setMessage(data.message); // Update UI with server message
    });

    // cleanup Fn
    return function () {
      socket.current.disconnect();
    };
  }, []);

  // Your handlers here...
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

  const handlePing = () => {
    if (socket.current && connected) {
      socket.current.emit("ping", { message: "ping from client" });
      setPingCount((prev) => prev + 1);
      console.log(`Ping sent to server`);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center p-6 gap-2 bg-red-300 text-white">
      <h1>CodeSync Client</h1>
      <p>Status: {connected ? "🟢 Connected" : "🔴 Disconnected"}</p>
      <p>Pings sent: {pingCount}</p>
      {message && <p>Server says: {message}</p>}
      {/* Your buttons here */}
      <button className="bg-blue-500 py-1 px-2 rounded-xl" onClick={handlePing}>
        Send Ping
      </button>
      {connected ? (
        <button
          className="bg-red-500 py-1 px-2 rounded-xl"
          onClick={handleDisconnect}
        >
          Disconnect
        </button>
      ) : (
        <button
          className="bg-green-500 py-1 px-2 rounded-xl"
          onClick={handleReconnect}
        >
          Reconnect
        </button>
      )}
    </div>
  );
}

export default App;
