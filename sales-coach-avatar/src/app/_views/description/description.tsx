import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Section,
  Separator,
} from "@radix-ui/themes";
import { VideoCheckModal } from "@/app/_components";
import { BackButton } from "./BackButton";
import { ScenarioDetails } from "./ScenarioDetails";
import { InstructionDetails } from "./InstructionDetails";

interface DescriptionViewProps {
  changeView: (view: string) => void;
}

export default function DescriptionView({ changeView }: DescriptionViewProps) {
  const [showFullText, setShowFullText] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleTextVisibility = () => {
    setShowFullText((prevState) => !prevState);
  };

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
          <InstructionDetails />
          <Separator
            orientation="vertical"
            size="4"
            style={{ margin: "0 20px", height: "auto", alignSelf: "stretch" }}
          />
          <ScenarioDetails
            showFullText={showFullText}
            toggleTextVisibility={toggleTextVisibility}
          />
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
