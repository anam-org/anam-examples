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
      <Grid className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-85 border border-gray-300 rounded-lg z-[1000] p-4 w-[clamp(300px,90vw,1200px)] h-[clamp(300px,80vh,700px)] grid-cols-[2fr_1fr]">
        <Flex className="h-full flex-col justify-center items-center gap-4">
          <Box className="relative w-full h-full">
            {mediaStream ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <Skeleton className="w-full h-full" />
            )}
            {/* Updated the positioning and color */}
            <Flex className="justify-center items-center gap-4 p-2 rounded-full absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[50]">
              <IconButton size="3" radius="full" onClick={handleToggleMic}>
                {isMicOn ? <Mic /> : <MicOff />}
              </IconButton>
              <IconButton size="3" radius="full" onClick={handleToggleVideo}>
                {isVideoOn ? <Video /> : <VideoOff />}
              </IconButton>
            </Flex>
          </Box>
          <Grid className="grid grid-cols-2 gap-4 w-full">
            <Flex className="items-center gap-2 w-full">
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
                  <Flex as="span" className="items-center gap-2">
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
        <Flex className="flex-col justify-center items-center p-4 relative">
          <IconButton
            variant="ghost"
            className="absolute top-2 right-2"
            onClick={onClose}
          >
            <X />
          </IconButton>
          <Heading as="h2" size="3" className="mb-2">
            Ready to Start?
          </Heading>
          <Text className="mb-2 text-center">
            Before proceeding, we need to check your camera and microphone.
          </Text>
          {errorMessage && (
            <Text className="mb-3 text-center text-red-500">
              {errorMessage}
            </Text>
          )}
          <Button
            size="4"
            className="rounded-full"
            onClick={handlePermissionGranted}
          >
            Start Demo
          </Button>
        </Flex>
      </Grid>
    </>
  );
}
