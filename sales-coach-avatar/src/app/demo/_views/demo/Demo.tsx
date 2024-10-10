"use client";

import { useRef, useState } from "react";
import { Flex } from "@radix-ui/themes";
import { useViewContext } from "@/contexts";
import { AvatarContainer, DemoDescription } from "./_components";

export function DemoView() {
  const { changeView } = useViewContext();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showFullText, setShowFullText] = useState(false);

  const toggleTextVisibility = () => setShowFullText(!showFullText);

  return (
    <Flex
      gap="2"
      className="appcontainer mx-auto flex flex-col md:flex-col lg:flex-row xl:flex-row"
    >
      <AvatarContainer audioRef={audioRef} />
      <DemoDescription
        showFullText={showFullText}
        toggleTextVisibility={toggleTextVisibility}
        changeView={changeView}
      />
    </Flex>
  );
}

