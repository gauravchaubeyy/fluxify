const { eventEmitter } = require("./fetch");

// Listen for updates from fetch.js
eventEmitter.on("update", (updatedMap) => {
  // Log or handle the updated data as needed
  console.log("Data Received:", updatedMap);
});

console.log("Listening for updates from fetch.js...");
