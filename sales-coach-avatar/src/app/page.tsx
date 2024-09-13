import { DemoButton } from "@/components/DemoButton";
import { Flex, Grid, Heading } from "@radix-ui/themes";

export default function HomePage() {
  return (
    <Flex align="center" justify="center" height="100vh">
      <Grid columns="2" rows="1" gap="5">
        <Flex justify="center" align="center">
          <Heading as="h1" weight="light" size="9">
            Experience the future
          </Heading>
        </Flex>
        <Flex align="center" justify="center" direction="row" gap="2">
          <DemoButton />
        </Flex>
      </Grid>
    </Flex>
  );
}
