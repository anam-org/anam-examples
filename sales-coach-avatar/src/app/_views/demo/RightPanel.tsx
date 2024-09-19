import { Button, Flex, Heading, Section, Text } from "@radix-ui/themes";
import { Instructions } from "./Instructions";
import { ScenarioText } from "./ScenarioText";
import { Phone } from "lucide-react";

export const RightPanel = ({
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
        <Button onClick={() => changeView("initial")}>End Demo</Button>
      </Flex>
    </Flex>
  );
};
