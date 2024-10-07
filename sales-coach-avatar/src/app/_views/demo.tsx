"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Grid,
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
import {
  useViewContext,
  useAnamContext,
  ScenarioType,
  useVideoAudioPermissionContext,
} from "@/contexts";
import { errorHandler } from "@/utils";
import { useToast } from "@/hooks";
import { ReactNode } from "react";

const scenarioDetails: Record<
  ScenarioType,
  {
    title: string;
    fullDescription: string;
    briefDescription: string;
    instructions: string[];
  }
> = {
  product_demo: {
    title: "Product Demo",
    fullDescription:
      "In this scenario, the support agent works for a major Telecommunications company. The customer, Jordan, is an existing subscriber of their services who is interested in learning more about a new product offering. The agent's goal is to effectively demonstrate the product's key features, address any questions the customer may have, and encourage the customer to proceed to the next stage of the sales process.",
    briefDescription:
      "In this scenario, the support agent works for a major Telecommunications company. The customer, Jordan, is interested in learning more about a new product offering...",
    instructions: [
      "Understand the customer's needs and tailor the demo to their interests.",
      "Demonstrate the key features of the product.",
      "Address any concerns or questions the customer has.",
      "Encourage the customer to proceed to the next steps.",
    ],
  },
  negotiation: {
    title: "Negotiation",
    fullDescription:
      "In this scenario, the sales agent must negotiate the pricing and terms of a deal with a customer named Taylor, who is interested in purchasing a product but is concerned about the pricing. The agent must balance securing the sale with ensuring the company’s profitability by finding a middle ground that satisfies both parties.",
    briefDescription:
      "In this scenario, the sales agent must negotiate the pricing and terms of a deal with the customer, Taylor...",
    instructions: [
      "Understand the customer's concerns about pricing.",
      "Highlight the value of the product to justify the cost.",
      "Offer potential incentives or adjustments to meet the customer's budget.",
      "Ensure the final agreement benefits both the customer and the company.",
    ],
  },
  objection_handling: {
    title: "Objection Handling",
    fullDescription:
      "In this scenario, the support agent is faced with a customer named Alex who has objections about the product's suitability for their needs. The agent must listen carefully, acknowledge the customer's concerns, and provide solutions or alternatives to overcome their objections, helping to move the sale forward.",
    briefDescription:
      "In this scenario, the support agent must handle objections raised by the customer, Alex, who has concerns about the product's suitability...",
    instructions: [
      "Listen carefully to the customer's concerns.",
      "Acknowledge the objections and validate the customer's feelings.",
      "Provide solutions or alternatives that address the objections.",
      "Move the conversation towards closing the sale after resolving concerns.",
    ],
  },
  closing_deal: {
    title: "Closing Deal",
    fullDescription:
      "In this scenario, the sales agent is at the final stage of the sales process with a customer named Jamie. The customer is ready to commit but may need reassurance or a final push. The agent must close the deal by addressing any last-minute concerns and securing the customer's commitment to the purchase.",
    briefDescription:
      "In this scenario, the sales agent is at the final stage of the sales process and must close the deal with the customer, Jamie...",
    instructions: [
      "Address any final concerns or hesitations the customer may have.",
      "Reinforce the value and benefits of the product.",
      "Guide the customer towards making the final commitment.",
      "Confirm the details of the deal and finalize the agreement.",
    ],
  },
  follow_up: {
    title: "Follow Up",
    fullDescription:
      "In this scenario, the support agent follows up with a customer named Sam after a previous interaction. The goal is to check in on the customer's experience with the product, gather feedback, and offer additional assistance or upsell opportunities to strengthen the relationship and encourage future engagement.",
    briefDescription:
      "In this scenario, the support agent follows up with a customer named Sam to check in on their experience with the product...",
    instructions: [
      "Check in on the customer's satisfaction with the product or service.",
      "Ask for feedback and address any lingering concerns.",
      "Offer additional assistance or suggest complementary products.",
      "Strengthen the customer relationship and encourage future engagement.",
    ],
  },
  customer_support: {
    title: "Customer Support",
    fullDescription:
      "In this scenario, the support agent helps a customer named Morgan who is having trouble with a service they recently purchased. The agent must provide assistance by troubleshooting the issue, offering solutions, and ensuring the customer is satisfied with the resolution.",
    briefDescription:
      "In this scenario, the support agent helps a customer named Morgan who is having trouble with a service they recently purchased...",
    instructions: [
      "Listen to the customer's issue and gather relevant information.",
      "Troubleshoot the problem and provide clear solutions.",
      "Guide the customer through any necessary steps to resolve the issue.",
      "Ensure the customer is satisfied with the resolution and offer follow-up support.",
    ],
  },
};

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
    <Text className="text-gray-200">{`${String(minutes).padStart(2, "0")}:${String(
      seconds,
    ).padStart(2, "0")}`}</Text>
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

  const onConnectionEstablished = useCallback(() => {
    setLoadingText("Connected to a Persona. Starting video stream...");
    toast({
      title: "Connection Established",
      description: "The video stream is starting now.",
    });
  }, [toast]);

  const onVideoStartedStreaming = useCallback(() => {
    setLoading(false);
    toast({
      title: "Video Started",
      description: "Streaming successfully started.",
    });
  }, [toast]);

  const onConnectionClosed = useCallback(
    (reason: string) => {
      toast({
        title: "Connection Closed",
        description: reason,
      });
      setLoading(false);
    },
    [toast],
  );

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
  }, [
    anamClient,
    isClientInitialized,
    onConnectionEstablished,
    onVideoStartedStreaming,
    onConnectionClosed,
  ]);

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
      <audio id="audio" ref={audioRef} autoPlay hidden />
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
      className="absolute w-[200px] h-[200px] rounded-[15px_0px_0px_0px] object-cover bottom-0 right-0"
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

import { useSettingsContext } from "@/contexts";

const RightPanel = ({
  showFullText,
  toggleTextVisibility,
  changeView,
}: {
  showFullText: boolean;
  toggleTextVisibility: () => void;
  changeView: (view: string) => void;
}) => {
  const { selectedScenario } = useSettingsContext();
  const scenario = scenarioDetails[selectedScenario];

  return (
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
          {scenario.title}
        </Heading>
        <Heading as="h2" size="3" mb="1" weight="medium">
          Scenario
        </Heading>
        <Text as="p" mb="3" size="2">
          {showFullText ? scenario.fullDescription : scenario.briefDescription}
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
        <Heading as="h2" size="3" mb="3" weight="medium">
          Key Steps for Support Agent
        </Heading>
        <ul>
          {scenario.instructions.map((instruction, index) => (
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
      </Section>
      <Flex justify="end">
        <Button onClick={() => changeView("initial")}>End Demo</Button>
      </Flex>
    </Flex>
  );
};
