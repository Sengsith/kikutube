import { useState, useEffect, useRef } from "react";
import { YouTubeVideo, Channel } from "@sengsith/shared-types";
import { useLocation } from "react-router";

// Takes in an id: string, fetches single video and channel data
const useFetchSingleVideo = (id: string | undefined) => {
  interface VideoChannelData {
    video: YouTubeVideo;
    channel: Channel;
  }

  // VC = VideoChannel
  const [VCData, setVCData] = useState<VideoChannelData>(
    useLocation().state || null
  );
  // Track initial load so we only run useEffect once
  const initialWatchRef = useRef(false);

  useEffect(() => {
    // Initial Load with ID
    if (initialWatchRef.current) return;

    const fetchSingleVideo = async () => {
      if (!id) return;

      try {
        // Create URL object to handle query params
        const baseURL = import.meta.env.VITE_SERVER_URL + "/api/videos";
        const url = new URL(baseURL);

        // Add maxResults param, also set value here
        url.searchParams.append("maxResults", "1");
        // Add id param
        url.searchParams.append("id", id);

        // Fetch trending data
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();

        setVCData({
          video: data.items[0].video,
          channel: data.items[0].channel,
        });
      } catch (error) {
        console.error("Error fetching beckend:", error);
      }
    };

    fetchSingleVideo();

    console.log("mount useEffect");
    return () => {
      console.log("unmounted");
      initialWatchRef.current = true;
    };
  }, [id]);

  return { VCData };
};

export default useFetchSingleVideo;
