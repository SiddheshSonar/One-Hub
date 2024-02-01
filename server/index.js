import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from 'fs';
import { google } from 'googleapis';
// import { OAuth2Client } from 'google-auth-library';
import { spawn } from 'child_process';
import multer from 'multer';
import init from "./db/config.js";
import uR from "./routers/userRouter.js";
import User from "./models/userSchema.js";
dotenv.config();

// express config
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('static'));
app.use('/static', express.static('static'));

// test api
app.get("/test", (req, res) => {
  res.send("Hello World! Go To /api");
});

// base router
const bR = express.Router();
app.use("/api", bR);

bR.get("/", (req, res) => {
  res.send("v0.0.1");
});

// Routes /api/{route}
bR.use("/user", uR);

// multer 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/youtube")
  },
  filename: function (req, file, cb) {
    return cb(null, `${file.originalname}`)
  }
})

const upload = multer({ storage });

// Upload on youtube
bR.post("/upload/youtube", upload.single('video'), async (req, res) => {
  try {
    // console.log(req.body); 
    const { title, description, email } = req.body;
    const video = req.file;
    // console.log(req.body)
    // console.log(video)
    if (!video) {
      return res.status(400).json({ message: 'No video file provided' });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User does not exist!" });
    const accessToken = user.socials[2].token;

    // Your existing code here...

    const video_path = video.path;
    const pythonProcess = spawn('python', [
      "./pythonscripts/yt.py",
      accessToken,
      title,
      description,
      // video.path // Assuming video.path is the correct path to the video file
      video_path
    ]);

    // Rest of your existing code...

    pythonProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    pythonProcess.stderr.on('data', (data) => {
      console.log(data.toString());
    }
    );
    res.json({ message: 'Video uploaded successfully!' });
    // if (!accessToken) return res.status(404).json({ message: "User does not exist!" });
    //   // Create a YouTube client with the access token
    //   const youtube = google.youtube({
    //     version: 'v3',
    //     auth: accessToken,
    //   });

    //  // Read the video file data as a readable stream
    // const videoData = fs.createReadStream(video.path);

    // // Construct the request body for video upload
    // const requestBody = {
    //   snippet: {
    //     title,
    //     description,
    //     // categoryId: category,
    //     // tags: tags.split(','),
    //   },
    //   status: {
    //     privacyStatus: privacy,
    //   },
    // };

    //   // Upload the video
    //   const response = await youtube.videos.insert({
    //     resource: requestBody,
    //     part: 'snippet,status',
    //     media: {
    //       mimeType: video.mimetype,
    //       body: videoData,
    //     },
    //   });

    //   // Handle upload response
    //   if (response.data && response.data.id) {
    //     console.log('Video uploaded successfully:', response.data.id);
    //     res.json({ message: 'Video uploaded successfully!' });
    //   } else {
    //     res.status(500).json({ message: 'Failed to upload video' });
    //   }

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" });
  }
})

// start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.clear()
  init()
  console.log(`Server @ http://localhost:${PORT}`);
});