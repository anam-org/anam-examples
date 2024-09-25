"use client";

import { createClient, AnamClient } from "@anam-ai/js-sdk";
import constate from "constate";
import { FetchError, errorHandler, logger, env } from "@/utils";

const PERSONA_ID = env.NEXT_PUBLIC_PERSONA_ID!;
const DISABLE_BRAINS = env.NEXT_PUBLIC_DISABLE_BRAINS;
const DISABLE_FILLER_PHRASES = env.NEXT_PUBLIC_DISABLE_FILLER_PHRASES;

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

export const [AnamContextProvider, useAnamContext] = constate(useAnam);
