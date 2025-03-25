import { useState, useEffect } from "react";
import "./videoCards.css";
import { VideoCollectionData } from "../types/VideoCollectionData";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router";
import {
  formatDateDistance,
  formatTime,
  shortFormatSubsOrViews,
} from "../utils/format";

interface VideoCardsProps {
  data: VideoCollectionData | null;
  fetchVideos: () => void;
  hasMore: boolean;
}

const VideoCards = ({ data, fetchVideos, hasMore }: VideoCardsProps) => {
  // Flag to exit from useEffect if we have enough content already
  const [needInitialFetches, setNeedInitialFetches] = useState(true);

  // Check if we need to load more content when data changes
  useEffect(() => {
    if (!hasMore || !data || !needInitialFetches) return;

    // Get the parent element to check its dimensions
    const wrapper = document.getElementById("video-cards-wrapper");
    if (!wrapper) return;

    const needsMoreContent = wrapper.scrollHeight <= window.innerHeight;

    // If there's not enough content and we're allowed to load more, trigger fetch
    if (needsMoreContent && hasMore) {
      fetchVideos();
    } else {
      setNeedInitialFetches(false);
    }
  }, [data, hasMore, fetchVideos, needInitialFetches]);

  return (
    <div id="video-cards-wrapper">
      <InfiniteScroll
        dataLength={data?.items.length || 0}
        next={fetchVideos}
        hasMore={hasMore}
        loader={<></>}
        endMessage={<></>}
        scrollThreshold={0.9}
      >
        <div id="video-cards">
          {data &&
            data.items.map((item, index) => (
              <div key={`trending-${index}`} className="video-card">
                <div className="video-thumbnail-wrapper">
                  <Link to={`/watch/${item.video.id}`} state={item}>
                    <img
                      className="video-thumbnail"
                      src={item.video.snippet.thumbnails.medium?.url}
                      alt={item.video.snippet.title}
                      loading="lazy"
                    />
                    <p className="video-duration">
                      {formatTime(item.video.contentDetails.duration)}
                    </p>
                  </Link>
                </div>
                <div className="video-info">
                  <img
                    className="channel-thumbnail"
                    src={item.channel.snippet.thumbnails.medium?.url}
                    alt={item.video.snippet.channelTitle}
                    loading="lazy"
                  />
                  <div className="video-text-content">
                    <Link to={`/watch/${item.video.id}`} state={item}>
                      <h3 className="video-title">
                        {item.video.snippet.title}
                      </h3>
                    </Link>
                    {/* prettier-ignore */}
                    <p className="channel-title">
                      {item.video.snippet.channelTitle} &#8226; {shortFormatSubsOrViews(item.video.statistics.viewCount, "views")} &#8226; {formatDateDistance(item.video.snippet.publishedAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default VideoCards;
