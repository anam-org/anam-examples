import { useState } from "react";
import { Cross2Icon, SpeakerOffIcon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Section,
  Separator,
  Strong,
  Text,
} from "@radix-ui/themes";
import { VideoCheckModal } from "../_components/VideoCheckModal/VideoCheckModal";

interface DescriptionViewProps {
  changeView: (view: string) => void;
}

const BackButton = ({ changeView }: { changeView: (view: string) => void }) => (
  <Flex justify="start" align="start" style={{ paddingTop: "1.5em" }}>
    <IconButton
      variant="ghost"
      color="gray"
      size="4"
      onClick={() => changeView("initial")}
    >
      <Cross2Icon width="30" height="30" />
    </IconButton>
  </Flex>
);

const InstructionDetails = () => (
  <Flex direction="column" style={{ flex: 1 }}>
    <Heading mb="3" as="h2" size="4" weight="light">
      Instructions
    </Heading>
    <Text as="p" mb="2" size="2">
      During the simulation you will be conversing with an{" "}
      <Strong>advanced AI system</Strong>, designed to mimic real-life customer
      scenarios.
    </Text>
    <Text as="p" mb="3" size="2">
      Your conversation will be scored and you will get actionable feedback on
      your performance.
    </Text>
    <Flex
      align="center"
      style={{
        padding: "0.75em 1em",
        backgroundColor: "#FFFFFF",
        borderRadius: "15px",
        borderColor: "#e0e0e0",
        borderWidth: "1px",
      }}
    >
      <SpeakerOffIcon />
      <Text as="p" size="2" style={{ marginLeft: "1em" }}>
        Find a quiet space to focus on the conversation
      </Text>
    </Flex>
  </Flex>
);

const ScenarioDetails = ({
  showFullText,
  toggleTextVisibility,
}: {
  showFullText: boolean;
  toggleTextVisibility: () => void;
}) => (
  <Flex direction="column" style={{ flex: 1 }}>
    <Heading mb="2" as="h2" size="4" weight="light">
      The Scenario
    </Heading>
    <Heading mb="2" as="h1" size="4">
      Remove someone from my plan
    </Heading>
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
    <RoleDetails />
    <CustomerDetails />
  </Flex>
);

const RoleDetails = () => (
  <Flex
    direction="column"
    justify="start"
    mb="3"
    style={{
      padding: "0.75em 1em",
      backgroundColor: "#FFFFFF",
      borderRadius: "15px",
      borderColor: "#e0e0e0",
      borderWidth: "1px",
    }}
  >
    <Heading mb="2" as="h2" size="2" weight="light">
      Your role
    </Heading>
    <Heading mb="2" as="h1" size="2">
      Customer Support Rep
    </Heading>
    <Text as="p" size="1">
      Customer Support
    </Text>
  </Flex>
);

const CustomerDetails = () => (
  <Flex
    direction="row"
    justify="start"
    style={{
      padding: "0.75em 1em",
      backgroundColor: "#FFFFFF",
      borderRadius: "15px",
      borderColor: "#e0e0e0",
      borderWidth: "1px",
    }}
  >
    <Flex direction="column">
      <Heading mb="2" as="h2" size="2" weight="light">
        Customer
      </Heading>
      <Heading mb="2" as="h1" size="2">
        Patrick Bateman
      </Heading>
      <Text as="p" size="1">
        Mourning customer, recently lost a loved one, looking to remove them
        from their account
      </Text>
    </Flex>
  </Flex>
);

export default function DescriptionView({ changeView }: DescriptionViewProps) {
  const [showFullText, setShowFullText] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleTextVisibility = () => {
    setShowFullText((prevState) => !prevState);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePermissionGranted = () => {
    setIsModalOpen(false);
    changeView("demo");
  };

  return (
    <Box className="appcontainer">
      <BackButton changeView={changeView} />
      <Section size="1">
        <Flex
          direction="row"
          style={{
            padding: "2em",
            backgroundColor: "#f9f9f9",
            borderRadius: "15px",
            borderColor: "#e0e0e0",
            borderWidth: "1px",
            minHeight: "400px",
          }}
        >
          <InstructionDetails />
          <Separator
            orientation="vertical"
            size="4"
            style={{ margin: "0 20px", height: "auto", alignSelf: "stretch" }}
          />
          <ScenarioDetails
            showFullText={showFullText}
            toggleTextVisibility={toggleTextVisibility}
          />
        </Flex>
      </Section>
      <Flex justify="end">
        <Button onClick={handleOpenModal}>Start Conversation</Button>
      </Flex>
      {isModalOpen && (
        <VideoCheckModal
          onClose={handleCloseModal}
          onPermissionGranted={handlePermissionGranted}
        />
      )}
    </Box>
  );
}
