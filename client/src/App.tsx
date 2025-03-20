import "./App.css";
import VideoCards from "./components/VideoCards";
import useTrendingVideos from "./hooks/useTrendingVideos";

const App = () => {
  const { trendingData, fetchTrendingVideos, hasMore } = useTrendingVideos();

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
