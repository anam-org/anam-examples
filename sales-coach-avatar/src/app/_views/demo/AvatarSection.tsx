import { Flex } from "@radix-ui/themes";
import { VideoControls } from "./VideoControls";
import { VideoSection } from "./VideoSection";

export const AvatarSection = ({ secondsElapsed }: { secondsElapsed: number }) => {
    return (
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
        <VideoControls secondsElapsed={secondsElapsed} />
        <VideoSection />
      </Flex>
    );
  };