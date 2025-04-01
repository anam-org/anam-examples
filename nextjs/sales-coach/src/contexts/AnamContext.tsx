"use client";

import { createClient, AnamClient } from "@anam-ai/js-sdk";
import constate from "constate";
import { useRef, useCallback, useEffect } from "react";
import { FetchError, errorHandler, logger, env } from "@/utils";
import { AnamEvent, Message } from "@anam-ai/js-sdk/dist/module/types";
import { Persona } from "@/utils/personas";
import { useFetchToken } from "@/hooks";

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
  const { sessionToken, setPersonaName } = useFetchToken();

  const anamClientRef = useRef<AnamClient | null>(null);
  const listenersAddedRef = useRef(false);
  const currentTokenRef = useRef<string | undefined>(sessionToken);

  const connectionEstablishedHandlerRef = useRef<() => void>(() => {});
  const videoStartedStreamingHandlerRef = useRef<() => void>(() => {});
  const connectionClosedHandlerRef = useRef<(reason: string) => void>(() => {});
  const messageUpdatedHandlerRef = useRef<(messages: Message[]) => void>(
    () => {},
  );

  if (!anamClientRef.current && sessionToken) {
    try {
      anamClientRef.current = createClient(sessionToken);
      logger.info(`Anam client initialized`);
    } catch (err) {
      errorHandler(err as FetchError, "Initializing Anam Client");
      anamClientRef.current = null;
    }
  }

  useEffect(() => {
    console.log("sessionToken", sessionToken);
    if (sessionToken && sessionToken !== currentTokenRef.current) {
      console.log("Reinitializing Anam client");
      // Clean up the old client if it exists
      if (anamClientRef.current) {
        removeListeners();
        stopStreaming();
        anamClientRef.current = null;
      }

      // Initialize with the new token
      try {
        anamClientRef.current = createClient(sessionToken);
        currentTokenRef.current = sessionToken;
        addListeners();
        logger.info(`Anam client reinitialized with new token`);
      } catch (err) {
        errorHandler(err as FetchError, "Reinitializing Anam Client");
        anamClientRef.current = null;
      }
    }
  }, [sessionToken]);

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

  /**
   * Exposes listener setters to allow external customization of behavior.
   * Re-register listeners when the handler is updated
   */
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

  const setOnMessageHistoryUpdated = (
    callback: (messages: Message[]) => void,
  ) => {
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

  /**
   * Starts video/audio streaming to provided HTML elements.
   */
  const startStreaming = async (
    videoElementId: string,
    audioElementId: string,
    userProvidedMediaStream?: MediaStream,
  ): Promise<void> => {
    if (anamClientRef.current) {
      try {
        logger.info("Starting stream...");
        stopStreaming();

        // Check if a custom MediaStream is provided
        if (userProvidedMediaStream) {
          // Pass the custom MediaStream to the Anam client's stream method
          await anamClientRef.current.streamToVideoAndAudioElements(
            videoElementId,
            audioElementId,
            userProvidedMediaStream,
          );
          logger.info("Stream started with user-provided MediaStream");
        } else {
          // Start streaming using the default behavior
          await anamClientRef.current.streamToVideoAndAudioElements(
            videoElementId,
            audioElementId,
          );
          logger.info("Stream started with default MediaStream");
        }
      } catch (error) {
        errorHandler(error);
        throw new Error("Failed to start streaming");
      }
    }
  };

  /**
   * Stops the current video/audio streaming session.
   */
  const stopStreaming = useCallback(() => {
    if (anamClientRef.current) {
      anamClientRef.current.stopStreaming().catch((error) => {
        errorHandler(error);
        logger.error("Failed to stop streaming:", error);
      });
    }
  }, []);

  /**
   * Updates the persona configuration for the Anam client.
   */
  const setPersonaConfig = (personaName: string) => {
    if (anamClientRef.current) {
      setPersonaName(personaName);
      logger.info("Persona config updated", personaName);
    } else {
      logger.error("Anam client is not initialized");
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
    isClientInitialized: !!sessionToken,
    setPersonaConfig,
    startStreaming,
    stopStreaming,
    setOnConnectionEstablished,
    setOnVideoStartedStreaming,
    setOnConnectionClosed,
    setOnMessageHistoryUpdated,
  };
};

export const [AnamContextProvider, useAnamContext] = constate(useAnam);
