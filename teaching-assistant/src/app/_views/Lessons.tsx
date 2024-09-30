import { useState, useEffect, useRef } from "react";
import { Flex, Text, IconButton, Box, Heading, Progress } from "@radix-ui/themes";
import { Volume2, VolumeX, Play, Pause, Maximize2 } from "lucide-react";
import { useAnamContext } from "@/contexts";
import { errorHandler, logger } from "@/utils";
import { AnamEvent } from "@anam-ai/js-sdk/dist/module/types";
import { LessonsSidebar } from "@/components/LessonsSidebar";

export function LessonsView() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { anamClient, isClientInitialized } = useAnamContext();
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loadingText, setLoadingText] = useState("Connecting...");
  const [streamError, setStreamError] = useState<string | null>(null);

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

  const onConnectionClosed = (reason: string) => {
    logger.info("Connection closed", reason);
  };

  useEffect(() => {
    const startStreaming = async () => {
      if (!isClientInitialized || !anamClient || !videoRef.current || !audioRef.current) {
        return;
      }

      try {
        anamClient.addListener(AnamEvent.CONNECTION_ESTABLISHED, onConnectionEstablished);
        anamClient.addListener(AnamEvent.VIDEO_PLAY_STARTED, onVideoStartedStreaming);
        anamClient.addListener(AnamEvent.CONNECTION_CLOSED, onConnectionClosed);

        await anamClient.streamToVideoAndAudioElements(videoRef.current.id, audioRef.current.id);
      } catch (error) {
        errorHandler(error);
        setStreamError("Failed to start streaming: Unauthorized or invalid session");
      }
    };

    startStreaming();

    const stopStreaming = () => {
      if (anamClient) {
        anamClient.stopStreaming().catch(errorHandler);
      }
    };

    window.addEventListener("beforeunload", stopStreaming);

    return () => {
      stopStreaming();
      window.removeEventListener("beforeunload", stopStreaming);
      if (anamClient) {
        anamClient.removeListener(AnamEvent.CONNECTION_ESTABLISHED, onConnectionEstablished);
        anamClient.removeListener(AnamEvent.VIDEO_PLAY_STARTED, onVideoStartedStreaming);
        anamClient.removeListener(AnamEvent.CONNECTION_CLOSED, onConnectionClosed);
      }
    };
  }, [isClientInitialized, anamClient]);
  
  return (
    <Flex className="h-screen overflow-hidden">
      <Flex direction="column" className="flex-1">
        <Flex gap="3" className="p-5 h-full">
          <Box className="w-3/4 h-full relative flex items-center justify-center bg-gray-200 rounded-lg">
            <video
              id="avatar-video"
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute top-0 left-0 w-full h-full object-cover"
              muted={isMuted}
            />
            <audio id="avatar-audio" ref={audioRef} autoPlay hidden />
            <Flex
              justify="center"
              align="center"
              className="w-full h-full absolute top-0 left-0"
            >
              {streamError ? (
                <Text size="2" className="text-red-500">{streamError}</Text>
              ) : (
                loadingText && <Text size="2">{loadingText}</Text>
              )}
            </Flex>
            <Flex justify="center" align="center" className="absolute bottom-4 inset-x-0">
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
          </Box>

          {/* Conversation Tracker + Text Input */}
          <Flex direction="column" className="w-1/4 h-full p-4 bg-gray-100 rounded-lg">
            <Heading size="4" className="text-center mb-4">
              Conversation
            </Heading>
            <Box className="flex-1 bg-gray-50 rounded-lg p-4 overflow-auto space-y-4">
              {/* Placeholder for conversation log */}
              <Flex direction="column" className="space-y-2">
                <Flex justify="start">
                  <Box className="bg-gray-300 text-gray-800 p-3 rounded-t-lg rounded-br-lg max-w-xs">
                    <Text size="2">AI: Bonjour! Comment ça va ?</Text>
                  </Box>
                </Flex>
                <Flex justify="end">
                  <Box className="bg-blue-500 text-white p-3 rounded-t-lg rounded-bl-lg max-w-xs">
                    <Text size="2">User: Ça va bien, merci.</Text>
                  </Box>
                </Flex>
                <Flex justify="start">
                  <Box className="bg-gray-300 text-gray-800 p-3 rounded-t-lg rounded-br-lg max-w-xs">
                    <Text size="2">AI: C'est super! Prêt à commencer la leçon?</Text>
                  </Box>
                </Flex>
              </Flex>
            </Box>

            {/* Placeholder for User Input */}
            <Box className="mt-4">
              <input
                type="text"
                placeholder="Type your response..."
                className="w-full p-3 rounded-lg"
              />
            </Box>
          </Flex>
        </Flex>

        {/* Progress Bar Section */}
        <Flex direction="column" align="center" className="p-4">
          <Progress value={50} max={100} className="w-full" />
          <Text size="2" align="center" className="mt-2">Lesson Progress: 50%</Text>
        </Flex>
      </Flex>

      {/* Sidebar with Lessons */}
      <LessonsSidebar />
    </Flex>
  );
}
