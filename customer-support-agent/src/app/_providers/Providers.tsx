"use client";

import { useFetchToken } from "@/hooks";
import { AnamContextProvider, VideoAudioPermissionProvider } from "@/contexts";
import { Text, Spinner, Flex } from "@radix-ui/themes";
import { useEffect, ReactNode } from "react";
import {} from "react";
import { errorHandler } from "@/utils";

export function Providers({ children }: { children: ReactNode }) {
  const { data: sessionToken, error, isValidating } = useFetchToken();

  useEffect(() => {
    if (error) {
      errorHandler(error, "Providers.tsx");
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
    <VideoAudioPermissionProvider>
      <AnamContextProvider sessionToken={sessionToken}>
        {children}
      </AnamContextProvider>
    </VideoAudioPermissionProvider>
  );
}
