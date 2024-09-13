"use client";

import { useState } from 'react';
import { Box, Flex, IconButton, Skeleton } from "@radix-ui/themes";
import { TriangleRightIcon } from '@radix-ui/react-icons';
import { AvatarStream } from './AvatarSteam';

export function DemoButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Box>
      <Box position="relative" display="inline-block">
        <video
          width="500px"
          height="auto"
          src="/videos/personas/leo_gen_1.mp4"
          poster="/jpg/posters/leo_gen_1_poster.jpg"
          autoPlay
          loop
          muted
          playsInline
        />
        <IconButton
          color="gray"
          size="4"
          onClick={handleModalOpen}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
          }}
        >
          <TriangleRightIcon width="30" height="30" />
        </IconButton>
      </Box>

      {isModalOpen && (
        <Flex
          position="fixed"
          width="100vw"
          height="100vh"
          justify="center"
          align="center"
          style={{
            top: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          }}
        >
          <AvatarStream
            startStream={isModalOpen}
            onStreamStart={() => console.log('Stream started')}
            onStreamEnd={handleModalClose}
          />
        </Flex>
      )}
    </Box>
  );
}
