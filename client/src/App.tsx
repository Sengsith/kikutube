import "./App.css";
import { Route, Routes, Link } from "react-router";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import NotFound from "./pages/NotFound";
import { TrendingProvider } from "./contexts/trending";

const App = () => {
  return (
    <div id="app">
      <TrendingProvider>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TrendingProvider>
    </div>
  );
};

export default App;
