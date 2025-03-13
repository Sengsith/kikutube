import { YouTubeVideo, Channel } from "@sengsith/shared-types";
import "./videoCard.css";

interface VideoCardProps {
  item: {
    video: YouTubeVideo;
    channel: Channel;
  };
}

const VideoCard = ({ item }: VideoCardProps) => {
  return (
    <div className="video-card">
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
          <p className="channel-title">{item.video.snippet.channelTitle}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
