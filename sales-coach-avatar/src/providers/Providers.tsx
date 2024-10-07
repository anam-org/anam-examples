"use client";

import { Text, Spinner, Flex } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { ReactNode } from "react";
import {
  AnamContextProvider,
  SettingsContextProvider,
  VideoAudioPermissionProvider,
  ViewContextProvider,
} from "@/contexts";
import { fetchSessionToken } from "@/utils/fetchSessionToken";
import { logger } from "@/utils";

export function Providers({ children }: { children: ReactNode }) {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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

  if (loading) {
    return (
      <Flex align="center" justify="center" height="100vh" width="100vw">
        <Spinner size="3" />
        <Text>Loading...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex align="center" justify="center" height="100vh" width="100vw">
        <Text>Error: {error.message}</Text>
      </Flex>
    );
  }

  return (
    <VideoAudioPermissionProvider>
      <AnamContextProvider sessionToken={sessionToken || ""}>
        <ViewContextProvider>
          <SettingsContextProvider>{children}</SettingsContextProvider>
        </ViewContextProvider>
      </AnamContextProvider>
    </VideoAudioPermissionProvider>
  );
}
