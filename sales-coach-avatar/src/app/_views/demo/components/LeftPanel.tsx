import { useEffect, useRef, useState } from "react";
import { Flex, IconButton, Separator, Section, Text, Spinner, Box } from "@radix-ui/themes";
import { Pause, RotateCcw, Video, Volume2 } from "lucide-react";
import { AnamEvent } from "@anam-ai/js-sdk/dist/module/types";
import { useToast } from "@/hooks";
import { useAnamContext, useVideoAudioPermissionContext } from "@/contexts";
import { errorHandler } from "@/utils";

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

const AvatarSection = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { anamClient, isClientInitialized } = useAnamContext();
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Connecting...");
  const { toast } = useToast();

  const onConnectionEstablished = () => {
    setLoadingText("Connected to a Persona. Starting video stream...");
    toast({
      title: "Connection Established",
      description: "The video stream is starting now.",
    });
  };

  const onVideoStartedStreaming = () => {
    setLoading(false);
    toast({
      title: "Video Started",
      description: "Streaming successfully started.",
    });
  };

  const onConnectionClosed = (reason: string) => {
    toast({
      title: "Connection Closed",
      description: reason,
    });
  };

  useEffect(() => {
    const startStreaming = async () => {
      if (isClientInitialized && anamClient && videoRef.current && audioRef.current) {
        try {
          console.log("Starting streaming...");
          anamClient.addListener(AnamEvent.CONNECTION_ESTABLISHED, onConnectionEstablished);
          anamClient.addListener(AnamEvent.VIDEO_PLAY_STARTED, onVideoStartedStreaming);
          anamClient.addListener(AnamEvent.CONNECTION_CLOSED, onConnectionClosed);
          console.log(`${videoRef.current.id} ${audioRef.current.id}`);
          await anamClient.streamToVideoAndAudioElements(videoRef.current.id, audioRef.current.id);
        } catch (error) {
          errorHandler(error);
        }
      }
    };

    startStreaming();

    return () => {
      if (anamClient) {
        anamClient.removeListener(AnamEvent.CONNECTION_ESTABLISHED, onConnectionEstablished);
        anamClient.removeListener(AnamEvent.VIDEO_PLAY_STARTED, onVideoStartedStreaming);
        anamClient.removeListener(AnamEvent.CONNECTION_CLOSED, onConnectionClosed);
      }
    };
  }, [isClientInitialized, anamClient]);

  return (
    <Box>
      {loading ? (
        <Flex
          justify="center"
          align="center"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <Spinner aria-label="Loading..." size="1" />
          <label style={{ marginLeft: "0.5em" }}>{loadingText}</label>
        </Flex>
      ) : null}
      <video
        id="video"
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "15px",
          objectFit: "cover",
        }}
      />
      <audio id="audio" ref={audioRef} autoPlay />
    </Box>
  );
};

const VideoSection = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { mediaStream } = useVideoAudioPermissionContext();

  useEffect(() => {
    if (mediaStream && videoRef.current) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  return (
    <video
      ref={videoRef}
      autoPlay
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
        <AvatarSection />
        <VideoControls secondsElapsed={secondsElapsed} />
        <VideoSection />
      </Flex>
    </Section>
  );
};
