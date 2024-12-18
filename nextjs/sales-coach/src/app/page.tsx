"use client";

import { Box, Flex, Heading, IconButton, Text } from "@radix-ui/themes";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <Box className="appcontainer">
      <Flex justify="start" align="start" className="pt-6">
        <Heading>ANAM.AI</Heading>
      </Flex>
      <Flex align="center" justify="center" className="h-[80vh] flex-col">
        <Heading size="8">AI-powered training platform</Heading>
        <Text>
          Practice customer conversations and get personalized feedback
        </Text>
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
            onClick={() => router.push("/scenarios")}
          >
            <Play width="30" height="30" />
          </IconButton>
        </Box>
      </Flex>
    </Box>
  );
}
