"use client";

import {
  AnamContextProvider,
  SettingsContextProvider,
  VideoAudioPermissionProvider,
} from "@/contexts";
import { ReactNode } from "react";

/**
 * Providers component that wraps the application with necessary context providers
 * for Anam AI client, video/audio permissions, and settings management.
 * It also handles session token fetching and loading/error states.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <AnamContextProvider>
      <VideoAudioPermissionProvider>
        <SettingsContextProvider>{children}</SettingsContextProvider>
      </VideoAudioPermissionProvider>
    </AnamContextProvider>
  );
}
