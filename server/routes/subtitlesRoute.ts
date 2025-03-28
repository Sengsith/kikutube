import { Router, Request, Response } from "express";
import { getSubtitles, Subtitle } from "youtube-captions-scraper";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  console.log("/api/subtitles route request received.");

  try {
    // Check if id from request is not undefined or null
    const id = req.query.id;
    if (!id) {
      res.status(400).json({
        message: "Subtitles not found",
        error: "ID is an invalid string",
      });
      return;
    }

    const subOpts = {
      videoID: id.toString(),
      lang: "ja",
    };
    const captions = await getSubtitles(subOpts);
    res.json(captions);
  } catch (error) {
    console.error("Error fetching subtitles");
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
