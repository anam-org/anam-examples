"use client";

import {
  AnamContextProvider,
  SettingsContextProvider,
  VideoAudioPermissionProvider,
} from "@/contexts";
import { Text, Spinner, Flex } from "@radix-ui/themes";
import { useEffect } from "react";
import { ReactNode } from "react";
import { errorHandler } from "@/utils";
import { useFetchToken } from "@/hooks";

/**
 * Providers component that wraps the application with necessary context providers
 * for Anam AI client, video/audio permissions, and settings management.
 * It also handles session token fetching and loading/error states.
 */
export function Providers({ children }: { children: ReactNode }) {
  const { sessionToken, error, isValidating } = useFetchToken();

  useEffect(() => {
    if (error) {
      errorHandler(
        `Error: ${error?.message || "Unknown error occurred"}`,
        "_providers.tsx",
      );
    }
  }, [error]);

  if (isValidating) {
    return (
      <Flex align="center" justify="center" height="100vh" width="100vw">
        <Spinner size="3" />
        <Text>Loading...</Text>
      </Flex>
    );
  }

  return (
    <AnamContextProvider sessionToken={sessionToken}>
      <VideoAudioPermissionProvider>
        <SettingsContextProvider>{children}</SettingsContextProvider>
      </VideoAudioPermissionProvider>
    </AnamContextProvider>
  );
}
