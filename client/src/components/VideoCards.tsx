import "./videoCards.css";
import { VideoCollectionData } from "../types/VideoCollectionData";

interface VideoCardsProps {
  data: VideoCollectionData | null;
}

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
                  <p className="channel-title">
                    {item.video.snippet.channelTitle}
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
