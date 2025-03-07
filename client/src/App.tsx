import { useState } from "react";
import "./App.css";

const App = () => {
  interface BackendData {
    message: string;
  }

  const [backendData, setBackendData] = useState<BackendData | null>(null);

  const handleOnClick = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_SERVER_URL);
      const data = await res.json();
      setBackendData(data);
    } catch (error) {
      console.error("Error fetching beckend:", error);
    }
  };

  return (
    <>
      <h1>Hello from client!</h1>
      <button type="button" onClick={handleOnClick}>
        Greet the server
      </button>
      {backendData && <div>{backendData.message}</div>}
    </>
  );
};

export default App;
