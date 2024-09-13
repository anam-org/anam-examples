"use client";

import { AnamContextProvider } from "@/contexts";
import { useFetchToken } from "@/hooks";
import { Text, Spinner, Flex } from "@radix-ui/themes";
import { useEffect } from "react";
import { toast, Toaster } from "sonner";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const { data: sessionToken, error, isValidating } = useFetchToken();

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error?.message || "Unknown error occurred"}`);
    }
  }, [error]);

  if (isValidating) {
    return (
      <Flex align="center" justify="center">
        <Spinner />
        <Text>Loading...</Text>
      </Flex>
    );
  }

  return (
    <>
      <AnamContextProvider sessionToken={sessionToken}>
        {children}
      </AnamContextProvider>
      <Toaster />
    </>
  );
}
