"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Volume2, VolumeX, Play, Pause, Maximize2 } from "lucide-react";
import {
  DemoSidebar,
  ConversationPopup,
  ConversationTracker,
} from "@/components";
import { useAnamContext, useSettingsContext } from "@/contexts";
import { errorHandler, logger } from "@/utils";
import {
  AnamEvent,
  Message,
  MessageRole,
} from "@anam-ai/js-sdk/dist/module/types";
import { useRouter } from "next/navigation";
import { Spinner } from "@radix-ui/themes";

const INITIAL_TIME_LEFT = 120;

export function DemoView() {
  const { anamClient, isClientInitialized } = useAnamContext();
  const { selectedLanguage } = useSettingsContext();
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamingStartedRef = useRef(false);
  const listenersAddedRef = useRef(false);

  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loadingText, setLoadingText] = useState("Connecting...");
  const [streamError, setStreamError] = useState<string | null>(null);
  const [conversation, setConversation] = useState<
    { sender: string; text: string }[]
  >([]);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_LEFT);

  const handlePlayPauseToggle = useCallback(() => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
    }
  }, [isPlaying]);

  const requestFullscreen = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    }
  }, []);

  const stopStreaming = useCallback(() => {
    if (anamClient) {
      anamClient.stopStreaming().catch((error) => {
        errorHandler(error);
        console.error("Failed to stop streaming:", error);
      });
    }
  }, [anamClient]);

  const onConnectionEstablished = useCallback(() => {
    setLoadingText("Connected to a Persona. Starting video stream...");
    setStreamError(null);
    logger.info("Connection established");
  }, []);

  const onVideoStartedStreaming = useCallback(() => {
    setLoadingText("");
    setStreamError(null);
    logger.info("Video started streaming");
  }, []);

  const onConnectionClosed = useCallback((reason: string) => {
    logger.info("Connection closed", reason);
  }, []);

  const updateConversation = useCallback((updatedMessages: Message[]) => {
    const mappedMessages = updatedMessages.map((message) => ({
      sender:
        message.role === MessageRole.PERSONA
          ? MessageRole.PERSONA
          : MessageRole.USER,
      text: message.content,
    }));
    setConversation(mappedMessages);
  }, []);

  const formatTime = (time: number) =>
    `${Math.floor(time / 60)}:${String(time % 60).padStart(2, "0")}`;

  // Handle the timer
  useEffect(() => {
    if (timeLeft === 0) {
      if (streamingStartedRef.current) {
        stopStreaming();
        streamingStartedRef.current = false;
      }
      router.push("/");
    }
    const timer =
      isPlaying && timeLeft > 0
        ? setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
        : undefined;
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, timeLeft, stopStreaming, router]);

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
      anamClient.addListener(
        AnamEvent.MESSAGE_HISTORY_UPDATED,
        updateConversation,
      );
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
        anamClient.removeListener(
          AnamEvent.MESSAGE_HISTORY_UPDATED,
          updateConversation,
        );
        setConversation([]);
        listenersAddedRef.current = false;
      }
    };
  }, [
    anamClient,
    onConnectionEstablished,
    onVideoStartedStreaming,
    onConnectionClosed,
    updateConversation,
  ]);

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

  const progressValue =
    ((INITIAL_TIME_LEFT - timeLeft) / INITIAL_TIME_LEFT) * 100;

  return (
    <div className="overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-center items-start max-w-screen-xl mx-auto">
        {/* Main Content */}
        <div className="flex flex-col items-center p-5 flex-1">
          <div className="relative">
            <div className="relative bg-white rounded-lg border border-gray-300 shadow-lg overflow-hidden">
              <video
                id="avatar-video"
                ref={videoRef}
                autoPlay
                playsInline
                className="rounded-lg object-cover w-[90vw] h-auto md:w-auto md:h-[90vh]"
                muted={isMuted}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              <audio id="avatar-audio" ref={audioRef} autoPlay hidden />
              <div className="flex justify-center items-center w-full h-full absolute top-0 left-0">
                {streamError ? (
                  <p className="text-red-500 text-base">{streamError}</p>
                ) : loadingText ? (
                  <div className="flex flex-col items-center">
                    <Spinner size="3" />
                    <p className="text-gray-700 text-base">{loadingText}</p>
                  </div>
                ) : null}
              </div>
              {/* Conversation Popup */}
              <div className="absolute bottom-4 right-4 hidden md:flex">
                <ConversationPopup conversation={conversation} />
              </div>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="w-full max-w-2xl mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${progressValue}%` }}
              ></div>
            </div>
          </div>
          {/* Responsive Chat for Small Screens */}
          <ConversationTracker conversation={conversation} />
        </div>
        {/* Sidebar */}
        <div className="flex-none w-full md:w-auto">
          <DemoSidebar selectedLanguage={selectedLanguage} />
        </div>
      </div>
    </div>
  );
}
