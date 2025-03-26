import "./watch.css";
import { useParams } from "react-router";
import YouTube from "react-youtube";
import {
  formatDate,
  shortFormatSubsOrViews,
  longFormatViews,
} from "../utils/format";
import useFetchSingleVideo from "../hooks/useFetchSingleVideo";

const Watch = () => {
  // Use the id if the user bookmarks the page, fetch videoID data with initial page load
  const { id } = useParams();

  const { VCData } = useFetchSingleVideo(id);

  // Options for YouTube player
  const opts = {
    height: "300",
    width: "100%",
    // playerVars: {
    //   // https://developers.google.com/youtube/player_parameters
    // },
  };

  return (
    <>
      {VCData ? (
        <div id="watch-video-wrapper">
          <YouTube id="watch-video-player" videoId={id} opts={opts} />
          <div id="watch-info-wrapper">
            <p id="watch-video-title">{VCData.video.snippet.title}</p>
            <div id="watch-channel-info">
              <img
                id="watch-channel-thumbnail"
                src={VCData.channel.snippet.thumbnails.medium?.url}
                alt={VCData.video.snippet.channelTitle}
                loading="lazy"
              />
              <p id="watch-channel-title">
                {VCData.video.snippet.channelTitle}
              </p>
              <p id="watch-channel-subs">
                {shortFormatSubsOrViews(
                  VCData.channel.statistics.subscriberCount,
                  "subscribers"
                )}
              </p>
            </div>
            <div id="watch-info-stats">
              <p id="watch-video-views">
                {longFormatViews(VCData.video.statistics.viewCount)}
              </p>
              <p id="watch-video-published">
                {formatDate(VCData.video.snippet.publishedAt)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div id="watch-not-found">
          <h2>Oops! Video not found.</h2>
        </div>
      )}
    </>
  );
};

export default Watch;
