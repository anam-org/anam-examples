import { Flex, IconButton, Separator, Text } from "@radix-ui/themes";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import RefreshIcon from "@mui/icons-material/Refresh";
import PauseIcon from "@mui/icons-material/Pause";
import VideocamIcon from "@mui/icons-material/Videocam";

const Timer = ({ secondsElapsed }: { secondsElapsed: number }) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return <Text style={{ color: "#EEEEEE" }}>{formatTime(secondsElapsed)}</Text>;
};

export const VideoControls = ({ secondsElapsed }: { secondsElapsed: number }) => {
    return (
      <Flex
        justify="center"
        align="center"
        gap="2"
        style={{
          padding: "0.75em 2em",
          borderRadius: "30px",
          backgroundColor: "#444444",
          position: "absolute",
          bottom: "1em",
        }}
      >
        <IconButton variant="ghost" style={{ color: "#EEEEEE" }}>
          <PauseIcon width="30" height="30" />
        </IconButton>
        <IconButton variant="ghost" style={{ color: "#EEEEEE" }}>
          <VolumeUpIcon width="30" height="30" />
        </IconButton>
        <IconButton variant="ghost" style={{ color: "#EEEEEE" }}>
          <VideocamIcon width="30" height="30" />
        </IconButton>
        <Separator orientation="vertical" />
        <Timer secondsElapsed={secondsElapsed} />
        <IconButton variant="ghost" style={{ color: "#EEEEEE" }}>
          <RefreshIcon width="30" height="30" />
        </IconButton>
      </Flex>
    );
  };