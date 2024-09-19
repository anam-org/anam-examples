import { Heading, Text } from "@radix-ui/themes";
import Image from "next/image";

export const Instructions = () => {
  return (
    <>
      <Heading as="h2" size="3" mb="1" weight="medium">
        Key Steps for Support Agent
      </Heading>
      <ul style={{ paddingLeft: "1em" }}>
        <li style={{ display: "flex", marginBottom: "0.5em" }}>
          <Image src="/point.svg" alt="icon" width="15" height="15" />
          <Text as="span" style={{ marginLeft: "0.5em" }}>
            Listen empathetically to Patrick’s request.
          </Text>
        </li>
        <li style={{ display: "flex", marginBottom: "0.5em" }}>
          <Image src="/point.svg" alt="icon" width="15" height="15" />
          <Text as="span" style={{ marginLeft: "0.5em" }}>
            Verify the account details and confirm the identity.
          </Text>
        </li>
        <li style={{ display: "flex", marginBottom: "0.5em" }}>
          <Image src="/point.svg" alt="icon" width="15" height="15" />
          <Text as="span" style={{ marginLeft: "0.5em" }}>
            Ensure the removal happens in the next billing period.
          </Text>
        </li>
        <li style={{ display: "flex", marginBottom: "0.5em" }}>
          <Image src="/point.svg" alt="icon" width="15" height="15" />
          <Text as="span" style={{ marginLeft: "0.5em" }}>
            Check that no services are disrupted or incur unexpected charges.
          </Text>
        </li>
        <li style={{ display: "flex" }}>
          <Image src="/point.svg" alt="icon" width="15" height="15" />
          <Text as="span" style={{ marginLeft: "0.5em" }}>
            Provide a follow-up confirmation to Patrick.
          </Text>
        </li>
      </ul>
    </>
  );
};
