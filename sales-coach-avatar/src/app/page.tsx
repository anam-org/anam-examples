"use client";

import { useState } from "react";
import { Box, Flex, Heading, IconButton, Text } from "@radix-ui/themes";
import { DemoView } from "./_views/demo/demo";
import { Play } from "lucide-react";
import DescriptionView from "./_views/description/description";

export default function HomePage() {
  const [currentView, setCurrentView] = useState("initial");

  const changeView = (view: string) => {
    setCurrentView(view);
  };

  return (
    <Box>
      {currentView === "initial" && (
        <Box className="appcontainer">
          <Flex justify="start" align="start" style={{ paddingTop: "1.5em" }}>
            <Heading>ANAM.AI</Heading>
          </Flex>
          <Flex
            align="center"
            justify="center"
            height="80vh"
            direction="column"
          >
            <Heading size="8">AI-powered training platform</Heading>
            <Text>
              Practice customer conversations and get personalized feedback
            </Text>
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
          </Flex>
        </Box>
      )}
      {currentView === "description" && (
        <DescriptionView changeView={changeView} />
      )}
      {currentView === "demo" && <DemoView changeView={changeView} />}
    </Box>
  );
}
