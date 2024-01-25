const chokidar = require("chokidar");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
//const mongoose = require('mongoose');
const { UUID } = require("./mongo");

const createDir = () => {
  return new Promise((resolve, reject) => {
    const uuid = uuidv4();
    const generatedDirName = `${uuid}`;
    const relativeDirPath = path.join("public", "dash", generatedDirName);

    fs.mkdir(relativeDirPath, (err) => {
      if (err) {
        console.error(`Error creating directory: ${err}`);
        reject(err);
      } else {
        console.log(`Created directory: ${relativeDirPath}`);
        resolve(relativeDirPath);
      }
    });
  });
};

function convertFile(filePath, uuid) {
  const filename = path.basename(filePath);

  if (filename.endsWith(".mp4")) {
    const inputVideoPath = path.join("./public/videos", filename);
    const outputPlaylistPath = path.join(uuid, "playlist.mpd");

    console.log(`Converting ${filename} from path: ${inputVideoPath}...`);

    try {
      ffmpeg(inputVideoPath)
        .outputOptions([
          "-c:v libx264",
          "-c:a aac",
          "-b:v 5000k",
          "-b:a 128k",
          "-s 1280x720",
          "-f dash",
          "-init_seg_name init-$RepresentationID$.$ext$",
          "-media_seg_name seg-$RepresentationID$-$Number%05d$.$ext$",
        ])
        .output(outputPlaylistPath)
        .on("progress", (progress) => {
          console.log(`Progress: ${(progress.percent * 100).toFixed(2)}%`);
        })
        .on("end", () => {
          console.log(`DASH files generated for ${filename}`);
        })
        .on("error", (err) => {
          console.error(`Error converting ${filename}:`, err.message);
        })
        .run();
    } catch (error) {
      console.error(`Error converting ${filename}:`, error);
    }
  }
}

async function convertNextFile() {
  try {
    const watcher = chokidar.watch("./public/videos", { ignoreInitial: true });

    watcher.on("add", async (filePath) => {
      // Remove "public" from the filePath
      const updatedFilePath = filePath.replace("public/", "");
      console.log(`updated::::${updatedFilePath}`);
      const newDirPath = await createDir();
      console.log(`newDir:${newDirPath}`);
      const uuid = path.basename(newDirPath); // Extract UUID here
      console.log(`uuid:${uuid}`);
      console.log(`newI ${newDirPath}`);
      console.log(`filepath:${filePath}`);
      // Store data in MongoDB with relative paths
      const metadata = new UUID({
        uuid: uuid,
        updatedDir: newDirPath,
        originalPath: updatedFilePath,
      });
      await metadata.save();
      convertFile(filePath, newDirPath);
    });

    console.log("Watching for changes in", "./public/videos");
  } catch (error) {
    console.error(error);
  }
}

// Start the initial conversion process
convertNextFile();
