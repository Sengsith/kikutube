import { useContext } from "react";
import { TrendingContextType, TrendingContext } from "../contexts/trending";

export const useTrending = (): TrendingContextType => {
  const context = useContext(TrendingContext);
  if (context === null)
    throw new Error("useTrending must be used within a TrendingProvider");
  return context;
};
