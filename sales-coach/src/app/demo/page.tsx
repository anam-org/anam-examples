"use client";

import { Flex, Spinner } from "@radix-ui/themes";
import {
  AvatarContainer,
  DemoControls,
  DemoDescription,
  UserVideoContainer,
} from "@/components";
import { useEffect, useState } from "react";
import { useAnamContext } from "@/contexts";
import { useViewportHeight } from "@/hooks";

export default function DemoView() {
  useViewportHeight();
  const { setOnVideoStartedStreaming } = useAnamContext();
  const [isVideoStreaming, setIsVideoStreaming] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setSecondsElapsed((prev) => prev + 1),
      1000,
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setOnVideoStartedStreaming(() => {
      setIsVideoStreaming(true);
    });
  }, [setOnVideoStartedStreaming]);

  return (
    <Flex
      gap="2"
      className="appcontainer mx-auto flex flex-col md:flex-col lg:flex-row xl:flex-row"
    >
      <AvatarContainer
        className="relative mt-2 flex items-center justify-center sm:min-w-[80vw] md:min-w-[500px] lg:min-h-[90vh] xl:min-h-[98vh] 2xl:min-h-[98vh] aspect-square bg-gray-100 rounded-lg border border-gray-300"
        videoClassName="w-auto h-full object-cover rounded-lg"
      >
        {!isVideoStreaming && (
          <Flex className="absolute" align="center" justify="center">
            <Spinner aria-label="Loading..." size="1" />
            <label className="ml-2 text-sm md:text-base lg:text-lg">
              Connecting to Persona...
            </label>
          </Flex>
        )}
        <DemoControls
          secondsElapsed={secondsElapsed}
          setSecondsElapsed={setSecondsElapsed}
        />
        <UserVideoContainer />
      </AvatarContainer>
      <DemoDescription />
    </Flex>
  );
}
