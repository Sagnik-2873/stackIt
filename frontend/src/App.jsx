import { BrowserRouter, Routes, Route } from "react-router-dom";
import AskQuestion from "./pages/AskQuestion";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <div className="max-w-4xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ask" element={<AskQuestion />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

