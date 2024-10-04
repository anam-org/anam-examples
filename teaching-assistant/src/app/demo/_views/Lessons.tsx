"use client";

import { useState, useEffect, useRef } from "react";
import {
  Flex,
  Text,
  IconButton,
  Box,
  Progress,
  Spinner,
} from "@radix-ui/themes";
import { Volume2, VolumeX, Play, Pause, Maximize2 } from "lucide-react";
import { LessonsSidebar, ConversationPopup } from "@/components";
import { useAnamContext, useSettingsContext } from "@/contexts";
import { errorHandler, logger } from "@/utils";
import {
  AnamEvent,
  Message,
  MessageRole,
} from "@anam-ai/js-sdk/dist/module/types";
import { useRouter } from "next/navigation";

export function LessonsView() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { anamClient, isClientInitialized } = useAnamContext();
  const { selectedLanguage } = useSettingsContext();
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loadingText, setLoadingText] = useState("Connecting...");
  const [streamError, setStreamError] = useState<string | null>(null);
  const [conversation, setConversation] = useState<
    { sender: string; text: string }[]
  >([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const router = useRouter();

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handlePlayPauseToggle = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleFullScreen = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen();
    }
  };

  const stopStreaming = () => {
    if (anamClient) {
      anamClient.stopStreaming().catch(errorHandler);
    }
  };

  const onConnectionEstablished = () => {
    setLoadingText("Connected to a Persona. Starting video stream...");
    setStreamError(null);
    logger.info("Connection established");
  };

  const onVideoStartedStreaming = () => {
    setLoadingText("");
    setStreamError(null);
    logger.info("Video started streaming");
  };

  const updateConversation = (updatedMessages: Message[]) => {
    const mappedMessages = updatedMessages.map((message) => ({
      sender:
        message.role === MessageRole.PERSONA
          ? MessageRole.PERSONA
          : MessageRole.USER,
      text: message.content,
    }));
    setConversation(mappedMessages);
  };

  const onConnectionClosed = (reason: string) => {
    logger.info("Connection closed", reason);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }

    if (timeLeft === 0 && timer) {
      clearInterval(timer);
      stopStreaming();
      router.push("/");
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isPlaying, timeLeft, router]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const progressValue = ((120 - timeLeft) / 120) * 100;

  useEffect(() => {
    const startStreaming = async () => {
      if (
        !isClientInitialized ||
        !anamClient ||
        !videoRef.current ||
        !audioRef.current
      ) {
        return;
      }

      try {
        anamClient.addListener(
          AnamEvent.CONNECTION_ESTABLISHED,
          onConnectionEstablished,
        );
        anamClient.addListener(
          AnamEvent.VIDEO_PLAY_STARTED,
          onVideoStartedStreaming,
        );
        anamClient.addListener(AnamEvent.CONNECTION_CLOSED, onConnectionClosed);
        await anamClient.streamToVideoAndAudioElements(
          videoRef.current.id,
          audioRef.current.id,
        );
        anamClient.addListener(
          AnamEvent.MESSAGE_HISTORY_UPDATED,
          updateConversation,
        );
      } catch (error) {
        errorHandler(error);
        setStreamError(
          "Failed to start streaming: Unauthorized or invalid session",
        );
      }
    };

    startStreaming();

    window.addEventListener("beforeunload", stopStreaming);

    return () => {
      stopStreaming();
      window.removeEventListener("beforeunload", stopStreaming);
      if (anamClient) {
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
      }
    };
  }, [isClientInitialized, anamClient]);

  return (
    <Flex>
      <Flex direction="column" className="flex-1">
        <Flex direction="column" align="center" className="p-5 h-full">
          <Box className="bg-gray-200 w-auto h-[85vh] aspect-square mx-auto relative flex justify-center">
            <video
              id="avatar-video"
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded-lg"
              muted={isMuted}
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
              ) : (
                loadingText && (
                  <>
                    <Spinner size="3" />
                    <Text size="2">{loadingText}</Text>
                  </>
                )
              )}
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
                onClick={handleMuteToggle}
                className="p-2 rounded-full mx-1"
              >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </IconButton>
              <IconButton
                variant="solid"
                onClick={handleFullScreen}
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
          {/* Progress Bar Section */}
          <Flex direction="column" align="center" className="p-4">
            <Progress
              color="mint"
              value={progressValue}
              max={100}
              className="w-[45vw]"
            />
            <Text size="2" align="center" className="mt-2">
              Time Left: {formatTime(timeLeft)}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      {/* Sidebar with Lessons */}
      <LessonsSidebar selectedLanguage={selectedLanguage} />
    </Flex>
  );
}
