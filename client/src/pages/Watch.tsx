import "./watch.css";
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation } from "react-router";
import YouTube from "react-youtube";
import {
  formatDate,
  shortFormatSubsOrViews,
  longFormatViews,
} from "../utils/format";
import { YouTubeVideo, Channel } from "@sengsith/shared-types";
import Transcript from "../components/Transcript";

interface VideoChannelData {
  video: YouTubeVideo;
  channel: Channel;
}

const Watch = () => {
  // Use the id passed from Link
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetches a single video taking in an id, called if
  const fetchSingleVideo = useCallback(
    async (id: string | undefined): Promise<VideoChannelData | null> => {
      if (!id) return null;

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

        if (!data.items || data.items.length === 0) {
          throw new Error(data.error || "No video data found");
        }

        return {
          video: data.items[0].video,
          channel: data.items[0].channel,
        };
      } catch (error) {
        console.error("Error fetching beckend:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occured"
        );
        return null;
      }
    },
    []
  );

  // Stores Video and Channel data coming from useLocation or fetched with id
  const [VCData, setVCData] = useState<VideoChannelData | null>(
    (useLocation().state as VideoChannelData) || null
  );

  // Keep track of initial VCData load
  const initialLoadRef = useRef(false);

  // Fetch data from backend only if VCData is falsy and id exists
  useEffect(() => {
    if (initialLoadRef.current) return;

    const loadVideoData = async () => {
      setLoading(true);

      if (!VCData && id) {
        const fetchedData = await fetchSingleVideo(id);
        setVCData(fetchedData);
      }

      setLoading(false);
    };

    loadVideoData();

    return () => {
      initialLoadRef.current = true;
    };
  }, [id, VCData, fetchSingleVideo]);

  // Options for YouTube player
  const opts = {
    height: "300",
    width: "100%",
    // playerVars: {
    //   // https://developers.google.com/youtube/player_parameters
    // },
  };

  // Show loading if still fetching data.
  if (loading) {
    return <div className="loading">Loading video...</div>;
  }

  // Show error if backend unable to fetch
  if (error) {
    return <div className="error">Oops! No video found: {error}</div>;
  }

  // Render out actual video data if all checks are good
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
          {id && <Transcript id={id} />}
        </div>
      )}
    </>
  );
};

export default Watch;
