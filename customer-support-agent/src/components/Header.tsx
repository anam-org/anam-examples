import { Flex, Grid, Button, Container, Avatar, Heading, Section } from "@radix-ui/themes";
import Link from "next/link";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export function Header() {
  return (
    <Section size="1">
      <Grid columns="3" rows="1" width="auto">
        {/* Logo linked to Home */}
        <Container>
          <Link href="/" style={{ display: "inline-block" }}>
            <Heading size="7" style={{ cursor: "pointer" }}>
              ANAM
            </Heading>
          </Link>
        </Container>
        {/* Navigation Links */}
        <Flex gap="9" align="center" justify="center">
          {navLinks.map((link) => (
            <Button
              size="3"
              key={link.label}
              variant="ghost"
              color="gray"
              highContrast
            >
              <Link href={link.href} passHref>
                {link.label}
              </Link>
            </Button>
          ))}
        </Flex>
        {/* Theme Toggle */}
        <Flex align="center" justify="end" gap="3">
          <Avatar fallback={""} />
        </Flex>
      </Grid>
    </Section>
  );
}
