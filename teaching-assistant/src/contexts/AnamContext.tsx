"use client";

import { createClient, AnamClient } from "@anam-ai/js-sdk";
import constate from "constate";
import { FetchError, errorHandler, logger, env } from "@/utils";
import { useRef } from "react";

const PERSONA_ID = env.NEXT_PUBLIC_PERSONA_ID!;
const DISABLE_BRAINS = env.NEXT_PUBLIC_DISABLE_BRAINS;
const DISABLE_FILLER_PHRASES = env.NEXT_PUBLIC_DISABLE_FILLER_PHRASES;

/**
 * Hook to initialize the Anam client using a session token.
 */
const useAnam = ({ sessionToken }: { sessionToken?: string }) => {
  const anamClientRef = useRef<AnamClient | null>(null);

  // Ensure the Anam client is only initialized once
  if (!anamClientRef.current && sessionToken) {
    try {
      anamClientRef.current = createClient(sessionToken, {
        personaId: PERSONA_ID,
        disableBrains: DISABLE_BRAINS,
        disableFillerPhrases: DISABLE_FILLER_PHRASES,
      });
      logger.info(`Anam client initialized with session token: ${sessionToken}`);
    } catch (err) {
      errorHandler(err as FetchError, "Initializing Anam Client");
      anamClientRef.current = createClient("dummy", {
        personaId: PERSONA_ID,
        disableBrains: DISABLE_BRAINS,
        disableFillerPhrases: DISABLE_FILLER_PHRASES,
      });
    }
  }

  return { anamClient: anamClientRef.current, isClientInitialized: !!sessionToken };
};

export const [AnamContextProvider, useAnamContext] = constate(useAnam);
