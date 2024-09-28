import { Flex, Grid, Heading, Text, Box, IconButton } from "@radix-ui/themes";
import { Volume2, VolumeX } from "lucide-react";
import { useState, useRef } from "react";

export function LessonsView() {
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
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
    <Grid columns="2fr 1fr" rows="1" className="h-screen overflow-hidden">
      {/* Left Section */}
      <Flex
        direction="column"
        className="border-r border-gray-200 shadow-lg h-full"
      >
        {/* Avatar Video - Top Half */}
        <Box className="flex-1 p-5 relative">
          <Flex
            align="center"
            position="relative"
            justify="center"
            className="w-full h-full bg-gray-200 rounded-lg"
          >
            {/* Placeholder for AI avatar */}
            <Text size="2">Avatar Video/Interaction Here</Text>
            {/* Mute/Unmute Button - Overlay */}
            <IconButton
              variant="solid"
              onClick={handleMuteToggle}
              className="absolute bottom-4 right-4 p-2 rounded-full"
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </IconButton>
          </Flex>
        </Box>

        {/* Conversation Tracking - Bottom Half */}
        <Box className="flex-1 p-5 border-t border-gray-200">
          <Heading size="4" className="text-center mb-4">
            Conversation
          </Heading>
          <Box className="w-full h-full bg-gray-50 rounded-lg p-4 overflow-auto space-y-4">
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
                  <Text size="2">
                    AI: C'est super! Prêt à commencer la leçon?
                  </Text>
                </Box>
              </Flex>
            </Flex>
          </Box>
        </Box>
      </Flex>

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
