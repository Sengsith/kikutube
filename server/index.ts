import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load env variables
dotenv.config();
import videosRouter from "./routes/videosRoute";
import searchRouter from "./routes/searchRoute";

const app = express();
const port = process.env.PORT || 3001;

// For different domains when deployed
app.use(cors());

// Root route
app.get("/", (req, res) => {
  console.log("Root route request received.");
  res.send({ message: "Hello from the backend!" });
});

// videos route
// params: {part: "id,snippet", chart: "mostPopular", regionCode: "JP", maxResults: "5"
// GET https://www.googleapis.com/youtube/v3/videos
app.use("/api/videos", videosRouter);
app.use("/api/search", searchRouter);

app.listen(port, () => {
  console.log("Server is running!");
});

// search endpoint for search bar queries
// /search
// GET https://www.googleapis.com/youtube/v3/search
// params: q, type?, part, maxResults
// has access to captions too!
// search channels and videos, captions need to search videos only though!

// search endpoint for list of channel videos
// /search
// GET https://www.googleapis.com/youtube/v3/search
