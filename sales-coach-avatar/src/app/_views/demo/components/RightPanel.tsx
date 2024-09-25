import { useAnamContext } from "@/app/_contexts";
import { Button, Flex, Heading, Section, Text } from "@radix-ui/themes";
import { Dot, Phone } from "lucide-react";

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
  const instructions = [
    "Listen empathetically to Patrick’s request.",
    "Verify the account details and confirm the identity.",
    "Ensure the removal happens in the next billing period.",
    "Check that no services are disrupted or incur unexpected charges.",
    "Provide a follow-up confirmation to Patrick.",
  ];

  return (
    <>
      <Heading as="h2" size="3" mb="3" weight="medium">
        Key Steps for Support Agent
      </Heading>
      <ul>
        {instructions.map((instruction, index) => (
          <li key={index}>
            <Flex align="center" mb="1">
              <Dot size="30" />
              <Text as="span" style={{ marginLeft: "0.5em" }}>
                {instruction}
              </Text>
            </Flex>
          </li>
        ))}
      </ul>
    </>
  );
};

export const RightPanel = ({
  showFullText,
  toggleTextVisibility,
  changeView,
}: {
  showFullText: boolean;
  toggleTextVisibility: () => void;
  changeView: (view: string) => void;
}) => {
  const { anamClient } = useAnamContext();

  const handleEndDemo = () => {
    if (anamClient && anamClient.isStreaming()) {
      anamClient.stopStreaming();
    }
    changeView("initial");
  };

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
          <Phone size="18" />
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
        <Button onClick={handleEndDemo}>End Demo</Button>
      </Flex>
    </Flex>
  );
};
