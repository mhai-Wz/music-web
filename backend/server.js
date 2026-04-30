const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const app = express();

app.use(cors());
app.use(express.json());

/* ======================
   MONGODB
====================== */
mongoose.connect(process.env.MONGO_URI)

/* ======================
   CLOUDINARY CONFIG
====================== */
cloudinary.config({
  cloud_name: "dtorkegpi",
  api_key: "129542678626466",
  api_secret: "oq9UyTsEAst5FDPovAXl3oZmpAU",
});

/* ======================
   SONG MODEL
====================== */
const Song = mongoose.model("Song", {
  title: String,
  image: String,
  video: String,
  audio: String,
});

/* ======================
   GET ALL SONGS
====================== */
app.get("/songs", async (req, res) => {
  const songs = await Song.find();
  res.json(songs);
});

/* ======================
   GET SONG BY ID
====================== */
app.get("/songs/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    res.json(song);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================
   ADD SONG
====================== */
app.post("/songs", async (req, res) => {
  const song = new Song(req.body);
  await song.save();
  res.json(song);
});

/* ======================
   UPLOAD FILE CLOUDINARY
====================== */
const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Không có file gửi lên",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier
        .createReadStream(req.file.buffer)
        .pipe(stream);
    });

    res.json({
      url: result.secure_url,
    });

  } catch (error) {
    console.log("UPLOAD ERROR:", error);

    res.status(500).json({
      message: "Upload lỗi",
      error: error.message,
    });
  }
});
/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});