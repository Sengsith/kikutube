import "./transcript.css";
import { useState, useEffect, useRef } from "react";
import { SubtitleOutput } from "youtube-captions-scraper";

interface TranscriptProps {
  id: string;
}

const Transcript = ({ id }: TranscriptProps) => {
  const [subtitles, setSubtitles] = useState<SubtitleOutput>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intitialLoadRef = useRef(false);

  useEffect(() => {
    if (intitialLoadRef.current) return;

    const fetchSubtitles = async () => {
      try {
        setLoading(true);
        // Create URL object to handle query params
        const baseURL = import.meta.env.VITE_SERVER_URL + "/api/subtitles";
        const url = new URL(baseURL);

        // Add id param
        url.searchParams.append("id", id);

        // GET backend to fetch subtitle data
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log(data);
        setSubtitles(data);
      } catch (error) {
        console.error("Failed to fetch subtitles:", error);
        setError("Failed to fetch subtitles");
      } finally {
        setLoading(false);
      }
    };

    fetchSubtitles();
    console.log("Transcript useEffect");

    return () => {
      intitialLoadRef.current = true;
    };
  }, [id]);

  if (loading) return <div className="loading">Loading subtitles...</div>;

  if (error)
    return <div className="error">Oops! Could not find subtitles: {error}</div>;

  return (
    <div id="transcript-wrapper">
      <div>
        {subtitles.length > 0 ? (
          subtitles.map((line, index) => (
            <p key={`transcript-${index}`}>{line.text}</p>
          ))
        ) : (
          <div>Subtitles not available for this video.</div>
        )}
      </div>
    </div>
  );
};

export default Transcript;
