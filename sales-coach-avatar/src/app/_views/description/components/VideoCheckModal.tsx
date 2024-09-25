import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  IconButton,
  Skeleton,
  Text,
} from "@radix-ui/themes";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { VideoControls } from "./VideoControls";
import { useVideoAudioPermissionContext } from "@/app/_contexts";

interface VideoCheckModalProps {
  onClose: () => void;
  onPermissionGranted: () => void;
}

export function VideoCheckModal({
  onClose,
  onPermissionGranted,
}: VideoCheckModalProps) {
  const {
    cameras,
    microphones,
    selectedCamera,
    selectedMicrophone,
    permissionsGranted,
    errorMessage,
    mediaStream,
    setSelectedCamera,
    setSelectedMicrophone,
    requestPermissions,
  } = useVideoAudioPermissionContext();

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    if (mediaStream && videoRef.current) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  const handlePermissionGranted = () => {
    if (permissionsGranted) {
      onPermissionGranted();
    } else {
      alert("Please grant camera and microphone permissions to proceed.");
    }
  };

  return (
    <>
      {/* Overlay */}
      <Box
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 999,
        }}
      />
      {/* Modal */}
      <Grid
        position="fixed"
        columns="2fr 1fr"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          borderRadius: "10px",
          border: "1px solid #e0e0e0",
          zIndex: 1000,
          padding: "0em 1em",
          width: "clamp(300px, 90vw, 1200px)",
          height: "clamp(300px, 80vh, 700px)",
        }}
      >
        <Flex
          height="100%"
          justify="center"
          align="center"
          direction="column"
          gap="2"
        >
          <Skeleton>
            <video
              ref={videoRef}
              autoPlay
              muted
              style={{
                borderRadius: "10px",
                objectFit: "cover",
                width: "100%",
                height: "80%",
              }}
            />
          </Skeleton>
          <VideoControls
            cameras={cameras}
            microphones={microphones}
            selectedCamera={selectedCamera}
            selectedMicrophone={selectedMicrophone}
            onSelectCamera={setSelectedCamera}
            onSelectMicrophone={setSelectedMicrophone}
          />
        </Flex>
        <Flex
          direction="column"
          justify="center"
          align="center"
          style={{ padding: "1em" }}
        >
          <IconButton
            variant="ghost"
            style={{ position: "absolute", top: "0.5em", right: "0.5em" }}
            onClick={onClose}
          >
            <X />
          </IconButton>
          <Heading as="h2" size="3" mb="1">
            Ready to Start?
          </Heading>
          <Text mb="1" align="center">
            Before proceeding, we need to check your camera and microphone.
          </Text>
          {errorMessage && (
            <Text mb="3" align="center" color="red">
              {errorMessage}
            </Text>
          )}
          <Button
            size="4"
            style={{ borderRadius: "30px" }}
            onClick={handlePermissionGranted}
          >
            Start Demo
          </Button>
        </Flex>
      </Grid>
    </>
  );
}
