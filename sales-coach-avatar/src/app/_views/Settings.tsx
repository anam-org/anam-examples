"use client";

import { Box, Card, Text, Flex, Heading, Button } from "@radix-ui/themes";
import { useSettingsContext, useViewContext } from "@/contexts";

const scenarioDetails = {
  product_demo: {
    title: "Product Demo",
    description:
      "Presenting the product to the customer and highlighting key features.",
    imageUrl: "leo_gen_1_poster.jpg",
  },
  negotiation: {
    title: "Negotiation",
    description:
      "Discussing pricing and terms with the customer to reach an agreement.",
    imageUrl: "leo_gen_1_poster.jpg",
  },
  objection_handling: {
    title: "Objection Handling",
    description:
      "Addressing customer concerns and resolving any objections they may have.",
    imageUrl: "leo_gen_1_poster.jpg",
  },
  closing_deal: {
    title: "Closing Deal",
    description:
      "Finalizing the sale and securing the customer's commitment to the deal.",
    imageUrl: "leo_gen_1_poster.jpg",
  },
  follow_up: {
    title: "Follow Up",
    description:
      "Re-engaging with the customer to gather feedback and build rapport.",
    imageUrl: "leo_gen_1_poster.jpg",
  },
  customer_support: {
    title: "Customer Support",
    description:
      "Providing assistance and support to the customer after the purchase.",
    imageUrl: "leo_gen_1_poster.jpg",
  },
};

export function SettingsView() {
  const { selectedScenario, setSelectedScenario, applyScenarioConfig } =
    useSettingsContext();
  const { changeView } = useViewContext();

  const handleScenarioSelect = (scenario: string) => {
    setSelectedScenario(scenario as keyof typeof scenarioDetails);
  };

  const handleSaveSettings = () => {
    applyScenarioConfig();
    changeView("description");
  };

  return (
    <Box className="flex items-center justify-center h-screen">
      <Box className="p-8 max-w-5xl w-full mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <Heading
          size="8"
          className="mb-6 text-center text-gray-900 dark:text-white"
        >
          Scenarios
        </Heading>

        {/* Grid of Scenario Cards */}
        <Box className="grid grid-cols-3 gap-6">
          {Object.entries(scenarioDetails).map(([key, scenario]) => (
            <Card
              key={key}
              className={`cursor-pointer p-4 bg-white dark:bg-gray-700 shadow-lg transition transform hover:scale-105 ${
                selectedScenario === key ? "ring-4 ring-[#86EAD4]" : ""
              }`}
              onClick={() => handleScenarioSelect(key)}
            >
              <Flex gap="3" align="center">
                <img
                  src={scenario.imageUrl}
                  alt={scenario.title}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <Box>
                  <Text
                    as="div"
                    size="2"
                    weight="bold"
                    className="text-gray-800 dark:text-gray-200"
                  >
                    {scenario.title}
                  </Text>
                  <Text
                    as="div"
                    size="2"
                    color="gray"
                    className="text-gray-600 dark:text-gray-400"
                  >
                    {scenario.description}
                  </Text>
                </Box>
              </Flex>
            </Card>
          ))}
        </Box>

        <Flex justify="end" className="mt-6">
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </Flex>
      </Box>
    </Box>
  );
}
