"use client";

import {
  Box,
  Card,
  Text,
  Flex,
  Heading,
  Button,
  IconButton,
} from "@radix-ui/themes";
import { ScenarioType, useSettingsContext } from "@/contexts";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Contains the details for each sales scenario, including title, description, and image URL.
 * These details are used to display each scenario option for the user to select.
 */
const scenarioDetails: Record<
  ScenarioType,
  {
    title: string;
    description: string;
    imageUrl: string;
  }
> = {
  product_demo: {
    title: "Product Demo",
    description:
      "Demonstrate the product to a customer, highlighting features and addressing questions.",
    imageUrl: "leo_gen_1_poster.jpg",
  },
  negotiation: {
    title: "Negotiation",
    description:
      "Discuss pricing and terms with the customer to reach an agreement.",
    imageUrl: "leo_gen_1_poster.jpg",
  },
  objection_handling: {
    title: "Objection Handling",
    description:
      "Address customer concerns and resolve any objections they may have.",
    imageUrl: "leo_gen_1_poster.jpg",
  },
  closing_deal: {
    title: "Closing Deal",
    description:
      "Finalize the sale and secure the customer's commitment to the deal.",
    imageUrl: "leo_gen_1_poster.jpg",
  },
  follow_up: {
    title: "Follow Up",
    description:
      "Re-engage with the customer to gather feedback and build rapport.",
    imageUrl: "leo_gen_1_poster.jpg",
  },
  customer_support: {
    title: "Customer Support",
    description:
      "Provide assistance and support to the customer after the purchase.",
    imageUrl: "leo_gen_1_poster.jpg",
  },
};

/**
 * ScenariosView component renders the available sales scenarios as selectable cards.
 * It allows the user to select a scenario, which updates the selected scenario context.
 * The component also handles navigation and proceeding to the next step of the demo.
 */
export default function ScenariosView() {
  const router = useRouter();

  const handleNavigation = () => {
    router.push("/");
  };
  const { selectedScenario, setSelectedScenario, applyScenarioConfig } =
    useSettingsContext();

  const handleScenarioSelect = (scenario: string) => {
    setSelectedScenario(scenario as keyof typeof scenarioDetails);
  };

  const handleSaveSettings = () => {
    applyScenarioConfig();
    router.push("/description");
  };

  return (
    <Flex className="appcontainer flex-col justify-center min-h-[90vh] px-4 sm:px-8 md:px-12 lg:px-20">
      <Flex justify="start" align="start" className="mb-5 pt-6">
        <IconButton variant="ghost" size="3" onClick={() => handleNavigation()}>
          <X className="w-7 h-7" />
        </IconButton>
      </Flex>

      <Box className="p-4 sm:p-8 w-full mx-auto bg-white shadow-lg rounded-lg">
        <Heading
          size="8"
          className="mb-5 text-center text-gray-900 text-2xl md:text-3xl lg:text-4xl"
        >
          Scenarios
        </Heading>

        {/* Grid of Scenario Cards */}
        <Box className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(scenarioDetails).map(([key, scenario]) => (
            <Card
              key={key}
              className={` cursor-pointer p-4 w-full h-auto sm:w-full md:min-w-[200px] lg:min-w-[250px] shadow-md transition transform hover:scale-105 ${
                selectedScenario === key ? "ring-4 ring-[#86EAD4]" : ""
              }`}
              onClick={() => handleScenarioSelect(key)}
            >
              <Flex gap="3" align="center">
                <img
                  src={scenario.imageUrl}
                  alt={scenario.title}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                />
                <Box>
                  <Text
                    size="1"
                    weight="bold"
                    className="text-gray-800 text-sm"
                  >
                    {scenario.title}
                  </Text>
                  <Text
                    as="div"
                    size="2"
                    color="gray"
                    className="text-gray-600 text-xs md:text-sm"
                  >
                    {scenario.description}
                  </Text>
                </Box>
              </Flex>
            </Card>
          ))}
        </Box>

        <Flex justify="end" className="mt-6">
          <Button className="w-full sm:w-auto" onClick={handleSaveSettings}>
            Continue
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}
