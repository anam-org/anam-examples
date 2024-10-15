"use client";

import {
  createClient,
  AnamClient,
  unsafe_createClientWithApiKey,
} from "@anam-ai/js-sdk";
import constate from "constate";
import { useRef } from "react";
import { errorHandler, FetchError, logger } from "../utils";

const API_KEY = import.meta.env.VITE_ANAM_API_KEY!;
const PERSONA_ID = import.meta.env.VITE_PERSONA_ID!;

const initializeAnamClient = (key: string, personaId: string) => {
  try {
    const client = unsafe_createClientWithApiKey(key, { personaId });
    logger.info("Anam client initialized with API key");
    return client;
  } catch (err) {
    errorHandler(err as FetchError, "Initializing Anam Client");
    logger.error("Falling back to dummy client");
    return createClient("dummy", { personaId });
  }
};

const useAnam = () => {
  const anamClientRef = useRef<AnamClient | null>(null);

  if (!anamClientRef.current && API_KEY) {
    anamClientRef.current = initializeAnamClient(API_KEY, PERSONA_ID);
  }

  const setPersonaConfig = (config: {
    personaId: string;
    disableFillerPhrases?: boolean;
    disableBrains?: boolean;
  }) => {
    if (!anamClientRef.current) {
      return logger.error("Anam client is not initialized");
    }
    anamClientRef.current.setPersonaConfig(config);
    logger.info("Persona config updated", config);
  };

  const createPersona = async (personaInfo: {
    description: string;
    personality: string;
  }) => {
    try {
      const personaConfig = {
        name: "Leo",
        description: personaInfo.description,
        personaPreset: "leo_desk",
        brain: {
          systemPrompt:
            "Hello, I am your AI assistant Leo, how can I assist you today?",
          personality: personaInfo.personality,
          fillerPhrases: [
            "Let me assist you with that.",
            "I'm here to help.",
            "One moment while I check that for you.",
          ],
        },
      };

      const response = await fetch("https://api.anam.ai/v1/personas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(personaConfig),
      });

      if (!response.ok) {
        throw new Error(`Failed to create persona: ${response.statusText}`);
      }

      const data = await response.json();
      logger.info("Persona created successfully", data);
      return data;
    } catch (err) {
      errorHandler(err as FetchError, "Creating Persona");
      logger.error("Failed to create persona");
    }
  };

  return {
    anamClient: anamClientRef.current,
    isClientInitialized: !!API_KEY,
    setPersonaConfig,
    createPersona,
  };
};

export const [AnamContextProvider, useAnamContext] = constate(useAnam);
