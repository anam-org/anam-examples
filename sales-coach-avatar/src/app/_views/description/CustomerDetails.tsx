import { Flex, Heading, Text } from "@radix-ui/themes";

export const CustomerDetails = () => (
    <Flex
      direction="row"
      justify="start"
      style={{
        padding: "0.75em 1em",
        backgroundColor: "#FFFFFF",
        borderRadius: "15px",
        borderColor: "#e0e0e0",
        borderWidth: "1px",
      }}
    >
      <Flex direction="column">
        <Heading mb="2" as="h2" size="2" weight="light">
          Customer
        </Heading>
        <Heading mb="2" as="h1" size="2">
          Patrick Bateman
        </Heading>
        <Text as="p" size="1">
          Mourning customer, recently lost a loved one, looking to remove them
          from their account
        </Text>
      </Flex>
    </Flex>
  );