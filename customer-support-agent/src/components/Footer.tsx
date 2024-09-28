import { Flex, Grid, Separator, Text, Link, Section } from "@radix-ui/themes";

export function Footer() {
  return (
    <Section size="1">
      {/* Main Footer Grid */}
      <Grid
        style={{ padding: "clamp(1em, 2vw, 3em) 0" }}
        columns={{ initial: "1", sm: "3" }}
        gap="2"
        align="center"
        width="auto"
      >
        {/* Left side - Copyright */}
        <Flex justify="start" direction="column">
          <Text weight="light" color="gray">
            © 2024 ANAM LIMITED.
          </Text>
        </Flex>
        {/* Center section with Radix Link and programmatic navigation */}
        <Flex justify="center" align="center" direction="row">
          <Link weight="light" href="/privacy-policy" color="gray">
            Privacy Policy
          </Link>
          <Separator
            orientation="vertical"
            size="1"
            style={{ margin: "0 0.5em" }}
          />
          <Link weight="light" href="/terms-of-service" color="gray">
            Terms of Service
          </Link>
        </Flex>
        {/* Right side - Contact Us */}
        <Flex align="center" justify="end">
          <Link weight="light" href="/contact-us" color="gray">
            Contact
          </Link>
        </Flex>
      </Grid>
    </Section>
  );
}
