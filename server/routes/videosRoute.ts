import { Router, Request, Response } from "express";
import axios, { AxiosError } from "axios";
import { YouTubeVideo, Channel } from "@sengsith/shared-types";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  console.log("/api/videos route request received.");

  try {
    if (!process.env.YOUTUBE_API_KEY)
      throw new Error("YOUTUBE_API_KEY not found in environment variables.");

    interface Params {
      part: string;
      chart?: string;
      regionCode: string;
      id?: string;
      maxResults?: string;
      pageToken?: string;
      key: string;
    }

    const params: Params = {
      part: "id,snippet,contentDetails,statistics",
      chart: "mostPopular",
      regionCode: "JP",
      key: process.env.YOUTUBE_API_KEY,
    };

    const maxResults = req.query.maxResults?.toString();
    const pageToken = req.query.pageToken?.toString();
    const id = req.query.id?.toString();
    if (id) delete params.chart;
    Object.assign(params, { maxResults, pageToken, id });

    // 1. Fetch trending videos from /videos endpoint
    const videoResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      { params }
    );

    // Do not go further if videoResponse is empty
    if (!videoResponse.data.items || videoResponse.data.items.length === 0) {
      console.error("No videos found:", {
        part: params.part,
        chart: params.chart,
        regionCode: params.regionCode,
        id: params.id,
        maxResults: params.maxResults,
        pageToken: params.pageToken,
      });

      res.status(400).json({
        message: "No videos found",
        error: "The YouTube API returned no video results",
        params: {
          part: params.part,
          chart: params.chart,
          regionCode: params.regionCode,
          id: params.id,
          maxResults: params.maxResults,
          pageToken: params.pageToken,
        },
      });
      return;
    }

    // 2. Extract the unique channel IDs
    const channelIDs = [
      ...new Set(
        videoResponse.data.items.map(
          (video: { snippet: { channelId: string } }) => video.snippet.channelId
        )
      ),
    ];

    // 3. Fetch channel data with IDs from /channels endpoint
    const channelsResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        params: {
          part: "id,snippet,statistics",
          id: channelIDs.join(","),
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    // Do not go further if channelsResponse is empty
    if (
      !channelsResponse.data.items ||
      channelsResponse.data.items.length === 0
    ) {
      console.error("No channels found");
      res.status(400).json({
        message: "No channels found",
        error: "The YouTube API returned no channel results",
      });
      return;
    }

    // 4. Create a lookup map for channels
    // Record<channelId, thumbnails>
    // DEBUG CHANNEL ID: UCmBA_wu8xGg1OfOkfW13Q0Q
    const channelMap: Record<string, Channel> = {};
    channelsResponse.data.items.forEach((channel: Channel) => {
      channelMap[channel.id] = channel;
    });

    // 5. Merge video and channel data
    // All data from API is retained, typescript interfaces reinforce what properties we are using
    const trendingVideos = videoResponse.data.items.map(
      (video: YouTubeVideo) => ({
        video: video,
        channel: channelMap[video.snippet.channelId],
      })
    );

    // 6. Return the merged data
    res.json({
      items: trendingVideos,
      nextPageToken: videoResponse.data.nextPageToken,
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
