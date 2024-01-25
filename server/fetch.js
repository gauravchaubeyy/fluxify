const { Upload, UUID } = require("./mongo");
const EventEmitter = require("events");

const eventEmitter = new EventEmitter();
let uploadUpdated = false;
let uuidUpdated = false;

let uploadUUIDMap = {}; // Map to store the association between Upload and UUID

async function fetchAllInformation() {
  try {
    const allUploads = await Upload.find();

    for (const upload of allUploads) {
      const uuidInfo = await UUID.findOne({
        originalPath: upload.originalVideoPath,
      });

      if (uuidInfo) {
        const commonInfo = {
          title: upload.title,
          description: upload.description,
          thumbnailPath: upload.thumbnailPath,
          updatedDir: uuidInfo.updatedDir,
          uuid: uuidInfo.uuid,
        };

        uploadUUIDMap[upload.originalVideoPath] = commonInfo;
      }
    }

    console.log("All Information1:", uploadUUIDMap);

    uploadUpdated = true;
    checkFetchOperation();

    // Emit the 'update' event
    const x = eventEmitter.emit("update", uploadUUIDMap);
    console.log("Emitted update event with2:", uploadUUIDMap);
    console.log(`x:${x}`);

    // Log the emitted data
    logReceivedData(uploadUUIDMap);
  } catch (error) {
    console.error("Error fetching information:", error);
  }
}

function checkFetchOperation() {
  if (uploadUpdated && uuidUpdated) {
    uploadUpdated = false;
    uuidUpdated = false;

    console.log("Performing fetch operation...");
  }
}

function logReceivedData(data) {
  console.log("Received update event with4:", data);
}

// Event listener for the 'update' event
eventEmitter.on("update", (updatedMap) => {
  console.log("Listener in fetch.js - Updated uploadUUIDMap3:", updatedMap);
});

async function fetchAndWatch() {
  try {
    await fetchAllInformation();

    // Watch for changes in Upload collection
    const uploadChangeStream = Upload.watch();
    uploadChangeStream.on("change", async (change) => {
      if (change.operationType === "insert") {
        console.log("New video uploaded to Upload collection!");
        const upload = await Upload.findOne({ _id: change.documentKey._id });

        const uuidInfo = await UUID.findOne({
          originalPath: upload.originalVideoPath,
        });

        if (uuidInfo) {
          const commonInfo = {
            title: upload.title,
            description: upload.description,
            thumbnailPath: upload.thumbnailPath,
            updatedDir: uuidInfo.updatedDir,
            uuid: uuidInfo.uuid,
          };

          uploadUUIDMap[upload.originalVideoPath] = commonInfo;
          uploadUpdated = true;
          checkFetchOperation();

          // Emit the 'update' event
          const x = eventEmitter.emit("update", uploadUUIDMap);
          console.log("Common Information for the current video:", commonInfo);
          console.log("Emitted update event with:", uploadUUIDMap);
          console.log(`x:${x}`);

          // Log the emitted data
          logReceivedData(uploadUUIDMap);
        }
      }
    });

    // Watch for changes in UUID collection
    const uuidChangeStream = UUID.watch();
    uuidChangeStream.on("change", async (change) => {
      if (change.operationType === "insert") {
        console.log("New video uploaded to UUID collection!");
        uuidUpdated = true;
        checkFetchOperation();
      }
    });

    console.log("Watching for changes in both collections...");
  } catch (error) {
    console.error("Error starting fetching:", error);
  }
}

// Start fetching and watching for changes
fetchAndWatch();

// Export the necessary variables and functions
module.exports = {
  fetchAndWatch,
  uploadUUIDMap,
  eventEmitter,
  logReceivedData,
};
