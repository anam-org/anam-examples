import { Flex, Heading, Text } from "@radix-ui/themes";

export const RoleDetails = () => (
  <Flex
    direction="column"
    justify="start"
    mb="3"
    style={{
      padding: "0.75em 1em",
      backgroundColor: "#FFFFFF",
      borderRadius: "15px",
      borderColor: "#e0e0e0",
      borderWidth: "1px",
    }}
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
);
