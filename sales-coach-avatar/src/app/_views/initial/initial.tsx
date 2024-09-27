import { useViewContext } from "@/contexts/ViewContext";
import { Box, Flex, Heading, IconButton, Text } from "@radix-ui/themes";
import { Play } from "lucide-react";

export const InitialView = () => {
    const { changeView } = useViewContext();
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
          src="leo_gen_1.mp4"
          poster="leo_gen_1_poster.jpg"
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