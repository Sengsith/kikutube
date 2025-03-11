import { Router } from "express";
import axios from "axios";

const router = Router();

// Each video may or may not have specific resolution
interface VideoThumbnails {
  default?: { url: string };
  medium?: { url: string };
  high?: { url: string };
  standard?: { url: string };
  maxres?: { url: string };
}

// Detail about each video
interface VideoSnippet {
  publishedAt: string;
  channelId: string;
  channelTitle: string;
  title: string;
  description: string;
  thumbnails: VideoThumbnails;
}

// Each video has these properties
interface YouTubeVideo {
  id: string;
  snippet: VideoSnippet;
  contentDetails: { duration: string };
  statistics: { viewCount: string };
}

// Each channel may or may not have specific resolution
interface ChannelThumbnails {
  default?: { url: string };
  medium?: { url: string };
  high?: { url: string };
}

// Details about each channel
interface ChannelSnippet {
  title: string;
  description: string;
  customUrl: string;
  thumbnails: ChannelThumbnails;
}

// Each channel has these properties
interface Channel {
  id: string;
  snippet: ChannelSnippet;
}

router.get("/", async (req, res) => {
  console.log("/api/trending route request received.");

  const maxResults = req.query.maxResults || 5;

  try {
    if (!process.env.YOUTUBE_API_KEY)
      throw new Error("YOUTUBE_API_KEY not found in environment variables.");

    // 1. Fetch trending videos from /videos endpoint
    const videoResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "id,snippet,contentDetails,statistics",
          chart: "mostPopular",
          regionCode: "JP",
          maxResults: maxResults,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

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
          part: "id,snippet",
          id: channelIDs.join(","),
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

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
    res.json({ items: trendingVideos });
  } catch (error) {
    console.error("Error fetching trending data:", error);
  }
});

export default router;
