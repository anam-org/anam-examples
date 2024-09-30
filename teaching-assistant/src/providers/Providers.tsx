"use client";

import { useFetchToken } from "@/hooks";
import { AnamContextProvider, VideoAudioPermissionProvider, ViewContextProvider } from "@/contexts";
import { Text, Spinner, Flex } from "@radix-ui/themes";
import { useEffect } from "react";
import { toast, Toaster } from "sonner";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const { sessionToken, error, isValidating } = useFetchToken();

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error?.message || "Unknown error occurred"}`);
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
        <ViewContextProvider>
          {children}
          <Toaster />
        </ViewContextProvider>
      </AnamContextProvider>
    </VideoAudioPermissionProvider>
  );
}
