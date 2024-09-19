import { Heading, Text, Flex } from "@radix-ui/themes";
import { Dot } from "lucide-react";

export const Instructions = () => {
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
