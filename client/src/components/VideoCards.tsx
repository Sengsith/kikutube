import "./videoCards.css";
import { VideoCollectionData } from "../types/VideoCollectionData";
import { formatDistanceToNow, parseISO } from "date-fns";

interface VideoCardsProps {
  data: VideoCollectionData | null;
}

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
  const date = parseISO(publishedDate);

  const distance = formatDistanceToNow(date, {
    addSuffix: true,
    includeSeconds: true,
  });

  return distance;
};

const VideoCards = ({ data }: VideoCardsProps) => {
  return (
    <div id="video-cards-wrapper">
      <div id="video-cards">
        {data &&
          data.items.map((item, index) => (
            <div key={`trending-${index}`} className="video-card">
              <img
                className="video-thumbnail"
                src={item.video.snippet.thumbnails.medium?.url}
                alt={item.video.snippet.title}
                loading="lazy"
              />
              <div className="video-info">
                <img
                  className="channel-thumbnail"
                  src={item.channel.snippet.thumbnails.medium?.url}
                  alt={item.video.snippet.channelTitle}
                  loading="lazy"
                />
                <div className="video-text-content">
                  <h3 className="video-title">{item.video.snippet.title}</h3>
                  {/* prettier-ignore */}
                  <p className="channel-title">
                    {item.video.snippet.channelTitle} &#8226; {formatViews(item.video.statistics.viewCount)} &#8226; {formatDate(item.video.snippet.publishedAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default VideoCards;
