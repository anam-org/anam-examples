import { Flex, Heading, Text, Strong } from "@radix-ui/themes";
import { VolumeOff } from "lucide-react";

export function LeftPanel() {
  return (
    <Flex direction="column" style={{ flex: 1 }}>
      <Heading mb="3" as="h2" size="4" weight="light">
        Instructions
      </Heading>
      <Text as="p" mb="2" size="2">
        During the simulation you will be conversing with an{" "}
        <Strong>advanced AI system</Strong>, designed to mimic real-life
        customer scenarios.
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
        <VolumeOff />
        <Text as="p" size="2" style={{ marginLeft: "1em" }}>
          Find a quiet space to focus on the conversation
        </Text>
      </Flex>
    </Flex>
  );
}
