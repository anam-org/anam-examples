"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Flex,
  Text,
  IconButton,
  Box,
  Progress,
  Spinner,
} from "@radix-ui/themes";
import { Volume2, VolumeX, Play, Pause, Maximize2 } from "lucide-react";
import { DemoSidebar, ConversationPopup } from "@/components";
import { useAnamContext, useSettingsContext } from "@/contexts";
import { errorHandler, logger } from "@/utils";
import {
  AnamEvent,
  Message,
  MessageRole,
} from "@anam-ai/js-sdk/dist/module/types";
import { useRouter } from "next/navigation";

export function DemoView() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { anamClient, isClientInitialized } = useAnamContext();
  const { selectedLanguage } = useSettingsContext();
  const router = useRouter();

  const INITIAL_TIME_LEFT = 120;
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loadingText, setLoadingText] = useState("Connecting...");
  const [streamError, setStreamError] = useState<string | null>(null);
  const [conversation, setConversation] = useState<
    { sender: string; text: string }[]
  >([]);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_LEFT);

  const streamingStartedRef = useRef(false);
  const listenersAddedRef = useRef(false);

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
        // await anamClient.streamToVideoAndAudioElements(
        //   videoRef.current.id,
        //   audioRef.current.id,
        // );
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
    <Flex>
      <Flex direction="column" align="center" className="flex-1 p-5 h-full">
        <Box className="border-lg bg-gray-200 w-auto h-[85vh] aspect-square mx-auto relative flex justify-center">
          <video
            id="avatar-video"
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-lg"
            muted={isMuted}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          <audio id="avatar-audio" ref={audioRef} autoPlay hidden />
          <Flex
            justify="center"
            align="center"
            className="w-full h-full absolute top-0 left-0"
          >
            {streamError ? (
              <Text size="2" className="text-red-500">
                {streamError}
              </Text>
            ) : loadingText ? (
              <>
                <Spinner size="3" />
                <Text size="2" className="dark:text-black">
                  {loadingText}
                </Text>
              </>
            ) : null}
          </Flex>
          <Flex
            justify="center"
            align="center"
            className="absolute bottom-4 inset-x-0"
          >
            <IconButton
              variant="solid"
              onClick={handlePlayPauseToggle}
              className="p-2 rounded-full mx-1"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </IconButton>
            <IconButton
              variant="solid"
              onClick={() => setIsMuted((prev) => !prev)}
              className="p-2 rounded-full mx-1"
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </IconButton>
            <IconButton
              variant="solid"
              onClick={requestFullscreen}
              className="p-2 rounded-full mx-1"
            >
              <Maximize2 size={24} />
            </IconButton>
          </Flex>
          <Flex
            justify="center"
            align="center"
            className="absolute bottom-4 right-4"
          >
            <ConversationPopup conversation={conversation} />
          </Flex>
        </Box>
        <Progress
          mt="4"
          color="mint"
          value={progressValue}
          max={100}
          className="w-[45vw]"
        />
        <Text size="2" align="center" className="mt-2">
          Time Left: {formatTime(timeLeft)}
        </Text>
      </Flex>
      <DemoSidebar selectedLanguage={selectedLanguage} />
    </Flex>
  );
}
