const express = require("express");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const { Upload } = require("./mongo");
require("./dash");
require("./fetch");
const sseApp = require("./sse");

const app = express();
const port = 3000;
const ssePort = 3001;
app.use(cors());

const mediaPath = path.join(__dirname, "./public/dash");

app.get("/stream/:uuid/:file", (req, res) => {
  const selectedUuid = req.params.uuid;
  //console.log(req.params.file);
  //console.log(selectedUuid);
  const dashFilePath = path.join(mediaPath, selectedUuid, req.params.file);

  res.setHeader("Cache-Control", "no-store");

  //console.log('Request for:', dashFilePath);

  res.sendFile(dashFilePath, (err) => {
    if (err) {
      //console.error(`Error sending file : ${err}`);
      res.status(404).send("File does not exist.");
    }
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const baseDir = path.join(__dirname, "public");
    const videoDir = path.join(baseDir, "videos");
    const thumbnailDir = path.join(baseDir, "thumbnails");

    if (file.fieldname === "videoFile") {
      cb(null, videoDir);
    } else if (file.fieldname === "thumbnail") {
      cb(null, thumbnailDir);
    } else {
      cb(new Error("Invalid file field name"));
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep original file names
  },
});

const uploadBothFiles = multer({
  storage: storage,
}).fields([
  { name: "videoFile" },
  { name: "thumbnail" },
  { name: "title" },
  { name: "description" },
]);

app.post("/upload", uploadBothFiles, async (req, res) => {
  try {
    const videoFile = req.files.videoFile[0];
    const thumbnailFile = req.files.thumbnail[0];
    const title = req.body.title;
    const description = req.body.description;

    if (!videoFile || !thumbnailFile) {
      throw new Error("Missing video or thumbnail file");
    }

    // Calculate relative paths
    const relativeVideoPath = path.relative(
      path.join(__dirname, "public"),
      videoFile.path
    );
    //const relativeThumbnailPath = path.relative(path.join(__dirname, "public"), thumbnailFile.path);
    const relativeThumbnailPath =
      `/` + path.relative(path.join(__dirname, "public"), thumbnailFile.path);

    /*console.log(`Video uploaded to: ${relativeVideoPath}`);
    console.log(`Thumbnail uploaded to: ${relativeThumbnailPath}`);
    console.log(`Title: ${title}`);
    console.log(`Description: ${description}`);*/

    // Store data in MongoDB with relative paths
    const upload = new Upload({
      title: title,
      description: description,
      originalVideoPath: relativeVideoPath,
      thumbnailPath: relativeThumbnailPath,
    });
    //console.log("arrived1!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    await upload.save();

    res.send(
      `Video, thumbnail, title, and description uploaded successfully and stored in MongoDB`
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading files");
  }
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
sseApp.listen(ssePort, () => {
  console.log(`SSE server listening on port ${ssePort}`);
});
