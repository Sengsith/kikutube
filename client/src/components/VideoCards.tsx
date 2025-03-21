import { useState, useEffect } from "react";
import "./videoCards.css";
import { VideoCollectionData } from "../types/VideoCollectionData";
import { formatDistanceToNow, parseISO } from "date-fns";
import { parse as parseDuration } from "duration-fns";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router";

interface VideoCardsProps {
  data: VideoCollectionData | null;
  fetchVideos: () => void;
  hasMore: boolean;
}

const VideoCards = ({ data, fetchVideos, hasMore }: VideoCardsProps) => {
  // Flag to exit from useEffect if we have enough content already
  const [needInitialFetches, setNeedInitialFetches] = useState(true);

  const formatViews = (viewCount: string): string => {
    // Cast string to number
    const numViews = Number(viewCount);

    // Special case
    if (numViews === 1) return "1 view";

    // Quotient range check to determine if we show 1 decimal place
    const formatter = (quotient: number, suffix: string): string => {
      // For a quotient between 1.1 and 1.9 inclusive, show 1 decimal place
      return quotient >= 1.1 && quotient <= 9.9
        ? `${quotient.toFixed(1)}${suffix} views`
        : `${Math.floor(quotient)}${suffix} views`;
    };

    // Array of thresholds and corresponding suffixes
    const formats = [
      { threshold: 1_000_000_000, suffix: "B" },
      { threshold: 1_000_000, suffix: "M" },
      { threshold: 1_000, suffix: "K" },
    ];

    for (const { threshold, suffix } of formats) {
      // Format if greater or equal to threshold, if not, move down the list of formats
      if (numViews >= threshold) {
        return formatter(numViews / threshold, suffix);
      }
    }

    return `${viewCount} views`;
  };

  // Uses date-fns library to calculate distance from now to publishedDate
  const formatDate = (publishedDate: string): string => {
    // ISO_8601
    // Z suffix means UTC time
    // 2025-03-16T10:34:00Z
    // YYYY-MM-DDTHH:MM:SSZ
    // Parse the ISO string to Date object
    const date = parseISO(publishedDate);

    // Get difference using date-fns
    const distance = formatDistanceToNow(date, {
      addSuffix: true,
      includeSeconds: true,
    });

    return distance;
  };

  // Uses duration-fns library to format video duration
  const formatTime = (isoDuration: string): string => {
    // Parse the ISO duration string
    const duration = parseDuration(isoDuration);

    // Extract hours, minutes, seconds
    const hours = duration.hours || 0;
    const minutes = duration.minutes || 0;
    const seconds = duration.seconds || 0;

    // Format based on available components
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    } else if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    } else {
      return `0:${seconds.toString().padStart(2, "0")}`;
    }
  };

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
      <div id="video-cards">
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
                    <Link to={`/watch/${item.video.id}`}>
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
                      <Link to={`/watch/${item.video.id}`}>
                        <h3 className="video-title">
                          {item.video.snippet.title}
                        </h3>
                      </Link>
                      {/* prettier-ignore */}
                      <p className="channel-title">
                      {item.video.snippet.channelTitle} &#8226; {formatViews(item.video.statistics.viewCount)} &#8226; {formatDate(item.video.snippet.publishedAt)}
                    </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default VideoCards;
