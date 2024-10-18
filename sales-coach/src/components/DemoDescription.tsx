import { ScenarioType, useAnamContext, useSettingsContext } from "@/contexts";
import { useViewportHeight } from "@/hooks";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import { Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

/**
 * Contains descriptions and instructions for different sales scenarios.
 * This is used to provide context and guidance for the user during the demo.
 */
const DemoText: Record<
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
      "In this scenario, you are a Sales Representative working for a major Telecommunications company. The customer, Jordan, is an existing subscriber interested in learning more about a new product offering. Your goal is to effectively demonstrate the product's key features, address any questions Jordan may have, and encourage them to proceed to the next stage of the sales process.",
    briefDescription:
      "In this scenario, you are a Sales Representative working for a major Telecommunications company. The customer, Jordan, is an existing subscriber interested in learning more about a new product offering...",
    instructions: [
      "Understand Jordan's needs and tailor the demo to their interests.",
      "Demonstrate the key features of the product.",
      "Address any concerns or questions Jordan has.",
      "Encourage Jordan to proceed to the next steps.",
    ],
  },
  negotiation: {
    title: "Negotiation",
    fullDescription:
      "In this scenario, you are a Sales Agent who must negotiate the pricing and terms of a deal with Taylor, a customer interested in purchasing a product but concerned about the pricing. You need to balance securing the sale with maintaining the company's profitability by finding a mutually beneficial agreement.",
    briefDescription:
      "In this scenario, you are a Sales Agent who must negotiate the pricing and terms of a deal with Taylor, a customer interested in purchasing a product but concerned about the pricing...",
    instructions: [
      "Understand Taylor's concerns about pricing.",
      "Highlight the value of the product to justify the cost.",
      "Offer potential incentives or adjustments to meet Taylor's budget.",
      "Ensure the final agreement benefits both Taylor and the company.",
    ],
  },
  objection_handling: {
    title: "Objection Handling",
    fullDescription:
      "In this scenario, you are a Customer Support Specialist facing Alex, who has objections about the product's suitability for their needs. You must listen carefully, acknowledge Alex's concerns, and provide solutions or alternatives to overcome the objections, helping to move the sale forward.",
    briefDescription:
      "In this scenario, you are a Customer Support Specialist facing Alex, who has objections about the product's suitability for their needs...",
    instructions: [
      "Listen carefully to Alex's concerns.",
      "Acknowledge the objections and validate Alex's feelings.",
      "Provide solutions or alternatives that address the objections.",
      "Guide the conversation towards closing the sale after resolving concerns.",
    ],
  },
  closing_deal: {
    title: "Closing Deal",
    fullDescription:
      "In this scenario, you are a Sales Closer at the final stage of the sales process with Jamie. Jamie is ready to commit but may need reassurance or a final push. Your task is to address any last-minute concerns and secure Jamie's commitment to the purchase.",
    briefDescription:
      "In this scenario, you are a Sales Closer at the final stage of the sales process with Jamie. Jamie is ready to commit but may need reassurance or a final push...",
    instructions: [
      "Address any final concerns or hesitations Jamie may have.",
      "Reinforce the value and benefits of the product.",
      "Guide Jamie towards making the final commitment.",
      "Confirm the details of the deal and finalize the agreement.",
    ],
  },
  follow_up: {
    title: "Follow Up",
    fullDescription:
      "In this scenario, you are a Customer Success Representative following up with Sam after a previous interaction. Your goal is to check in on Sam's experience with the product, gather feedback, and offer additional assistance or upsell opportunities to strengthen the relationship and encourage future engagement.",
    briefDescription:
      "In this scenario, you are a Customer Success Representative following up with Sam after a previous interaction. Your goal is to check in on Sam's experience with the product, gather feedback...",
    instructions: [
      "Check in on Sam's satisfaction with the product or service.",
      "Ask for feedback and address any lingering concerns.",
      "Offer additional assistance or suggest complementary products.",
      "Strengthen the customer relationship and encourage future engagement.",
    ],
  },
  customer_support: {
    title: "Customer Support",
    fullDescription:
      "In this scenario, you are a Customer Support Specialist assisting Morgan, who is experiencing issues with a recently purchased service. You must troubleshoot the issue, offer solutions, and ensure Morgan is satisfied with the resolution.",
    briefDescription:
      "In this scenario, you are a Customer Support Specialist assisting Morgan, who is experiencing issues with a recently purchased service...",
    instructions: [
      "Listen to Morgan's issue and gather relevant information.",
      "Troubleshoot the problem and provide clear solutions.",
      "Guide Morgan through any necessary steps to resolve the issue.",
      "Ensure Morgan is satisfied with the resolution and offer follow-up support.",
    ],
  },
};

/**
 * DemoDescription component renders the selected scenario's details, including a
 * brief/full description and a list of key instructions for the user to follow during the demo.
 */
export const DemoDescription = () => {
  useViewportHeight();
  const { anamClient } = useAnamContext();
  const { selectedScenario } = useSettingsContext();
  const scenario = DemoText[selectedScenario];
  const router = useRouter();
  const [showFullText, setShowFullText] = useState(false);

  const toggleTextVisibility = () => setShowFullText(!showFullText);

  const stopStreaming = useCallback((): void => {
    if (anamClient) {
      anamClient.stopStreaming().catch((error: Error) => {
        console.error("Failed to stop streaming:", error);
      });
    }
    router.push("/");
  }, [anamClient, router]);

  return (
    <Flex
      direction="column"
      p="4"
      mt="2"
      gap="3"
      className="border-t border-gray-300 md:border-l md:border-r md:border-t-0"
    >
      <Flex mb="3">
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
      <Heading as="h2" size="3" weight="medium" className="mb-0">
        Key Steps for Support Agent
      </Heading>
      <ul className="list-decimal list-inside">
        {scenario.instructions.map((instruction, index) => (
          <li key={index} className="mb-1">
            <Text size="2" >
              {instruction}
            </Text>
          </li>
        ))}
      </ul>
      <Flex justify="end">
        <Button
          mt="3"
          mb="3"
          size="4"
          className="w-full sm:w-auto"
          onClick={() => stopStreaming()}
        >
          End Demo
        </Button>
      </Flex>
    </Flex>
  );
};
