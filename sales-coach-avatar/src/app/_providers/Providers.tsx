"use client";

import { AnamContextProvider } from "@/contexts";
import { useFetchToken } from "@/hooks";
import { Text, Spinner, Flex } from "@radix-ui/themes";
import { useEffect } from "react";
import { toast, Toaster } from "sonner";
import { ReactNode } from "react";
import { VideoAudioPermissionProvider } from "@/contexts/VideoAudioPermissionContext";

export function Providers({ children }: { children: ReactNode }) {
  const { data: sessionToken, error, isValidating } = useFetchToken();

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
        {children}
        <Toaster />
      </AnamContextProvider>
    </VideoAudioPermissionProvider>
  );
}
