"use client";

import { useRef, useState } from "react";
import { Grid } from "@radix-ui/themes";
import { useViewContext } from "@/contexts";
import { AvatarContainer, DemoDescription } from "./_components";

export function DemoView() {
  const { changeView } = useViewContext();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showFullText, setShowFullText] = useState(false);

  const toggleTextVisibility = () => setShowFullText(!showFullText);

  return (
    <Grid
      columns={{ sm: "1", md: "auto auto", lg: "auto auto" }}
      gap="3"
      className="appcontainer"
    >
      <AvatarContainer audioRef={audioRef} />
      <DemoDescription
        showFullText={showFullText}
        toggleTextVisibility={toggleTextVisibility}
        changeView={changeView}
      />
    </Grid>
  );
}
