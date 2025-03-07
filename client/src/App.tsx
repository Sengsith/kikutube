import { useState } from "react";
import "./App.css";

interface VideoSnippet {
  title: string;
  description: string;
  thumbnails: {
    medium: {
      url: string;
    };
  };
}

interface YouTubeVideo {
  snippet: VideoSnippet;
  id: string; // video ID
}

interface BackendData {
  items: YouTubeVideo[];
}

const App = () => {
  const [backendData, setBackendData] = useState<BackendData | null>(null);

  const handleOnClick = async () => {
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

  return (
    <>
      <h1>Hello from client!</h1>
      <button type="button" onClick={handleOnClick}>
        Get trending videos
      </button>
      <div>
        {backendData?.items?.map((video, index) => (
          <div key={index}>
            <h3>{video.snippet.title}</h3>
            <p>{video.snippet.description}</p>
            <img
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default App;
