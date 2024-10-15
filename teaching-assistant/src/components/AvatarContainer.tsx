"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ConversationPopup } from "@/components";
import { useAnamContext } from "@/contexts";
import { errorHandler, logger } from "@/utils";
import { AnamEvent } from "@anam-ai/js-sdk/dist/module/types";
import { Spinner } from "@radix-ui/themes";

interface AvatarContainerProps {
  conversation: { sender: string; text: string }[];
}

/**
 * AvatarContainer component handles the streaming of video and audio, and displays the conversation popup.
 * It listens for streaming events and handles video/audio rendering as well as connection management.
 *
 * @component
 * @param {AvatarContainerProps} props - The props including conversation array and onStreamingEnd callback.
 * @returns {JSX.Element} The AvatarContainer component.
 */
export const AvatarContainer = ({
  conversation,
}: AvatarContainerProps) => {
  const { anamClient, isClientInitialized } = useAnamContext();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamingStartedRef = useRef(false);
  const listenersAddedRef = useRef(false);

  /**
   * State to track if the video is streaming.
   * @type {[boolean, Function]}
   */
  const [isVideoStreaming, setIsVideoStreaming] = useState(false);

  /**
   * State to track loading text during connection.
   * @type {[string, Function]}
   */
  const [loadingText, setLoadingText] = useState("Connecting...");

  /**
   * State to track any streaming errors.
   * @type {[string | null, Function]}
   */
  const [streamError, setStreamError] = useState<string | null>(null);

  /**
   * Stops the current video/audio streaming session by invoking the anamClient's stopStreaming method.
   *
   * @function
   * @returns {void}
   */
  const stopStreaming = useCallback(() => {
    if (anamClient) {
      anamClient.stopStreaming().catch((error) => {
        errorHandler(error);
        console.error("Failed to stop streaming:", error);
      });
    }
  }, [anamClient]);

  /**
   * Handles the connection establishment event.
   * Sets loading text to indicate successful connection and resets any errors.
   *
   * @function
   * @returns {void}
   */
  const onConnectionEstablished = useCallback(() => {
    setLoadingText("Connected to a Persona...");
    setStreamError(null);
    logger.info("Connection established");
  }, []);

  /**
   * Handles the event when video streaming starts.
   * Clears loading text and marks video as streaming.
   *
   * @function
   * @returns {void}
   */
  const onVideoStartedStreaming = useCallback(() => {
    setLoadingText("");
    setStreamError(null);
    setIsVideoStreaming(true);
    logger.info("Video started streaming");
  }, []);

  /**
   * Handles the connection close event, logs the reason, and calls the onStreamingEnd callback.
   *
   * @function
   * @param {string} reason - The reason for the connection being closed.
   * @returns {void}
   */
  const onConnectionClosed = useCallback(
    (reason: string) => {
      logger.info("Connection closed", reason);
      setIsVideoStreaming(false);
    },
    [isVideoStreaming],
  );

  /**
   * Effect to add listeners for connection and streaming events when the anamClient is initialized.
   * Cleans up listeners on component unmount.
   *
   * @useEffect
   */
  useEffect(() => {
    if (anamClient && !listenersAddedRef.current) {
      anamClient.addListener(
        AnamEvent.CONNECTION_ESTABLISHED,
        onConnectionEstablished,
      );
      anamClient.addListener(
        AnamEvent.VIDEO_PLAY_STARTED,
        onVideoStartedStreaming,
      );
      anamClient.addListener(AnamEvent.CONNECTION_CLOSED, onConnectionClosed);
      listenersAddedRef.current = true;
    }

    return () => {
      if (anamClient && listenersAddedRef.current) {
        anamClient.removeListener(
          AnamEvent.CONNECTION_ESTABLISHED,
          onConnectionEstablished,
        );
        anamClient.removeListener(
          AnamEvent.VIDEO_PLAY_STARTED,
          onVideoStartedStreaming,
        );
        anamClient.removeListener(
          AnamEvent.CONNECTION_CLOSED,
          onConnectionClosed,
        );
        listenersAddedRef.current = false;
      }
    };
  }, [
    anamClient,
    onConnectionEstablished,
    onVideoStartedStreaming,
    onConnectionClosed,
  ]);

  /**
   * Effect to start the streaming process when the client is initialized and references to video/audio elements are set.
   * Cleans up by stopping the streaming if the component unmounts.
   *
   * @useEffect
   */
  useEffect(() => {
    const startStreaming = async () => {
      if (
        !isClientInitialized ||
        !anamClient ||
        !videoRef.current ||
        !audioRef.current ||
        streamingStartedRef.current
      )
        return;

      try {
        await anamClient.streamToVideoAndAudioElements(
          videoRef.current.id,
          audioRef.current.id,
        );
        streamingStartedRef.current = true;
      } catch (error) {
        streamingStartedRef.current = false;
        errorHandler(error);
        const message =
          error instanceof Error ? error.message : "An unknown error occurred";
        setStreamError(message);
      }
    };

    startStreaming();

    return () => {
      if (streamingStartedRef.current) {
        stopStreaming();
        streamingStartedRef.current = false;
      }
    };
  }, [isClientInitialized, anamClient, videoRef, audioRef, stopStreaming]);

  return (
    <div className="relative rounded-lg overflow-hidden">
      <video
        id="avatar-video"
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded-lg object-cover w-[90vw] h-auto md:w-auto md:h-[90vh]"
      />
      <audio id="avatar-audio" ref={audioRef} autoPlay hidden />
      <div className="flex justify-center items-center w-full h-full absolute top-0 left-0">
        {streamError ? (
          <p className="text-red-500 text-base">{streamError}</p>
        ) : loadingText ? (
          <div className="flex flex-col items-center">
            <Spinner size="3" />
          </div>
        ) : null}
      </div>
      {/* Conversation Popup */}
      {isVideoStreaming && (
        <div className="absolute bottom-4 right-4 hidden md:flex">
          <ConversationPopup conversation={conversation} />
        </div>
      )}
    </div>
  );
};
