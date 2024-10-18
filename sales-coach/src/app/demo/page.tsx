"use client";

import { Flex } from "@radix-ui/themes";
import { AvatarContainer, DemoDescription } from "@/components";

export default function DemoView() {

  return (
    <Flex
      gap="2"
      className="appcontainer mx-auto flex flex-col md:flex-col lg:flex-row xl:flex-row"
    >
      <AvatarContainer />
      <DemoDescription />
    </Flex>
  );
}
