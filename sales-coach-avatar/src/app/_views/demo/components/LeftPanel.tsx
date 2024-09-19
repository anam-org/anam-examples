import { Flex, IconButton, Separator, Skeleton, Text } from "@radix-ui/themes";
import { Pause, RotateCcw, Section, Video, Volume2 } from "lucide-react";

const Timer = ({ secondsElapsed }: { secondsElapsed: number }) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return <Text style={{ color: "#EEEEEE" }}>{formatTime(secondsElapsed)}</Text>;
};

const VideoControls = ({ secondsElapsed }: { secondsElapsed: number }) => {
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
        <Pause size="20" />
      </IconButton>
      <IconButton variant="ghost" style={{ color: "#EEEEEE" }}>
        <Volume2 size="20" />
      </IconButton>
      <IconButton variant="ghost" style={{ color: "#EEEEEE" }}>
        <Video size="20" />
      </IconButton>
      <Separator orientation="vertical" />
      <Timer secondsElapsed={secondsElapsed} />
      <IconButton variant="ghost" style={{ color: "#EEEEEE" }}>
        <RotateCcw size="20" />
      </IconButton>
    </Flex>
  );
};

const VideoSection = () => {
  return (
    <video
      src="/videos/personas/astrid_gen_1.mp4"
      poster="/jpg/posters/astrid_gen_1_poster.jpg"
      autoPlay
      loop
      muted
      playsInline
      style={{
        position: "absolute",
        width: "250px",
        height: "250px",
        borderRadius: "15px 0px 15px 0px",
        objectFit: "cover",
        bottom: "0em",
        right: "0em",
      }}
    />
  );
};

export const LeftPanel = ({ secondsElapsed }: { secondsElapsed: number }) => {
  return (
    <Section size="1">
      <Flex
        justify="center"
        align="center"
        style={{
          margin: "0em 2em 2em 2em",
          backgroundColor: "#f9f9f9",
          borderRadius: "15px",
          borderColor: "#e0e0e0",
          borderWidth: "1px",
          height: "95vh",
          position: "relative",
        }}
      >
        <Skeleton>
          <video
            src="/videos/personas/leo_gen_1.mp4"
            poster="/jpg/posters/leo_gen_1_poster.jpg"
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "15px",
              objectFit: "cover",
            }}
          />
        </Skeleton>
        <VideoControls secondsElapsed={secondsElapsed} />
        <VideoSection />
      </Flex>
    </Section>
  );
};