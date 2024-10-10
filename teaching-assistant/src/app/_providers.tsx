"use client";

import { useEffect, useState } from "react";
import {
  AnamContextProvider,
  AudioPermissionProvider,
  SettingsContextProvider,
  ViewContextProvider,
} from "@/contexts";
import { Text, Spinner, Flex } from "@radix-ui/themes";
import { logger } from "@/utils";
import { fetchSessionToken } from "@/utils/fetchSessionToken";

export function Providers({ children }: { children: React.ReactNode }) {
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
    <AnamContextProvider sessionToken={sessionToken || ""}>
      <SettingsContextProvider>
        <AudioPermissionProvider>
          <ViewContextProvider>{children}</ViewContextProvider>
        </AudioPermissionProvider>
      </SettingsContextProvider>
    </AnamContextProvider>
  );
}
