import { useState, useEffect } from "react";
import "./App.css";
// import VideoCard from "./components/VideoCard";
import VideoCards from "./components/VideoCards";
import { VideoCollectionData } from "./types/VideoCollectionData";

const App = () => {
  const [trendingData, setTrendingData] = useState<VideoCollectionData | null>(
    null
  );

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
    <div id="app">
      <button id="fetch-trending" type="button" onClick={fetchTrendingVideos}>
        Get trending videos
      </button>
      <VideoCards data={trendingData} />
    </div>
  );
};

export default App;
