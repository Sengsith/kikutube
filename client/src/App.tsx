import React, { useState, useEffect } from "react";
import "./App.css";
import { YouTubeVideo, Channel } from "@sengsith/shared-types";
import VideoCard from "./components/VideoCard";

// Data returned from API is an object with an items array
interface TrendingData {
  items: [
    {
      video: YouTubeVideo;
      channel: Channel;
    }
  ];
}

const App = () => {
  const [trendingData, setTrendingData] = useState<TrendingData | null>(null);

  // Data fetched from backend is combined from /videos and /channels endpoint from YouTube's API. Both video and channel is merged into one object (BackendData). TypeScript is here to reinforce the properties we are definitely using, but if we need access to more data, add to interfaces
  const fetchTrendingVideos = async () => {
    try {
      const URL = import.meta.env.VITE_SERVER_URL + "/api/trending";
      const res = await fetch(URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setTrendingData(data);
    } catch (error) {
      console.error("Error fetching beckend:", error);
    }
  };

  useEffect(() => {
    console.log(trendingData);
  }, [trendingData]);

  return (
    <>
      <h1>Hello from client!</h1>
      <button id="fetch-trending" type="button" onClick={fetchTrendingVideos}>
        Get trending videos
      </button>
      <div id="video-cards">
        {trendingData &&
          trendingData.items.map((item, index) => (
            <React.Fragment key={`trending-${index}`}>
              <VideoCard item={item} />
            </React.Fragment>
          ))}
      </div>
    </>
  );
};

export default App;
