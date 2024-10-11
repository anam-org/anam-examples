"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ConversationPopup } from "@/components";
import { useAnamContext } from "@/contexts";
import { errorHandler, logger } from "@/utils";
import { AnamEvent, Message, MessageRole } from "@anam-ai/js-sdk/dist/module/types";
import { Spinner } from "@radix-ui/themes";

interface AvatarContainerProps {
  conversation: { sender: string; text: string }[];
  onStreamingEnd: () => void;
}

export const AvatarContainer = ({
  conversation,
  onStreamingEnd,
}: AvatarContainerProps) => {
  const { anamClient, isClientInitialized } = useAnamContext();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamingStartedRef = useRef(false);
  const listenersAddedRef = useRef(false);

  const [isVideoStreaming, setIsVideoStreaming] = useState(false);
  const [loadingText, setLoadingText] = useState("Connecting...");
  const [streamError, setStreamError] = useState<string | null>(null);

  const stopStreaming = useCallback(() => {
    if (anamClient) {
      anamClient.stopStreaming().catch((error) => {
        errorHandler(error);
        console.error("Failed to stop streaming:", error);
      });
    }
  }, [anamClient]);

  const onConnectionEstablished = useCallback(() => {
    setLoadingText("Connected to a Persona...");
    setStreamError(null);
    logger.info("Connection established");
  }, []);

  const onVideoStartedStreaming = useCallback(() => {
    setLoadingText("");
    setStreamError(null);
    setIsVideoStreaming(true);
    logger.info("Video started streaming");
  }, []);

  const onConnectionClosed = useCallback((reason: string) => {
    logger.info("Connection closed", reason);
    setIsVideoStreaming(false);
    onStreamingEnd();
  }, [onStreamingEnd]);

  useEffect(() => {
    if (anamClient && !listenersAddedRef.current) {
      anamClient.addListener(
        AnamEvent.CONNECTION_ESTABLISHED,
        onConnectionEstablished
      );
      anamClient.addListener(
        AnamEvent.VIDEO_PLAY_STARTED,
        onVideoStartedStreaming
      );
      anamClient.addListener(AnamEvent.CONNECTION_CLOSED, onConnectionClosed);
      listenersAddedRef.current = true;
    }

    return () => {
      if (anamClient && listenersAddedRef.current) {
        anamClient.removeListener(
          AnamEvent.CONNECTION_ESTABLISHED,
          onConnectionEstablished
        );
        anamClient.removeListener(
          AnamEvent.VIDEO_PLAY_STARTED,
          onVideoStartedStreaming
        );
        anamClient.removeListener(
          AnamEvent.CONNECTION_CLOSED,
          onConnectionClosed
        );
        listenersAddedRef.current = false;
      }
    };
  }, [anamClient, onConnectionEstablished, onVideoStartedStreaming, onConnectionClosed]);

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
          audioRef.current.id
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
