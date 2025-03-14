import { YouTubeVideo, Channel } from "@sengsith/shared-types";

// Data returned from API is an object with an items array
export interface VideoCollectionData {
  items: [
    {
      video: YouTubeVideo;
      channel: Channel;
    }
  ];
}
