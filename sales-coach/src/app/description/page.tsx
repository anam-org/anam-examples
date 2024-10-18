"use client";

import { useState } from "react";
import {
  Button,
  Flex,
  Heading,
  IconButton,
  Separator,
  Text,
} from "@radix-ui/themes";
import { ArrowLeft, VolumeOff } from "lucide-react";
import { useSettingsContext } from "@/contexts";
import { PermissionsModal } from "@/components";
import { scenarioTextContent } from "./_scenarioTextContents";
import { useRouter } from "next/navigation";

/**
 * DescriptionView component displays the selected scenario's instructions and descriptions,
 * providing context for the user before starting the conversation. It also manages UI state for
 * showing full or brief descriptions, and handles the opening of the permissions modal before starting the demo.
 *
 * @returns The rendered DescriptionView component.
 */
export default function DescriptionView() {
  const router = useRouter();
  const { selectedScenario } = useSettingsContext();
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
    router.push("/demo");
  };

  const toggleTextVisibility = () => {
    setShowFullText((prevState) => !prevState);
  };

  const scenario = scenarioTextContent[selectedScenario];

  return (
    <Flex className="appcontainer flex-col justify-center px-4 sm:px-8 md:px-10 lg:px-20">
      <Flex justify="start" align="start" className="mb-5 pt-6">
        <IconButton
          variant="ghost"
          size="3"
          onClick={() => router.push("/scenarios")}
        >
          <ArrowLeft className="w-7 h-7" />
        </IconButton>
      </Flex>

      <Flex
        direction="row"
        className="p-4 sm:p-6 md:p-8 lg:p-12 bg-[#f9f9f9] rounded-lg border border-gray-300 min-h-[400px] flex-col md:flex-row"
      >
        {/* Left Panel */}
        <Flex direction="column" className="flex-1 mb-6 md:mb-0">
          <Heading mb="3" as="h2" size="4" weight="light">
            Instructions
          </Heading>
          <Text as="p" mb="2" size="2">
            {scenario.instructions}
          </Text>
          <Text as="p" mb="3" size="2">
            Your performance will be evaluated, and feedback will be provided on
            how you handled the scenario.
          </Text>
          <Flex
            align="center"
            className="p-3 bg-white rounded-lg border border-gray-300"
          >
            <VolumeOff />
            <Text as="p" size="2" className="ml-4">
              Find a quiet space to focus on the conversation.
            </Text>
          </Flex>
        </Flex>

        <Separator
          orientation="vertical"
          size="4"
          className="mx-0 md:mx-5 h-auto self-stretch hidden md:block"
        />

        {/* Right Panel */}
        <Flex direction="column" className="flex-1">
          <Heading mb="2" as="h2" size="4" weight="light">
            The Scenario
          </Heading>
          <Heading mb="2" as="h1" size="4">
            {scenario.scenarioTitle}
          </Heading>
          <Text as="p" mb="3" size="2">
            {showFullText
              ? scenario.fullDescription
              : scenario.briefDescription}
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
              Your Role
            </Heading>
            <Heading mb="2" as="h1" size="2">
              {scenario.roleTitle}
            </Heading>
            <Text as="p" size="1">
              You will be acting as the {scenario.roleTitle} in this scenario.
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
                {scenario.customerName}
              </Heading>
              <Text as="p" size="1">
                {scenario.customerDescription}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <Flex justify="end" className="mt-5 mb-5">
        <Button className="w-full sm:w-auto" onClick={handleOpenModal}>
          Start Conversation
        </Button>
      </Flex>

      {isModalOpen && (
        <PermissionsModal
          onClose={handleCloseModal}
          onPermissionGranted={handlePermissionGranted}
        />
      )}
    </Flex>
  );
}
