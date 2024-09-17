import {
  Text,
  Button,
  Flex,
  Grid,
  Heading,
  Section,
  IconButton,
  Separator,
} from "@radix-ui/themes";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import RefreshIcon from "@mui/icons-material/Refresh";
import PauseIcon from "@mui/icons-material/Pause";
import VideocamIcon from "@mui/icons-material/Videocam";
import Image from "next/image";
import { useEffect, useState } from "react";

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

const AvatarSection = ({ secondsElapsed }: { secondsElapsed: number }) => {
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

const ScenarioText = ({
  showFullText,
  toggleTextVisibility,
}: {
  showFullText: boolean;
  toggleTextVisibility: () => void;
}) => {
  return (
    <Text as="p" mb="3" size="2">
      {showFullText
        ? "In this scenario, the support agent works for a major Telecommunications company. The customer, Patrick Bateman, is an existing subscriber of their services who recently experienced a significant personal loss — the death of a loved one. With this difficult transition, Patrick contacts the customer support team to remove the deceased from their joint account. Patrick has two main objectives: he wants to ensure that the removal happens in the next billing period and wishes to verify that the changes won’t disrupt any of his or the loved one’s services during the current billing period or result in unexpected charges. As part of this training exercise, it's crucial for the representative to display empathy towards Patrick's grief while efficiently handling the request by following the necessary protocols and procedures."
        : "In this scenario, the support agent works for a major Telecommunications company. The customer, Patrick Bateman, is an existing subscriber of their services who recently experienced a significant personal loss — the death of a loved one... "}
      <Text
        color="gray"
        size="2"
        onClick={toggleTextVisibility}
        style={{
          cursor: "pointer",
          transition: "color 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#b0b0b0")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "gray")}
      >
        {showFullText ? "Show Less" : "Show More"}
      </Text>
    </Text>
  );
};

const Instructions = () => {
  return (
    <>
      <Heading as="h2" size="3" mb="1" weight="medium">
        Key Steps for Support Agent
      </Heading>
      <ul style={{ paddingLeft: "1em" }}>
        <li style={{ display: "flex", marginBottom: "0.5em" }}>
          <Image src="/point.svg" alt="icon" width="15" height="15" />
          <Text as="span" style={{ marginLeft: "0.5em" }}>
            Listen empathetically to Patrick’s request.
          </Text>
        </li>
        <li style={{ display: "flex", marginBottom: "0.5em" }}>
          <Image src="/point.svg" alt="icon" width="15" height="15" />
          <Text as="span" style={{ marginLeft: "0.5em" }}>
            Verify the account details and confirm the identity.
          </Text>
        </li>
        <li style={{ display: "flex", marginBottom: "0.5em" }}>
          <Image src="/point.svg" alt="icon" width="15" height="15" />
          <Text as="span" style={{ marginLeft: "0.5em" }}>
            Ensure the removal happens in the next billing period.
          </Text>
        </li>
        <li style={{ display: "flex", marginBottom: "0.5em" }}>
          <Image src="/point.svg" alt="icon" width="15" height="15" />
          <Text as="span" style={{ marginLeft: "0.5em" }}>
            Check that no services are disrupted or incur unexpected charges.
          </Text>
        </li>
        <li style={{ display: "flex" }}>
          <Image src="/point.svg" alt="icon" width="15" height="15" />
          <Text as="span" style={{ marginLeft: "0.5em" }}>
            Provide a follow-up confirmation to Patrick.
          </Text>
        </li>
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
}) => {
  return (
    <Flex
      direction="column"
      style={{
        padding: "0em 2em 2em 2em",
        borderColor: "#e0e0e0",
        borderLeftWidth: "1px",
        height: "100vh",
        justifyContent: "space-between",
      }}
    >
      <Section size="1">
        <Flex align="center" mb="3">
          <Image src="/phone-call.svg" alt="icon" width="18" height="18" />
          <Text as="p" size="2" style={{ marginLeft: "0.5em" }}>
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
};

export function DemoView({
  changeView,
}: {
  changeView: (view: string) => void;
}) {
  const [showFullText, setShowFullText] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const toggleTextVisibility = () => {
    setShowFullText((prevState) => !prevState);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Grid columns="2fr 1fr" rows="1">
      <Section size="1">
        <AvatarSection secondsElapsed={secondsElapsed} />
      </Section>
      <RightPanel
        showFullText={showFullText}
        toggleTextVisibility={toggleTextVisibility}
        changeView={changeView}
      />
    </Grid>
  );
}
