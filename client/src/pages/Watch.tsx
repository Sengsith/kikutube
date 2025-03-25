import "./watch.css";
import { useParams, useLocation } from "react-router";
import YouTube from "react-youtube";
import { YouTubeVideo, Channel } from "@sengsith/shared-types";
import {
  formatDate,
  shortFormatSubsOrViews,
  longFormatViews,
} from "../utils/format";

const Watch = () => {
  // Use the id if the user bookmarks the page, fetch videoID data with initial page load
  const { id } = useParams();
  const location = useLocation();
  const video: YouTubeVideo = location.state.video;
  const channel: Channel = location.state.channel;

  // Options for YouTube player
  const opts = {
    height: "300",
    width: "100%",
    // playerVars: {
    //   // https://developers.google.com/youtube/player_parameters
    // },
  };

  // TODO: initial load with id, transcript layout

  return (
    <div id="watch-video-wrapper">
      <YouTube id="watch-video-player" videoId={id} opts={opts} />
      <div id="watch-info-wrapper">
        <p id="watch-video-title">{video.snippet.title}</p>
        <div id="watch-channel-info">
          <img
            id="watch-channel-thumbnail"
            src={channel.snippet.thumbnails.medium?.url}
            alt={video.snippet.channelTitle}
            loading="lazy"
          />
          <p id="watch-channel-title">{video.snippet.channelTitle}</p>
          <p id="watch-channel-subs">
            {shortFormatSubsOrViews(
              channel.statistics.subscriberCount,
              "subscribers"
            )}
          </p>
        </div>
        <div id="watch-info-stats">
          <p id="watch-video-views">
            {longFormatViews(video.statistics.viewCount)}
          </p>
          <p id="watch-video-published">
            {formatDate(video.snippet.publishedAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Watch;
