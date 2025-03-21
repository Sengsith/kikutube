import { createContext } from "react";
import { VideoCollectionData } from "../../types/VideoCollectionData";

// Create context
export interface TrendingContextType {
  trendingData: VideoCollectionData | null;
  fetchTrendingVideos: () => void;
  hasMoreTrending: boolean;
}

// Create context with null as default value
export const TrendingContext = createContext<TrendingContextType | null>(null);
