const { parentPort } = require("worker_threads");

const blockTheEventLoop = () => {
  console.log("Starting heavy blocking task...");
  const end = Date.now() + 10000; // Block for 10 seconds
  while (Date.now() < end) {
    // This loop does nothing but burn CPU cycles, freezing the entire server.
  }
  console.log("...Finished heavy blocking task.");
  return 10;
};

// Listenting for parents message
parentPort.on("message", (message) => {
  if (message === "start") {
    const result = blockTheEventLoop();
    // Sending parent the result of the task completion 
    parentPort.postMessage(result);
  }
});
