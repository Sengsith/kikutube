import { useState, useEffect } from "react";
import "./App.css";
import { YouTubeVideo, Channel } from "@sengsith/shared-types";

// Data returned from API is an object with an items array
interface BackendData {
  items: [
    {
      video: YouTubeVideo;
      channel: Channel;
    }
  ];
}

const App = () => {
  const [backendData, setBackendData] = useState<BackendData | null>(null);

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
      setBackendData(data);
    } catch (error) {
      console.error("Error fetching beckend:", error);
    }
  };

  useEffect(() => {
    console.log(backendData);
  }, [backendData]);

  return (
    <>
      <h1>Hello from client!</h1>
      <button type="button" onClick={fetchTrendingVideos}>
        Get trending videos
      </button>
      <div>
        {backendData &&
          backendData.items.map((item, index) => (
            <div key={index}>
              <h3>{item.video.snippet.title}</h3>
              <img
                src={item.video.snippet.thumbnails.medium?.url}
                alt={item.video.snippet.title}
              />
              <h4>{item.video.snippet.channelTitle}</h4>
              <img
                src={item.channel.snippet.thumbnails.medium?.url}
                alt={item.video.snippet.channelTitle}
              />
              {/* <p>{video.snippet.description}</p> */}
            </div>
          ))}
      </div>
    </>
  );
};

export default App;
