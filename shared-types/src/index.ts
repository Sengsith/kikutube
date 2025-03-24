/* If you need to update types in the future
1. Make changes you need
2. Update the version in package.json
3. Rebuild and republish

cd kikutube/shared-types
npm run build
npm publish

4. Update the package in client and server folders

cd kikutube/client
dotenv npm update @sengsith/shared-types
cd ../server
dotenv npm update @sengsith/shared-types
*/

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

export interface ChannelStatistics {
  subscriberCount: string;
}

// Each channel has these properties
export interface Channel {
  id: string;
  snippet: ChannelSnippet;
  statistics: ChannelStatistics;
}
