import VideoCards from "../components/VideoCards";
import { useTrending } from "../hooks/useTrending";

const Home = () => {
  const { trendingData, fetchTrendingVideos, hasMoreTrending } = useTrending();

  return (
    <>
      <VideoCards
        data={trendingData}
        fetchVideos={fetchTrendingVideos}
        hasMore={hasMoreTrending}
      />
    </>
  );
};

export default Home;
