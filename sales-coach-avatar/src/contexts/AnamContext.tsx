"use client";

import { createClient, AnamClient } from "@anam-ai/js-sdk";
import { useEffect, useState, useMemo } from "react";
import constate from "constate";
import { env } from "@/env";
import { errorHandler, FetchError } from "@/utils";

interface UseAnamProps {
  sessionToken?: string;
}

const useAnam = ({ sessionToken }: UseAnamProps) => {
  const [anamClient, setAnamClient] = useState<AnamClient | null>(null);
  const [isClientInitialized, setIsClientInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeClient = async () => {
      try {
        if (sessionToken) {
          const client = createClient(sessionToken, {
            personaId: env.NEXT_PUBLIC_PERSONA_ID!,
            disableBrains: env.NEXT_PUBLIC_DISABLE_BRAINS,
            disableFillerPhrases: env.NEXT_PUBLIC_DISABLE_FILLER_PHRASES,
          });
          setAnamClient(client);
        } else {
          throw new FetchError("No session token provided", 400);
        }
        setIsClientInitialized(true);
      } catch (err) {
        errorHandler(err as FetchError, "Initializing Anam Client");
        setError("Failed to initialize Anam client");
      }
    };

    initializeClient();
  }, [sessionToken]);

  const memoizedClient = useMemo(() => ({ anamClient, isClientInitialized, error }), [anamClient, isClientInitialized, error]);

  return memoizedClient;
};

export const [AnamContextProvider, useAnamContext] = constate(useAnam);
