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

app.get("/api/debug-files", (req, res) => {
  const fs = require("fs");
  const path = require("path");

  // Get the search term from query parameter
  const searchTerm = "base.dat.gz";

  // Results will be stored here
  const results: Array<{
    path: string;
    isDirectory: boolean;
    size: number;
    modifiedTime: Date;
  }> = [];

  // Recursive function to search directories
  const searchDirectory = (dirPath: string, relativePath: string = "") => {
    try {
      const items = fs.readdirSync(dirPath);

      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const itemRelativePath = path.join(relativePath, item);

        try {
          const stats = fs.statSync(fullPath);

          // Check if name matches search term (if provided)
          if (
            !searchTerm ||
            item.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            results.push({
              path: itemRelativePath,
              isDirectory: stats.isDirectory(),
              size: stats.size,
              modifiedTime: stats.mtime,
            });
          }

          // If it's a directory, search inside it recursively
          if (stats.isDirectory()) {
            searchDirectory(fullPath, itemRelativePath);
          }
        } catch (err) {
          // Skip files/folders we can't access
          console.error(`Error accessing ${fullPath}: ${err}`);
        }
      }
    } catch (err) {
      console.error(`Error reading directory ${dirPath}: ${err}`);
    }
  };

  try {
    // Start search from project root
    const rootDir = process.cwd();
    searchDirectory(rootDir);

    res.status(200).json({
      searchTerm: searchTerm || "all files",
      rootDirectory: rootDir,
      totalResults: results.length,
      results: results,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error occurred",
      currentDirectory: process.cwd(),
    });
  }
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
