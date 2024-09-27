import { Grid } from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";
import {
  Flex,
  IconButton,
  Separator,
  Section,
  Text,
  Spinner,
  Box,
  Button,
  Heading,
} from "@radix-ui/themes";
import { Pause, RotateCcw, Video, Volume2, Dot, Phone } from "lucide-react";
import { AnamEvent } from "@anam-ai/js-sdk/dist/module/types";
import { useViewContext } from "@/contexts";
import { useAnamContext, useVideoAudioPermissionContext } from "@/contexts";
import { useToast } from "@/hooks";
import { errorHandler } from "@/utils";
import { ReactNode } from "react";

const GhostIconButton = ({
  children,
  ...props
}: {
  children: ReactNode;
  [key: string]: any;
}) => (
  <IconButton variant="ghost" className="text-gray-200" {...props}>
    {children}
  </IconButton>
);

export function DemoView() {
  const { changeView } = useViewContext();
  const [showFullText, setShowFullText] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const toggleTextVisibility = () => setShowFullText(!showFullText);

  useEffect(() => {
    const interval = setInterval(
      () => setSecondsElapsed((prev) => prev + 1),
      1000,
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <Grid columns="2fr 1fr" rows="1">
      <LeftPanel secondsElapsed={secondsElapsed} />
      <RightPanel
        showFullText={showFullText}
        toggleTextVisibility={toggleTextVisibility}
        changeView={changeView}
      />
    </Grid>
  );
}

const Timer = ({ secondsElapsed }: { secondsElapsed: number }) => {
  const minutes = Math.floor(secondsElapsed / 60);
  const seconds = secondsElapsed % 60;
  return (
    <Text className="text-gray-200">{`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`}</Text>
  );
};

const VideoControls = ({ secondsElapsed }: { secondsElapsed: number }) => (
  <Flex
    justify="center"
    align="center"
    gap="2"
    className="p-[0.75em_2em] rounded-[30px] bg-gray-700 absolute bottom-[1em]"
  >
    <GhostIconButton>
      <Pause size="20" />
    </GhostIconButton>
    <GhostIconButton>
      <Volume2 size="20" />
    </GhostIconButton>
    <GhostIconButton>
      <Video size="20" />
    </GhostIconButton>
    <Separator orientation="vertical" />
    <Timer secondsElapsed={secondsElapsed} />
    <GhostIconButton>
      <RotateCcw size="20" />
    </GhostIconButton>
  </Flex>
);

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
      if (
        isClientInitialized &&
        anamClient &&
        videoRef.current &&
        audioRef.current
      ) {
        try {
          anamClient.addListener(
            AnamEvent.CONNECTION_ESTABLISHED,
            onConnectionEstablished,
          );
          anamClient.addListener(
            AnamEvent.VIDEO_PLAY_STARTED,
            onVideoStartedStreaming,
          );
          anamClient.addListener(
            AnamEvent.CONNECTION_CLOSED,
            onConnectionClosed,
          );

          await anamClient.streamToVideoAndAudioElements(
            videoRef.current.id,
            audioRef.current.id,
          );
        } catch (error) {
          errorHandler(error);
        }
      }
    };

    startStreaming();

    return () => {
      if (anamClient) {
        anamClient.removeListener(
          AnamEvent.CONNECTION_ESTABLISHED,
          onConnectionEstablished,
        );
        anamClient.removeListener(
          AnamEvent.VIDEO_PLAY_STARTED,
          onVideoStartedStreaming,
        );
        anamClient.removeListener(
          AnamEvent.CONNECTION_CLOSED,
          onConnectionClosed,
        );
      }
    };
  }, [isClientInitialized, anamClient]);

  return (
    <Box className="relative w-full h-full">
      {loading && (
        <Flex
          justify="center"
          align="center"
          className="w-full h-full absolute top-0 left-0"
        >
          <Spinner aria-label="Loading..." size="1" />
          <label className="ml-2">{loadingText}</label>
        </Flex>
      )}
      <video
        id="video"
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
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
      className="absolute w-[250px] h-[250px] rounded-[15px_0px_15px_0px] object-cover bottom-0 right-0"
    />
  );
};

const LeftPanel = ({ secondsElapsed }: { secondsElapsed: number }) => (
  <Section size="1">
    <Flex
      justify="center"
      align="center"
      className="m-[0_2em_2em_2em] bg-gray-100 rounded-lg border border-gray-300 h-[95vh] relative"
    >
      <AvatarSection />
      <VideoControls secondsElapsed={secondsElapsed} />
      <VideoSection />
    </Flex>
  </Section>
);

const ScenarioText = ({
  showFullText,
  toggleTextVisibility,
}: {
  showFullText: boolean;
  toggleTextVisibility: () => void;
}) => (
  <Text as="p" mb="3" size="2">
    {showFullText
      ? "In this scenario, the support agent works for a major Telecommunications company. The customer, Patrick Bateman, is an existing subscriber of their services who recently experienced a significant personal loss — the death of a loved one. With this difficult transition, Patrick contacts the customer support team to remove the deceased from their joint account. Patrick has two main objectives: he wants to ensure that the removal happens in the next billing period and wishes to verify that the changes won’t disrupt any of his or the loved one’s services during the current billing period or result in unexpected charges."
      : "In this scenario, the support agent works for a major Telecommunications company. The customer, Patrick Bateman, is an existing subscriber of their services who recently experienced a significant personal loss..."}
    <Text
      color="gray"
      size="2"
      onClick={toggleTextVisibility}
      className="cursor-pointer transition-colors duration-200 ease-in"
      onMouseEnter={(e) => (e.currentTarget.style.color = "#b0b0b0")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "gray")}
    >
      {showFullText ? "Show Less" : "Show More"}
    </Text>
  </Text>
);

const Instructions = () => {
  const instructions = [
    "Listen empathetically to Patrick’s request.",
    "Verify the account details and confirm the identity.",
    "Ensure the removal happens in the next billing period.",
    "Check that no services are disrupted or incur unexpected charges.",
    "Provide a follow-up confirmation to Patrick.",
  ];

  return (
    <>
      <Heading as="h2" size="3" mb="3" weight="medium">
        Key Steps for Support Agent
      </Heading>
      <ul>
        {instructions.map((instruction, index) => (
          <li key={index}>
            <Flex align="center" mb="1">
              <Dot size="30" />
              <Text as="span" className="ml-2">
                {instruction}
              </Text>
            </Flex>
          </li>
        ))}
      </ul>
    </>
  );
};

const RightPanel = ({
  showFullText,
  toggleTextVisibility,
  changeView,
}: {
  showFullText: boolean;
  toggleTextVisibility: () => void;
  changeView: (view: string) => void;
}) => (
  <Flex
    direction="column"
    className="p-[0em_2em_2em_2em] border-l border-gray-300 h-screen justify-between"
  >
    <Section size="1">
      <Flex align="center" mb="3">
        <Phone size="18" />
        <Text as="p" size="2" className="ml-2">
          Phone
        </Text>
      </Flex>
      <Heading as="h2" size="4" mb="2" weight="light">
        Remove someone from my plan
      </Heading>
      <Heading as="h2" size="3" mb="1" weight="medium">
        Scenario
      </Heading>
      <ScenarioText
        showFullText={showFullText}
        toggleTextVisibility={toggleTextVisibility}
      />
      <Instructions />
    </Section>
    <Flex justify="end">
      <Button onClick={() => changeView("initial")}>End Demo</Button>
    </Flex>
  </Flex>
);
