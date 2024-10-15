import { Routes, Route } from "react-router-dom";
import { ConfigureAI, Feedback, Home, VideoCall } from "./pages";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/configure" element={<ConfigureAI />} />
      <Route path="/call" element={<VideoCall />} />
      <Route path="/feedback" element={<Feedback />} />
    </Routes>
  );
}
