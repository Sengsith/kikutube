import "./watch.css";
import { useState, useEffect, useRef } from "react";
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

  interface VideoChannelData {
    video: YouTubeVideo;
    channel: Channel;
  }

  // VC = VideoChannel
  const [VCData, setVCData] = useState<VideoChannelData>(
    useLocation().state || null
  );
  // Track initial load so we only run useEffect once
  const initialWatchRef = useRef(false);

  // Options for YouTube player
  const opts = {
    height: "300",
    width: "100%",
    // playerVars: {
    //   // https://developers.google.com/youtube/player_parameters
    // },
  };

  useEffect(() => {
    // Initial Load with ID
    if (initialWatchRef.current) return;

    const fetchSingleVideo = async () => {
      if (!id) return;

      try {
        // Create URL object to handle query params
        const baseURL = import.meta.env.VITE_SERVER_URL + "/api/videos";
        const url = new URL(baseURL);

        // Add maxResults param, also set value here
        url.searchParams.append("maxResults", "1");
        // Add id param
        url.searchParams.append("id", id);

        // Fetch trending data
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();

        setVCData({
          video: data.items[0].video,
          channel: data.items[0].channel,
        });
      } catch (error) {
        console.error("Error fetching beckend:", error);
      }
    };

    fetchSingleVideo();

    console.log("mount useEffect");
    return () => {
      console.log("unmounted");
      initialWatchRef.current = true;
    };
  }, [id]);

  // TODO: fix bug where if we start on /watch page, it does the api fetch from Home/VideoCards page
  // This probably happens because our app is rendered which also renders TrendingProvider which does that by default
  return (
    <>
      {VCData && (
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
      )}
    </>
  );
};

export default Watch;
