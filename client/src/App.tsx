import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import VideoCards from "./components/VideoCards";
import { VideoCollectionData } from "./types/VideoCollectionData";

const App = () => {
  const [trendingData, setTrendingData] = useState<VideoCollectionData | null>(
    null
  );

  // For trending videos pagination
  const [hasMore, setHasMore] = useState(true);
  const [nextPageToken, setNextPageToken] = useState("");
  const [loading, setLoading] = useState(false);

  // Track initial load
  const initialLoadRef = useRef(false);

  // Data fetched from backend is combined from /videos and /channels endpoint from YouTube's API. Both video and channel is merged into one object (BackendData). TypeScript is here to reinforce the properties we are definitely using, but if we need access to more data, add to interfaces
  const fetchTrendingVideos = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      // Create URL object to handle query params
      const baseURL = import.meta.env.VITE_SERVER_URL + "/api/videos";
      const url = new URL(baseURL);

      // Add maxResults param, also set value here
      url.searchParams.append("maxResults", "20");
      // Add pageToken param
      const _nextPageToken = nextPageToken;
      if (_nextPageToken) {
        url.searchParams.append("pageToken", _nextPageToken);
      }

      // Fetch trending data
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      // Update nextPageToken for next fetch
      if (data.nextPageToken) {
        setNextPageToken(data.nextPageToken);
      } else {
        // No more videos to fetch
        setHasMore(false);
      }

      setTrendingData((prev) => {
        if (!prev)
          return {
            items: [...data.items],
            nextPageToken: data.nextPageToken,
          };

        return {
          items: [...prev.items, ...data.items],
          nextPageToken: data.nextPageToken,
        };
      });
    } catch (error) {
      console.error("Error fetching beckend:", error);
      // Stop showing in case of an error and we reach the end
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, nextPageToken]);

  // Fetch trending videos on initial load
  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      fetchTrendingVideos();
    }
  }, [fetchTrendingVideos]);

  // Debug useEffect
  useEffect(() => {
    console.log(trendingData);
  }, [trendingData]);

  return (
    <div id="app">
      <VideoCards
        data={trendingData}
        fetchVideos={fetchTrendingVideos}
        hasMore={hasMore}
      />
    </div>
  );
};

export default App;
