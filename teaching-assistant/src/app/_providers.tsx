"use client";

import {
  AnamContextProvider,
  AudioPermissionProvider,
  SettingsContextProvider,
} from "@/contexts";
import { Text, Spinner, Flex } from "@radix-ui/themes";
import { useEffect } from "react";
import { ReactNode } from "react";
import { errorHandler } from "@/utils";
import { useFetchToken } from "@/hooks";

export function Providers({ children }: { children: ReactNode }) {
  const { sessionToken, error, isValidating } = useFetchToken();

  useEffect(() => {
    if (error) {
      errorHandler(
        `Error: ${error?.message || "Unknown error occurred"}`,
        "Provider.tsx",
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
    <AudioPermissionProvider>
      <AnamContextProvider sessionToken={sessionToken}>
        <SettingsContextProvider>{children}</SettingsContextProvider>
      </AnamContextProvider>
    </AudioPermissionProvider>
  );
}
