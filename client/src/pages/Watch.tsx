import "./watch.css";
import { useParams, useLocation } from "react-router";
import YouTube from "react-youtube";
import { YouTubeVideo, Channel } from "@sengsith/shared-types";

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

  console.log(video);
  console.log(channel);

  return (
    <div id="watch-video">
      <YouTube videoId={id} opts={opts} />
      <div id="watch-info">
        <p id="watch-video-title">{video.snippet.title}</p>
        <img
          id="watch-channel-thumbnail"
          src={channel.snippet.thumbnails.medium?.url}
          alt={video.snippet.channelTitle}
          loading="lazy"
        />
        <p id="watch-channel-title">{video.snippet.channelTitle}</p>
        <p id="watch-channel-subs">{channel.statistics.subscriberCount} subs</p>
        <p id="watch-video-views">{video.statistics.viewCount} views</p>
        <p id="watch-video-published">{video.snippet.publishedAt}</p>
      </div>
    </div>
  );
};

export default Watch;
