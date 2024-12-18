"use client";

import { AudioPermissionsModal } from "@/components";
import { useViewportHeight } from "@/hooks";
import { Box, Flex, Heading, IconButton, Text } from "@radix-ui/themes";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  useViewportHeight();
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);

  const handlePlayClick = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handlePermissionsGranted = () => {
    setModalVisible(false);
    router.push("/demo");
  };

  return (
    <Box className="appcontainer">
      <Flex justify="start" align="start" className="pt-4 pb-6 md:pb-12">
        <Heading>ANAM.AI</Heading>
      </Flex>
      <Flex align="center" justify="center" className="h-[80vh] flex-col">
        <Heading size="8">AI-powered Language Learning platform</Heading>
        <Text>
          Practice conversations in French and get personalized feedback
        </Text>
        <VideoWithPlayButton onPlayClick={handlePlayClick} />
      </Flex>

      {isModalVisible && (
        <AudioPermissionsModal
          onClose={handleCloseModal}
          onPermissionGranted={handlePermissionsGranted}
        />
      )}
    </Box>
  );
}

const VideoWithPlayButton = ({ onPlayClick }: { onPlayClick: () => void }) => {
  return (
    <Box className="relative inline-block">
      <video
        className="w-[500px] h-auto"
        src="leo_gen_1.mp4"
        poster="leo_gen_1_poster.jpg"
        autoPlay
        loop
        muted
        playsInline
      />
      <IconButton
        size="4"
        variant="solid"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
        onClick={onPlayClick}
      >
        <Play width="30" height="30" />
      </IconButton>
    </Box>
  );
};
