"use client";

import { createClient, AnamClient } from "@anam-ai/js-sdk";
import constate from "constate";
import { useRef } from "react";
import { FetchError, errorHandler, logger, env } from "@/utils";

const PERSONA_ID = env.NEXT_PUBLIC_DEFAULT_PERSONA!;
const DISABLE_BRAINS = env.NEXT_PUBLIC_DISABLE_BRAINS;
const DISABLE_FILLER_PHRASES = env.NEXT_PUBLIC_DISABLE_FILLER_PHRASES;

/**
 * useAnam hook initializes the Anam client using the provided session token. If the token is not valid,
 * a dummy client is initialized instead.
 *
 * @param {string} params.sessionToken - Session token for authenticating the Anam client.
 *
 * @returns {Object} An object containing:
 * - `anamClient`: The initialized Anam client or a dummy client.
 * - `isClientInitialized`: Boolean indicating whether the client is successfully initialized with a valid session token.
 * - `setPersonaConfig`: Function to update the persona configuration for the Anam client.
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

  /**
   * Updates the persona configuration for the Anam client.
   *
   * @param {string} config.personaId - The ID of the persona to switch to.
   * @param {boolean} [config.disableFillerPhrases] - Option to disable filler phrases for the persona.
   * @param {boolean} [config.disableBrains] - Option to disable brain simulation for the persona.
   */
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
