// video id: Grn88mr1m7s
// caption id: AUieDaaQfEjHZMzjagCZu0IyMpe19xEoUVyfUSm1KpgmcdI6XQA

// External library
// https://www.npmjs.com/package/youtube-captions-scraper
// The only thing the library needs is the videoId and an optional lang param

// What do we need from the youtube captions?
// Caption: {
//   start: number;
//   duration: number;
//   text: string;
// }

interface TranscriptProps {
  id: string | undefined;
}

const Transcript = ({ id }: TranscriptProps) => {
  return <div>Transcript for video: {id}</div>;
};

export default Transcript;
