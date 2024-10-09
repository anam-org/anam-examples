import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  IconButton,
  Select,
  Skeleton,
  Text,
} from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff, X } from "lucide-react";
import { useVideoAudioPermissionContext } from "@/contexts";
import { logger } from "@/utils";

interface PermissionsModalProps {
  onClose: () => void;
  onPermissionGranted: () => void;
}

export function PermissionsModal({
  onClose,
  onPermissionGranted,
}: PermissionsModalProps) {
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
    toggleTrack,
  } = useVideoAudioPermissionContext();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const checkMobile = () => {
    const mobileCheck = window.innerWidth <= 760;
    setIsMobile(mobileCheck);
    logger.info(`isMobile set to: ${mobileCheck}`);
  };

  useEffect(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    if (!isMobile) {
      logger.info("Not a mobile device, requesting permissions...");
      requestPermissions();
    }
  }, [isMobile]);

  const handleRequestPermissions = () => {
    requestPermissions();
  };

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

  const handleToggleVideo = () => {
    toggleTrack("video");
    setIsVideoOn((prev) => !prev);
  };

  const handleToggleMic = () => {
    toggleTrack("audio");
    setIsMicOn((prev) => !prev);
  };

  const data = {
    camera: { label: "Camera", icon: <Video /> },
    microphone: { label: "Microphone", icon: <Mic /> },
  };

  return (
    <>
      {/* Overlay */}
      <Box className="fixed inset-0 bg-black bg-opacity-50 z-[999]" />
      {/* Modal */}
      <Grid
        width={{ initial: "90vw", sm: "70vw", md: "80vw", xl: "70vw" }}
        maxWidth="1400px"
        columns={{ sm: "1", md: "2" }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-85 border border-gray-300 rounded-lg z-[1000] p-3"
      >
        {/* Close Button */}
        <IconButton
          variant="ghost"
          className="absolute top-1 right-1"
          onClick={onClose}
        >
          <X />
        </IconButton>

        {/* Left Section */}
        <Flex direction="column" className="gap-3">
          <Box mt="4" className="relative">
            {mediaStream ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="aspect-square object-cover rounded-md w-full h-full"
              />
            ) : (
              <Skeleton className="aspect-square rounded-md w-full h-full" />
            )}
            <Flex className="gap-3 absolute bottom-2 left-1/2 transform -translate-x-1/2 z-[50]">
              <IconButton size="3" radius="full" onClick={handleToggleMic}>
                {isMicOn ? <Mic /> : <MicOff />}
              </IconButton>
              <IconButton size="3" radius="full" onClick={handleToggleVideo}>
                {isVideoOn ? <Video /> : <VideoOff />}
              </IconButton>
            </Flex>
          </Box>
          <Grid columns={{ xs: "1", md: "2" }} className="gap-2 w-full">
            <Flex className="items-center w-full">
              <Select.Root
                value={selectedCamera}
                onValueChange={setSelectedCamera}
                size="3"
              >
                <Select.Trigger className="w-full">
                  <Flex as="span" className="items-center gap-2">
                    {data.camera.icon}
                    {cameras.find(
                      (camera) => camera.deviceId === selectedCamera,
                    )?.label || data.camera.label}
                  </Flex>
                </Select.Trigger>
                <Select.Content>
                  {cameras.map((camera) => (
                    <Select.Item key={camera.deviceId} value={camera.deviceId}>
                      {camera.label || `Camera ${camera.deviceId}`}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Flex>
            <Flex className="items-center gap-2 w-full">
              <Select.Root
                value={selectedMicrophone}
                onValueChange={setSelectedMicrophone}
                size="3"
              >
                <Select.Trigger className="w-full">
                  <Flex className="gap-2">
                    {data.microphone.icon}
                    {microphones.find(
                      (mic) => mic.deviceId === selectedMicrophone,
                    )?.label || data.microphone.label}
                  </Flex>
                </Select.Trigger>
                <Select.Content>
                  {microphones.map((mic) => (
                    <Select.Item key={mic.deviceId} value={mic.deviceId}>
                      {mic.label || `Microphone ${mic.deviceId}`}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Flex>
          </Grid>
        </Flex>

        {/* Right Section */}
        <Flex direction="column" className="justify-center items-center p-3">
          <Heading as="h2" size="3" mb="1">
            Ready to Start?
          </Heading>
          <Text align="center" mb="3">
            Before proceeding, we need to check your camera and microphone.
          </Text>
          {errorMessage && (
            <Text className="mb-3 text-center text-red-500">
              {errorMessage}
            </Text>
          )}

          {/* Conditional rendering for the button */}
          {isMobile && !permissionsGranted ? (
            <Button
              size="4"
              className="w-[90%]"
              onClick={handleRequestPermissions}
            >
              Request Permissions
            </Button>
          ) : (
            <Button
              size="4"
              className="w-[90%]"
              onClick={handlePermissionGranted}
            >
              Start Demo
            </Button>
          )}
        </Flex>
      </Grid>
    </>
  );
}
