// Each video may or may not have specific resolution
export interface VideoThumbnails {
  default?: { url: string };
  medium?: { url: string };
  high?: { url: string };
  standard?: { url: string };
  maxres?: { url: string };
}

// Detail about each video
export interface VideoSnippet {
  publishedAt: string;
  channelId: string;
  channelTitle: string;
  title: string;
  description: string;
  thumbnails: VideoThumbnails;
}

// Each video has these properties
export interface YouTubeVideo {
  id: string;
  snippet: VideoSnippet;
  contentDetails: { duration: string };
  statistics: { viewCount: string };
}

// Each channel may or may not have specific resolution
export interface ChannelThumbnails {
  default?: { url: string };
  medium?: { url: string };
  high?: { url: string };
}

// Details about each channel
export interface ChannelSnippet {
  title: string;
  description: string;
  customUrl: string;
  thumbnails: ChannelThumbnails;
}

// Each channel has these properties
export interface Channel {
  id: string;
  snippet: ChannelSnippet;
}
