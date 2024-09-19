"use client";

import { useState } from "react";
import { Box, Flex, Heading, IconButton, Text } from "@radix-ui/themes";
import { DemoView } from "./_views/demo/demo";
import { Play } from "lucide-react";
import DescriptionView from "./_views/description/description";

export default function HomePage() {
  const [currentView, setCurrentView] = useState("initial");

  const changeView = (view: string) => setCurrentView(view);

  const renderView = () => {
    switch (currentView) {
      case "description":
        return <DescriptionView changeView={changeView} />;
      case "demo":
        return <DemoView changeView={changeView} />;
      case "initial":
      default:
        return <InitialView changeView={changeView} />;
    }
  };

  return <Box>{renderView()}</Box>;
}

const InitialView = ({ changeView }: { changeView: (view: string) => void }) => {
  return (
    <Box className="appcontainer">
      <Flex justify="start" align="start" style={{ paddingTop: "1.5em" }}>
        <Heading>ANAM.AI</Heading>
      </Flex>
      <Flex align="center" justify="center" height="80vh" direction="column">
        <Heading size="8">AI-powered training platform</Heading>
        <Text>Practice customer conversations and get personalized feedback</Text>
        <VideoWithPlayButton changeView={changeView} />
      </Flex>
    </Box>
  );
};

const VideoWithPlayButton = ({
  changeView,
}: {
  changeView: (view: string) => void;
}) => {
  return (
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
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
        }}
        onClick={() => changeView("description")}
      >
        <Play width="30" height="30" />
      </IconButton>
    </Box>
  );
};
