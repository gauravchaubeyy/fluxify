const express = require("express");
const path = require("path");
const cors = require("cors");
const { eventEmitter, uploadUUIDMap } = require("./fetch");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET",
    optionsSuccessStatus: 200,
  })
);

app.use(express.static(path.join(__dirname, "./public")));

let connectedClients = [];

// Function to send movie data to the client
function sendMovieData(res, movieData) {
  res.write(`data: ${JSON.stringify(movieData)}\n\n`);
}

// Send the initial movie data using the data from uploadUUIDMap
function sendInitialData(res) {
  Object.values(uploadUUIDMap).forEach((movieData) => {
    sendMovieData(res, movieData);
  });
}

// Listen for updates from fetch.js
eventEmitter.on("update", (updatedMap) => {
  // Log the updated uploadUUIDMap
  console.log("CLIENT DATA VIA SSE:", updatedMap);

  // Send updates to connected clients
  connectedClients.forEach((res) => {
    Object.values(updatedMap).forEach((movieData) => {
      sendMovieData(res, movieData);
    });
  });
});
console.log("Listening for updates from fetch.js...");
app.get("/movies-stream", (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  // Send initial data
  sendInitialData(res);

  // Add the response object to the list of connected clients
  connectedClients.push(res);

  // Handle client disconnect
  req.on("close", () => {
    // Remove the disconnected client from the list
    connectedClients = connectedClients.filter((client) => client !== res);
    res.end();
  });
});

// Export app for use in index.js
module.exports = app;
