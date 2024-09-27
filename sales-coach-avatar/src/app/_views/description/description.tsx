import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Separator,
  Text,
  Strong,
} from "@radix-ui/themes";
import { VolumeOff, X } from "lucide-react";
import { useViewContext } from "@/contexts/ViewContext";
import { PermissionsModal } from "@/components";

const BackButton = ({ changeView }: { changeView: (view: string) => void }) => (
  <Flex justify="start" align="start" className="pt-6">
    <IconButton variant="ghost" size="4" onClick={() => changeView("initial")}>
      <X className="w-7 h-7" />
    </IconButton>
  </Flex>
);

export function DescriptionView() {
  const { changeView } = useViewContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

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

  const toggleTextVisibility = () => {
    setShowFullText((prevState) => !prevState);
  };

  return (
    <Box className="appcontainer">
      <BackButton changeView={changeView} />

      <Flex
        direction="row"
        className="p-8 bg-[#f9f9f9] rounded-lg border border-gray-300 min-h-[400px]"
      >
        {/* Left Panel */}
        <Flex direction="column" className="flex-1">
          <Heading mb="3" as="h2" size="4" weight="light">
            Instructions
          </Heading>
          <Text as="p" mb="2" size="2">
            During the simulation you will be conversing with an{" "}
            <Strong>advanced AI system</Strong>, designed to mimic real-life
            customer scenarios.
          </Text>
          <Text as="p" mb="3" size="2">
            Your conversation will be scored and you will get actionable
            feedback on your performance.
          </Text>
          <Flex
            align="center"
            className="p-3 bg-white rounded-lg border border-gray-300"
          >
            <VolumeOff />
            <Text as="p" size="2" className="ml-4">
              Find a quiet space to focus on the conversation
            </Text>
          </Flex>
        </Flex>

        <Separator
          orientation="vertical"
          size="4"
          className="mx-5 h-auto self-stretch"
        />

        {/* Right Panel */}
        <Flex direction="column" className="flex-1">
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
              size="2"
              onClick={toggleTextVisibility}
              className="cursor-pointer transition-colors duration-200"
              onMouseEnter={(e) => (e.currentTarget.style.color = "#b0b0b0")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "gray")}
            >
              {showFullText ? "Show Less" : "Show More"}
            </Text>
          </Text>
          <Flex
            direction="column"
            className="mb-3 p-3 bg-white rounded-lg border border-gray-300"
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
          <Flex
            direction="row"
            className="p-3 bg-white rounded-lg border border-gray-300"
          >
            <Flex direction="column">
              <Heading mb="2" as="h2" size="2" weight="light">
                Customer
              </Heading>
              <Heading mb="2" as="h1" size="2">
                Patrick Bateman
              </Heading>
              <Text as="p" size="1">
                Mourning customer, recently lost a loved one, looking to remove
                them from their account
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <Flex justify="end" className="mt-6">
        <Button onClick={handleOpenModal}>Start Conversation</Button>
      </Flex>

      {isModalOpen && (
        <PermissionsModal
          onClose={handleCloseModal}
          onPermissionGranted={handlePermissionGranted}
        />
      )}
    </Box>
  );
}
