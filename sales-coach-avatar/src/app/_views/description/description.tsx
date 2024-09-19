import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Section,
  Separator,
} from "@radix-ui/themes";
import { VideoCheckModal } from "@/app/_components";
import { LeftPanel } from "./LeftPanel";
import { X } from "lucide-react";
import { RightPanel } from "./RightPanel";

interface DescriptionViewProps {
  changeView: (view: string) => void;
}

const BackButton = ({ changeView }: { changeView: (view: string) => void }) => (
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

export default function DescriptionView({ changeView }: DescriptionViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePermissionGranted = () => {
    setIsModalOpen(false);
    changeView("demo");
  };

  return (
    <Box className="appcontainer">
      <BackButton changeView={changeView} />

      <Section size="1">
        <Flex
          direction="row"
          style={{
            padding: "2em",
            backgroundColor: "#f9f9f9",
            borderRadius: "15px",
            borderColor: "#e0e0e0",
            borderWidth: "1px",
            minHeight: "400px",
          }}
        >
          <LeftPanel />
          <Separator
            orientation="vertical"
            size="4"
            style={{ margin: "0 20px", height: "auto", alignSelf: "stretch" }}
          />
          <RightPanel />
        </Flex>
      </Section>
      <Flex justify="end">
        <Button onClick={handleOpenModal}>Start Conversation</Button>
      </Flex>
      {isModalOpen && (
        <VideoCheckModal
          onClose={handleCloseModal}
          onPermissionGranted={handlePermissionGranted}
        />
      )}
    </Box>
  );
}
