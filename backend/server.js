require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const app = express();

/* ======================
   MIDDLEWARE
====================== */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ======================
   DATABASE
====================== */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));

/* ======================
   CLOUDINARY
====================== */
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

/* ======================
   MODEL
====================== */
const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: String,
    video: String,
    audio: String,
  },
  { timestamps: true }
);

const Song = mongoose.model("Song", songSchema);

/* ======================
   TEST ROUTE
====================== */
app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

/* ======================
   GET ALL SONGS
====================== */
app.get("/songs", async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ======================
   GET SONG BY ID
====================== */
app.get("/songs/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({
        message: "Song not found",
      });
    }

    res.json(song);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* ======================
   ADD SONG
====================== */
app.post("/songs", async (req, res) => {
  try {
    const { title, image, video, audio } = req.body;

    const song = await Song.create({
      title,
      image,
      video,
      audio,
    });

    res.status(201).json(song);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* ======================
   DELETE SONG
====================== */
app.delete("/songs/:id", async (req, res) => {
  try {
    await Song.findByIdAndDelete(req.params.id);

    res.json({
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* ======================
   UPLOAD FILE
====================== */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "music-web",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    res.json({
      url: result.secure_url,
    });

  } catch (error) {
    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
});

/* ======================
   404
====================== */
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});