import { Router } from "express";
import axios from "axios";

const router = Router();

router.get("/", async (req, res) => {
  console.log("/api/trending route request received.");

  const maxResults = req.query.maxResults || 5;

  try {
    if (!process.env.YOUTUBE_API_KEY)
      throw new Error("YOUTUBE_API_KEY not found in environment variables.");

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "id,snippet",
          chart: "mostPopular",
          regionCode: "JP",
          maxResults: maxResults,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching trending data:", error);
  }
});

export default router;
