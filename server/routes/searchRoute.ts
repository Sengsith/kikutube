import { Router, Request, Response } from "express";
import axios, { AxiosError } from "axios";
import kuromoji from "kuromoji";
import * as path from "path";

const router = Router();

// Helps get keywords from Japanese video titles, kuromoji helps parse Japanese and English text
const extractJapaneseKeywords = async (title: string): Promise<string[]> => {
  // kuromoji uses a callback pattern so we need to return promise
  return new Promise((resolve, reject) => {
    const dictPath = path.join(process.cwd(), "data/dict");
    console.log("Dictionary path:", dictPath);
    // Initialize analyzer with Japanese diciontary files
    kuromoji.builder({ dicPath: dictPath }).build((err, tokenizer) => {
      if (err) {
        reject(err);
        return;
      }
      // Break down Japanese text into tokens (words and particles)
      const tokens = tokenizer.tokenize(title);
      // Filter tokens to keep specific parts of speech like nouns and verbs, but want to exclude basic verb forms
      const keywords = tokens
        .filter(
          (token) =>
            token.pos === "名詞" ||
            (token.pos === "動詞" &&
              token.basic_form !== "する" &&
              token.basic_form !== "ある" &&
              token.basic_form !== "いる")
        )
        // surface_form is the actual text of the string from title
        .map((token) => token.surface_form)
        // Removes single character words so we have more specificity
        .filter((word) => word.length > 1);
      // Resolve with top 5 unique keywords
      resolve([...new Set(keywords)].slice(0, 5));
    });
  });
};

router.get("/", async (req: Request, res: Response) => {
  console.log("/api/search route request received.");

  try {
    if (!process.env.YOUTUBE_API_KEY)
      throw new Error("YOUTUBE_API_KEY not found in environment variables.");

    interface Params {
      part: string;
      regionCode: string;
      q?: string;
      maxResults?: string;
      pageToken?: string;
      videoCategoryId?: string;
      type?: string;
      key: string;
    }

    const params: Params = {
      part: "snippet",
      regionCode: "JP",
      key: process.env.YOUTUBE_API_KEY,
    };

    // Create our params and assign values to params object
    const id = req.query.id?.toString(); // This is used to exclude current video
    const maxResults = req.query.maxResults?.toString();
    const pageToken = req.query.pageToken?.toString();
    const type = req.query.type?.toString();
    const videoCategoryId = req.query.videoCategoryId?.toString();
    // Form q with tags + title
    let titleKeywords: string[] = [];
    let tags: string[] = [];
    let q = "";
    if (req.query.title) {
      titleKeywords = await extractJapaneseKeywords(req.query.title.toString());
    }
    if (req.query.tags) {
      tags = req.query.tags.toString().split(",");
    }
    q = [...titleKeywords, ...tags].join("|");
    Object.assign(params, {
      maxResults,
      pageToken,
      type,
      videoCategoryId,
      q,
    });

    // 1. Fetch trending videos from /search endpoint
    const searchResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      { params }
    );

    // Do not go further if searchResponse is empty
    if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
      console.error("No videos found:", {
        part: params.part,
        regionCode: params.regionCode,
        id: id,
        q: params.q,
        maxResults: params.maxResults,
        pageToken: params.pageToken,
        videoCategoryId: params.videoCategoryId,
        type: params.type,
      });

      res.status(400).json({
        message: "No videos found",
        error: "The YouTube API returned no video results",
        params: {
          part: params.part,
          regionCode: params.regionCode,
          id: id,
          q: params.q,
          maxResults: params.maxResults,
          pageToken: params.pageToken,
          videoCategoryId: params.videoCategoryId,
          type: params.type,
        },
      });
      return;
    }

    interface SearchItem {
      id: {
        videoId?: string;
        channelId?: string;
      };
    }
    // 2. Form searchData array which is a comma separated list of video IDs that does not include the video from Watch page
    const searchData: string[] = searchResponse.data.items
      .filter((item: SearchItem) => item.id.videoId !== id)
      .map((item: SearchItem) => item.id.videoId);

    // 3. Send a get request to /api/videos with searchData as the "id" parameter
    const baseURL = process.env.VITE_SERVER_URL + "/api/videos";
    const url = new URL(baseURL);
    url.searchParams.append("id", searchData.join(","));
    if (maxResults)
      url.searchParams.append("maxResults", maxResults.toString());

    const videosResponse = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const videosData = await videosResponse.json();
    res.json({
      items: videosData,
      nextPageToken: searchResponse.data.nextPageToken,
    });
  } catch (error) {
    // Axios errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      res.status(axiosError.response?.status || 500).json({
        message: "Error fetching YouTube data",
        error: axiosError.message,
      });
    } else {
      // Generic errors
      res.status(500).json({
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
});

export default router;
