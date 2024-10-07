"use client";

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
import { useViewContext, useSettingsContext, ScenarioType } from "@/contexts";
import { PermissionsModal } from "@/components";

const scenarioDetails: Record<
  ScenarioType,
  {
    scenarioTitle: string;
    instructions: string;
    fullDescription: string;
    briefDescription: string;
    roleTitle: string;
    customerName: string;
    customerDescription: string;
  }
> = {
  product_demo: {
    scenarioTitle: "Product Demo",
    instructions: "Demonstrate the product to a potential customer.",
    fullDescription:
      "In this scenario, you will present the product to a customer, emphasizing key features and addressing any questions they may have. The goal is to highlight the product's value and encourage the customer to proceed to the next stage of the sales process.",
    briefDescription:
      "In this scenario, you will present the product to a customer...",
    roleTitle: "Sales Representative",
    customerName: "Jordan",
    customerDescription:
      "Potential customer interested in learning more about your product.",
  },
  negotiation: {
    scenarioTitle: "Negotiation",
    instructions: "Negotiate pricing and terms with the customer.",
    fullDescription:
      "In this scenario, you will negotiate with the customer, discussing pricing and terms to come to a mutual agreement. It’s important to balance customer satisfaction with maintaining company profitability.",
    briefDescription:
      "In this scenario, you will negotiate with the customer...",
    roleTitle: "Sales Negotiator",
    customerName: "Taylor",
    customerDescription:
      "A customer who is interested but wants a better deal on the price.",
  },
  objection_handling: {
    scenarioTitle: "Objection Handling",
    instructions: "Handle customer objections effectively.",
    fullDescription:
      "In this scenario, you will handle customer objections regarding your product or service. It’s important to listen carefully, address concerns, and offer solutions that can help the customer move forward.",
    briefDescription:
      "In this scenario, you will handle customer objections...",
    roleTitle: "Customer Support Representative",
    customerName: "Alex",
    customerDescription:
      "A customer who has concerns or objections about your product or service.",
  },
  closing_deal: {
    scenarioTitle: "Closing Deal",
    instructions: "Close the deal with the customer.",
    fullDescription:
      "In this scenario, you will finalize the deal with the customer. You need to ensure that the customer is ready to commit and address any final concerns they may have before sealing the agreement.",
    briefDescription:
      "In this scenario, you will finalize the deal with the customer...",
    roleTitle: "Sales Closer",
    customerName: "Jamie",
    customerDescription:
      "A customer who is ready to finalize the deal but may need a final push.",
  },
  follow_up: {
    scenarioTitle: "Follow Up",
    instructions: "Follow up with the customer after the initial engagement.",
    fullDescription:
      "In this scenario, you will follow up with the customer after the initial engagement. The goal is to maintain rapport and address any ongoing needs or concerns the customer may have.",
    briefDescription:
      "In this scenario, you will follow up with the customer...",
    roleTitle: "Customer Success Representative",
    customerName: "Sam",
    customerDescription:
      "A customer who you have previously engaged with and now need to follow up with.",
  },
  customer_support: {
    scenarioTitle: "Customer Support",
    instructions: "Provide post-sale support to the customer.",
    fullDescription:
      "In this scenario, you will provide customer support after the sale. The customer may have questions or issues with the product or service that you need to resolve.",
    briefDescription: "In this scenario, you will provide customer support...",
    roleTitle: "Customer Support Specialist",
    customerName: "Morgan",
    customerDescription:
      "A customer who needs help resolving a problem or question after the sale.",
  },
};

const BackButton = ({ changeView }: { changeView: (view: string) => void }) => (
  <Flex justify="start" align="start" className="pt-6">
    <IconButton variant="ghost" size="4" onClick={() => changeView("initial")}>
      <X className="w-7 h-7" />
    </IconButton>
  </Flex>
);

export function DescriptionView() {
  const { changeView } = useViewContext();
  const { selectedScenario } = useSettingsContext(); // Get selected scenario
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

  const scenario = scenarioDetails[selectedScenario];

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
          className="mx-5 h-auto self-stretch"
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
