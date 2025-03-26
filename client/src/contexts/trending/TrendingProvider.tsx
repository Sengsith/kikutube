import { ReactNode, useState, useEffect, useRef, useCallback } from "react";
import { VideoCollectionData } from "../../types/VideoCollectionData";
import { TrendingContext } from "./TrendingContext";
import { useLocation } from "react-router";

// Create provider component
interface TrendingProviderProps {
  children: ReactNode;
}

export const TrendingProvider = ({ children }: TrendingProviderProps) => {
  const [trendingData, setTrendingData] = useState<VideoCollectionData | null>(
    null
  );

  // For trending videos pagination
  const [hasMoreTrending, setHasMoreTrending] = useState(true);
  const [nextPageToken, setNextPageToken] = useState("");
  const [loading, setLoading] = useState(false);

  // Track initial load so we only run useEffect once
  const initialTrendingRef = useRef(false);

  const path = useLocation().pathname;

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
        setHasMoreTrending(false);
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
      setHasMoreTrending(false);
    } finally {
      setLoading(false);
    }
  }, [loading, nextPageToken]);

  // Fetch trending videos on initial load
  useEffect(() => {
    // Do not fetch videos if we're not on home page
    if (path !== "/") return;

    // If we are home and not have any filled data yet
    if (path === "/" && !initialTrendingRef.current) {
      fetchTrendingVideos();
    }

    return () => {
      initialTrendingRef.current = true;
    };
  }, [fetchTrendingVideos, path]);

  // Debug useEffect
  useEffect(() => {
    console.log(trendingData);
  }, [trendingData]);

  const value = { trendingData, fetchTrendingVideos, hasMoreTrending };

  return (
    <TrendingContext.Provider value={value}>
      {children}
    </TrendingContext.Provider>
  );
};
