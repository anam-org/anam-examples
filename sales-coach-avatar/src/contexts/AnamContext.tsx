"use client";

import { createClient, AnamClient } from "@anam-ai/js-sdk";
import constate from "constate";
import { useRef } from "react";
import { FetchError, errorHandler, logger, env } from "@/utils";

const PERSONA_ID = env.NEXT_PUBLIC_PERSONA_ID!;
const DISABLE_BRAINS = env.NEXT_PUBLIC_DISABLE_BRAINS;
const DISABLE_FILLER_PHRASES = env.NEXT_PUBLIC_DISABLE_FILLER_PHRASES;

/**
 * Hook to initialize the Anam client. If a session token is provided, the client
 * is initialized with the provided token; otherwise, a dummy client is used.
 */
const useAnam = ({ sessionToken }: { sessionToken?: string }) => {
  const anamClientRef = useRef<AnamClient | null>(null);

  if (!anamClientRef.current && sessionToken) {
    try {
      anamClientRef.current = createClient(sessionToken, {
        personaId: PERSONA_ID,
        disableBrains: DISABLE_BRAINS,
        disableFillerPhrases: DISABLE_FILLER_PHRASES,
      });
      logger.info(
        `Anam client initialized with session token: ${sessionToken}`,
      );
    } catch (err) {
      errorHandler(err as FetchError, "Initializing Anam Client");
      anamClientRef.current = createClient("dummy", {
        personaId: PERSONA_ID,
        disableBrains: DISABLE_BRAINS,
        disableFillerPhrases: DISABLE_FILLER_PHRASES,
      });
    }
  }

  // Helper function for updating selected persona
  const setPersonaConfig = (config: {
    personaId: string;
    disableFillerPhrases?: boolean;
    disableBrains?: boolean;
  }) => {
    if (anamClientRef.current) {
      anamClientRef.current.setPersonaConfig(config);
      logger.info("Persona config updated", config);
    } else {
      logger.error("Anam client is not initialized");
    }
  };

  return {
    anamClient: anamClientRef.current,
    isClientInitialized: !!sessionToken,
    setPersonaConfig,
  };
};

export const [AnamContextProvider, useAnamContext] = constate(useAnam);
