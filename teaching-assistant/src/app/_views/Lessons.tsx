import { Flex, Grid, Heading, Text, Box, IconButton } from "@radix-ui/themes";
import { Volume2, VolumeX, Play, Pause, Maximize2 } from "lucide-react";
import { useState, useRef } from "react";

export function LessonsView() {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const lessons = [
    {
      title: "Introduction to French",
      description: "Basic greetings and phrases",
    },
    { title: "French Numbers", description: "Learn to count in French" },
    {
      title: "Basic Conversations",
      description: "Common questions and answers",
    },
    { title: "French Verbs", description: "Introduction to verb conjugation" },
    {
      title: "Everyday Vocabulary",
      description: "Essential words for daily life",
    },
  ];

  return (
    <Grid columns="3fr 1fr" rows="1" className="h-screen overflow-hidden">
      {/* Left Section - Grid Layout */}
      <Grid rows="2fr 1fr" className="border-r border-gray-200 shadow-lg h-full">
        {/* Top Half - Split into two sections */}
        <Flex gap="3" className="p-5">
          {/* Avatar Video */}
          <Box className="w-3/4 h-full relative flex items-center justify-center bg-gray-200 rounded-lg">
            <Text size="2">Avatar Video/Interaction Here</Text>
            {/* Controls - Bottom Center */}
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

        {/* Bottom Half - Progress Tracker */}
        <Flex direction="column" className="p-5 border-t border-gray-100 shadow">
          <Box className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
            <Text size="2">Progress will be displayed here</Text>
          </Box>
        </Flex>
      </Grid>

      {/* Lessons Section */}
      <Flex direction="column" className="p-5 pt-8 space-y-4">
        <Heading size="4">French Lessons</Heading>
        <Text size="2">Select a lesson to get started</Text>
        <Box className="space-y-4">
          {lessons.map((lesson, index) => (
            <Box
              key={index}
              className="p-4 border border-gray-200 rounded-lg shadow hover:bg-gray-100 transition duration-150"
            >
              <Heading size="3">{lesson.title}</Heading>
              <Text size="2" className="text-gray-500">
                {lesson.description}
              </Text>
            </Box>
          ))}
        </Box>
      </Flex>
    </Grid>
  );
}
