const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose
  .connect(process.env.HIDDEN_MONGO)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

const uuidSchema = new mongoose.Schema({
  uuid: String,
  updatedDir: String,
  originalPath: String,
});

const uploadSchema = new mongoose.Schema({
  title: String,
  description: String,
  originalVideoPath: String,
  thumbnailPath: String,
});

const UUID = mongoose.model("UUID", uuidSchema);
const Upload = mongoose.model("Upload", uploadSchema);

module.exports = { Upload, UUID };
