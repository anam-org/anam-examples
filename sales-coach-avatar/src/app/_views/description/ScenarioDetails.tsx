import { Flex, Heading, Text } from "@radix-ui/themes";
import { RoleDetails } from "./RolesDetails";
import { CustomerDetails } from "./CustomerDetails";

export const ScenarioDetails = ({
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