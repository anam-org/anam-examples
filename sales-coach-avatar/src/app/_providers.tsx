"use client";

import { Text, Spinner, Flex } from "@radix-ui/themes";
import { useEffect, useState, ReactNode } from "react";
import {
  AnamContextProvider,
  SettingsContextProvider,
  VideoAudioPermissionProvider,
} from "@/contexts";
import { fetchSessionToken } from "@/utils/fetchSessionToken";
import { logger } from "@/utils";

/**
 * Providers component that wraps the application with necessary context providers
 * for Anam AI client, video/audio permissions, and settings management.
 * It also handles session token fetching and loading/error states.
 */
export function Providers({ children }: { children: ReactNode }) {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * useEffect to fetch the session token when the component mounts.
   * It sets loading and error states accordingly.
   */
  useEffect(() => {
    const initializeClient = async () => {
      try {
        const token = await fetchSessionToken();
        setSessionToken(token);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred"),
        );
        logger.error("Failed to fetch session token", err);
      } finally {
        setLoading(false);
      }
    };

    initializeClient();
  }, []);

  // Display a loading spinner while the session token is being fetched.
  if (loading) {
    return (
      <Flex align="center" justify="center" height="100vh" width="100vw">
        <Spinner size="3" />
        <Text>Loading...</Text>
      </Flex>
    );
  }

  // Display an error message if there's an issue fetching the session token.
  if (error) {
    return (
      <Flex align="center" justify="center" height="100vh" width="100vw">
        <Text>Error: {error.message}</Text>
      </Flex>
    );
  }

  return (
    <AnamContextProvider sessionToken={sessionToken || ""}>
      <VideoAudioPermissionProvider>
        <SettingsContextProvider>{children}</SettingsContextProvider>
      </VideoAudioPermissionProvider>
    </AnamContextProvider>
  );
}
