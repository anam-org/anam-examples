"use client";

import { createClient, AnamClient } from "@anam-ai/js-sdk";
import constate from "constate";
import { FetchError, errorHandler, logger, env } from "@/utils";

const PERSONA_ID = env.NEXT_PUBLIC_PERSONA_ID!;
const DISABLE_BRAINS = env.NEXT_PUBLIC_DISABLE_BRAINS;
const DISABLE_FILLER_PHRASES = env.NEXT_PUBLIC_DISABLE_FILLER_PHRASES;

/**
 * Hook to initialize the Anam client. If a session token is provided, the client
 * is initialized with the provided token; otherwise, a dummy client is used.
 *
 * @param {object} params - Object containing initialization parameters.
 * @param {string} [params.sessionToken] - The session token for authenticating the Anam client.
 * @returns {object} - The initialized Anam client and a boolean indicating if the client is initialized.
 */
const useAnam = ({ sessionToken }: { sessionToken?: string }) => {
  let anamClient: AnamClient;

  if (sessionToken) {
    try {
      anamClient = createClient(sessionToken, {
        personaId: PERSONA_ID,
        disableBrains: DISABLE_BRAINS,
        disableFillerPhrases: DISABLE_FILLER_PHRASES,
      });
      logger.info(
        `Anam client initialized with session token: ${sessionToken}`,
      );
    } catch (err) {
      errorHandler(err as FetchError, "Initializing Anam Client");
      anamClient = createClient("dummy", {
        personaId: PERSONA_ID,
        disableBrains: DISABLE_BRAINS,
        disableFillerPhrases: DISABLE_FILLER_PHRASES,
      });
    }
  } else {
    logger.warn("Anam Client: No session token provided, using dummy client");
    anamClient = createClient("dummy", {
      personaId: PERSONA_ID,
      disableBrains: DISABLE_BRAINS,
      disableFillerPhrases: DISABLE_FILLER_PHRASES,
    });
  }

  return { anamClient, isClientInitialized: !!sessionToken };
};

/**
 * Context provider and hook for using the Anam client within React context.
 *
 * @type {Object} - Returns the context provider and the hook for accessing the Anam client.
 */
export const [AnamContextProvider, useAnamContext] = constate(useAnam);
