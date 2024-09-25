import { Box, Flex, Heading } from "@radix-ui/themes";

export default function HomePage() {
  return (
    <Box className="appcontainer">
      <Flex justify="start" align="start" style={{ paddingTop: "1.5em" }}>
        <Heading>ANAM.AI</Heading>
      </Flex>
    </Box>
  )
}
