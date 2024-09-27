import { Flex, Grid, Heading } from "@radix-ui/themes";

export function LessonsView() {
  return (
    <Grid
      columns="2fr 1fr"
      rows="1"
      style={{
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Flex className="p-5 pt-8">
        <Heading>Left Section</Heading>
      </Flex>
      <Flex className="border-l border-gray-200 shadow-lg p-5 pt-8">
        <Heading>Right Section</Heading>
      </Flex>
    </Grid>
  );
}
