import "./App.css";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import { TrendingProvider } from "./contexts/trending";

const App = () => {
  return (
    <div id="app">
      <TrendingProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:id" element={<Watch />} />
        </Routes>
      </TrendingProvider>
    </div>
  );
};

export default App;
