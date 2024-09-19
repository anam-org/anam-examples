import { Flex, IconButton } from "@radix-ui/themes";
import { X } from "lucide-react";

export const BackButton = ({
  changeView,
}: {
  changeView: (view: string) => void;
}) => (
  <Flex justify="start" align="start" style={{ paddingTop: "1.5em" }}>
    <IconButton
      variant="ghost"
      color="gray"
      size="4"
      onClick={() => changeView("initial")}
    >
      <X width="30" height="30" />
    </IconButton>
  </Flex>
);
