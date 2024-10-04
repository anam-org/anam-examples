"use client";

import { useFetchToken } from "@/hooks";
import {
  AnamContextProvider,
  AudioPermissionProvider,
  SettingsContextProvider,
  ViewContextProvider,
} from "@/contexts";
import { Text, Spinner, Flex } from "@radix-ui/themes";
import { useEffect } from "react";
import { ReactNode } from "react";
import { logger } from "@/utils";

export function Providers({ children }: { children: ReactNode }) {
  const { sessionToken, error } = useFetchToken();

  useEffect(() => {
    if (error) {
      logger.error(`Error: ${error?.message || "Unknown error occurred"}`);
    }
  }, [error]);

  if (!sessionToken) {
    return (
      <Flex align="center" justify="center" height="100vh" width="100vw">
        <Spinner size="3" />
        <Text>Loading...</Text>
      </Flex>
    );
  }

  return (
    <AnamContextProvider sessionToken={sessionToken}>
      <SettingsContextProvider>
        <AudioPermissionProvider>
            <ViewContextProvider>
              {children}
            </ViewContextProvider>
        </AudioPermissionProvider>
      </SettingsContextProvider>
    </AnamContextProvider>
  );
}
