"use client";

import { createClient, AnamClient, unsafe_createClientWithApiKey } from "@anam-ai/js-sdk";
import constate from "constate";
import { useRef, useCallback, useEffect } from "react";
import { AnamEvent, Message } from "@anam-ai/js-sdk/dist/module/types";
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

/**
 * useAnam hook initializes the Anam client using session token.
 *
 * - `anamClient`: The initialized Anam client or a dummy client.
 * - `isClientInitialized`: Boolean indicating whether the client is successfully initialized with a valid session token.
 * - `setPersonaConfig`: Function to update the persona configuration for the Anam client.
 * - `startStreaming`: Function to start video/audio streaming to provided HTML elements.
 * - `stopStreaming`: Function to stop video/audio streaming.
 * - `onConnectionEstablished`: Function to handle the connection established event.
 * - `onVideoStartedStreaming`: Function to handle the video started streaming event.
 * - `onConnectionClosed`: Function to handle the connection closed event.
 * - `onMessageHistoryUpdated`: Function to handle message history updates.
 */
const useAnam = () => {
  const anamClientRef = useRef<AnamClient | null>(null);
  const listenersAddedRef = useRef(false);

  const connectionEstablishedHandlerRef = useRef<() => void>(() => {});
  const videoStartedStreamingHandlerRef = useRef<() => void>(() => {});
  const connectionClosedHandlerRef = useRef<(reason: string) => void>(() => {});
  const messageUpdatedHandlerRef = useRef<(messages: Message[]) => void>(() => {});

  anamClientRef.current = initializeAnamClient(API_KEY, PERSONA_ID);

  /**
   * Adds listeners for Anam client events.
   */
  const addListeners = useCallback(() => {
    if (anamClientRef.current && !listenersAddedRef.current) {
      anamClientRef.current.addListener(
        AnamEvent.CONNECTION_ESTABLISHED,
        connectionEstablishedHandlerRef.current,
      );
      anamClientRef.current.addListener(
        AnamEvent.VIDEO_PLAY_STARTED,
        videoStartedStreamingHandlerRef.current,
      );
      anamClientRef.current.addListener(
        AnamEvent.CONNECTION_CLOSED,
        connectionClosedHandlerRef.current,
      );
      anamClientRef.current.addListener(
        AnamEvent.MESSAGE_HISTORY_UPDATED,
        messageUpdatedHandlerRef.current,
      );

      listenersAddedRef.current = true;
    }
  }, []);

  /**
   * Removes listeners for Anam client events.
   */
  const removeListeners = useCallback(() => {
    if (anamClientRef.current && listenersAddedRef.current) {
      anamClientRef.current.removeListener(
        AnamEvent.CONNECTION_ESTABLISHED,
        connectionEstablishedHandlerRef.current,
      );
      anamClientRef.current.removeListener(
        AnamEvent.VIDEO_PLAY_STARTED,
        videoStartedStreamingHandlerRef.current,
      );
      anamClientRef.current.removeListener(
        AnamEvent.CONNECTION_CLOSED,
        connectionClosedHandlerRef.current,
      );
      anamClientRef.current.removeListener(
        AnamEvent.MESSAGE_HISTORY_UPDATED,
        messageUpdatedHandlerRef.current,
      );
      listenersAddedRef.current = false;
    }
  }, []);

  const setOnConnectionEstablished = (callback: () => void) => {
    connectionEstablishedHandlerRef.current = callback;
    if (anamClientRef.current) {
      anamClientRef.current.removeListener(
        AnamEvent.CONNECTION_ESTABLISHED,
        connectionEstablishedHandlerRef.current,
      );
      anamClientRef.current.addListener(
        AnamEvent.CONNECTION_ESTABLISHED,
        connectionEstablishedHandlerRef.current,
      );
    }
  };

  const setOnVideoStartedStreaming = (callback: () => void) => {
    videoStartedStreamingHandlerRef.current = callback;
    if (anamClientRef.current) {
      anamClientRef.current.removeListener(
        AnamEvent.VIDEO_PLAY_STARTED,
        videoStartedStreamingHandlerRef.current,
      );
      anamClientRef.current.addListener(
        AnamEvent.VIDEO_PLAY_STARTED,
        videoStartedStreamingHandlerRef.current,
      );
    }
  };

  const setOnConnectionClosed = (callback: (reason: string) => void) => {
    connectionClosedHandlerRef.current = callback;
    if (anamClientRef.current) {
      anamClientRef.current.removeListener(
        AnamEvent.CONNECTION_CLOSED,
        connectionClosedHandlerRef.current,
      );
      anamClientRef.current.addListener(
        AnamEvent.CONNECTION_CLOSED,
        connectionClosedHandlerRef.current,
      );
    }
  };

  const setOnMessageHistoryUpdated = (callback: (messages: Message[]) => void) => {
    messageUpdatedHandlerRef.current = callback;
    if (anamClientRef.current) {
      anamClientRef.current.removeListener(
        AnamEvent.MESSAGE_HISTORY_UPDATED,
        messageUpdatedHandlerRef.current,
      );
      anamClientRef.current.addListener(
        AnamEvent.MESSAGE_HISTORY_UPDATED,
        messageUpdatedHandlerRef.current,
      );
    }
  };

  const startStreaming = async (videoElementId: string, audioElementId: string) => {
    if (anamClientRef.current) {
      try {
        logger.info("starting stream");
        stopStreaming();
        await anamClientRef.current.streamToVideoAndAudioElements(videoElementId, audioElementId);
        logger.info("stream started successfully");
      } catch (error) {
        errorHandler(error);
        throw new Error("Failed to start streaming");
      }
    }
  };

  const stopStreaming = useCallback(() => {
    if (anamClientRef.current) {
      anamClientRef.current.stopStreaming().catch((error) => {
        errorHandler(error);
        logger.error("Failed to stop streaming:", error);
      });
    }
  }, []);

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

  useEffect(() => {
    addListeners();
    logger.info("AnamContext listeners added");
    return () => {
      removeListeners();
      logger.info("AnamContext listeners removed");
    };
  }, [addListeners, removeListeners]);

  return {
    anamClient: anamClientRef.current,
    isClientInitialized: !!API_KEY,
    setPersonaConfig,
    createPersona,
    startStreaming,
    stopStreaming,
    setOnConnectionEstablished,
    setOnVideoStartedStreaming,
    setOnConnectionClosed,
    setOnMessageHistoryUpdated,
  };
};

export const [AnamContextProvider, useAnamContext] = constate(useAnam);
