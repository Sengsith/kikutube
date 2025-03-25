import { formatDistanceToNow, parseISO } from "date-fns";
import { parse as parseDuration } from "duration-fns";

// Uses date-fns library to calculate distance from now to publishedDate
// (x time ago)
export const formatDateDistance = (publishedDate: string): string => {
  // ISO_8601
  // Z suffix means UTC time
  // 2025-03-16T10:34:00Z
  // YYYY-MM-DDTHH:MM:SSZ
  // Parse the ISO string to Date object
  const date = parseISO(publishedDate);

  // Get difference using date-fns
  const distance = formatDistanceToNow(date, {
    addSuffix: true,
    includeSeconds: true,
  });

  return distance;
};

// Returns copy of date in shortform
export const formatDate = (publishedDate: string): string => {
  const date = new Date(publishedDate);
  return date.toLocaleDateString();
};

// Uses duration-fns library to format video duration
export const formatTime = (isoDuration: string): string => {
  // Parse the ISO duration string
  const duration = parseDuration(isoDuration);

  // Extract hours, minutes, seconds
  const hours = duration.hours || 0;
  const minutes = duration.minutes || 0;
  const seconds = duration.seconds || 0;

  // Format based on available components
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  } else if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  } else {
    return `0:${seconds.toString().padStart(2, "0")}`;
  }
};

// Formats either subcount of viewcount into a shortened number
export const shortFormatSubsOrViews = (
  subCount: string,
  suffix: string
): string => {
  // Cast string to number
  const numViews = Number(subCount);

  // Special case
  if (numViews === 1) return "1 view";

  // Quotient range check to determine if we show 1 decimal place
  const formatter = (quotient: number, letterSuffix: string): string => {
    // For a quotient between 1.1 and 1.9 inclusive, show 1 decimal place
    return quotient >= 1.1 && quotient <= 9.9
      ? `${quotient.toFixed(1)}${letterSuffix} ${suffix}`
      : `${Math.floor(quotient)}${letterSuffix} ${suffix}`;
  };

  // Array of thresholds and corresponding suffixes
  const formats = [
    { threshold: 1_000_000_000, letterSuffix: "B" },
    { threshold: 1_000_000, letterSuffix: "M" },
    { threshold: 1_000, letterSuffix: "K" },
  ];

  for (const { threshold, letterSuffix } of formats) {
    // Format if greater or equal to threshold, if not, move down the list of formats
    if (numViews >= threshold) {
      return formatter(numViews / threshold, letterSuffix);
    }
  }

  return `${subCount} ${suffix}`;
};

// Returns a copy of a number string with commas
export const longFormatViews = (numString: string): string => {
  const number = Number(numString);
  const formattedNumber = number.toLocaleString("en-US");
  return `${formattedNumber} views`;
};
