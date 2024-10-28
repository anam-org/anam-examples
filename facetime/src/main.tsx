import "./globals.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AnamContextProvider } from "./contexts/AnamContext.tsx";
import { BrowserRouter } from "react-router-dom";
import { VideoAudioPermissionProvider } from "./contexts/VideoAudioPermissionContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AnamContextProvider>
        <VideoAudioPermissionProvider>
          <main className="appcontainer">
            <App />
          </main>
        </VideoAudioPermissionProvider>
      </AnamContextProvider>
    </BrowserRouter>
  </StrictMode>,
);
