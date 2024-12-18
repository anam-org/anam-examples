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
import { ReactNode, useEffect, useRef } from "react";
import { Mic, MicOff, Video, VideoOff, X } from "lucide-react";
import { useVideoAudioPermissionContext } from "@/contexts";

interface PermissionsModalProps {
  onClose: () => void;
  onPermissionGranted: () => void;
}

interface DeviceSelectorProps {
  devices: Array<{ deviceId: string; label: string | null }>;
  selectedDevice: string;
  onDeviceChange: (deviceId: string) => void;
  icon: ReactNode;
  placeholderLabel: string;
}

/**
 * DeviceSelector component allows the user to select an input device for video or audio.
 *
 * @param {Array} devices - List of available media devices (e.g., cameras or microphones).
 * @param {string} selectedDevice - The currently selected device ID.
 * @param {function} onDeviceChange - Function to handle device selection change.
 * @param {ReactNode} icon - Icon to display next to the device label.
 * @param {string} placeholderLabel - Placeholder text to show when no device is selected.
 *
 * @returns {JSX.Element} The rendered DeviceSelector component.
 */
export const DeviceSelector = ({
  devices,
  selectedDevice,
  onDeviceChange,
  icon,
  placeholderLabel,
}: DeviceSelectorProps) => {
  return (
    <Flex className="items-center w-full">
      <Select.Root
        value={selectedDevice}
        onValueChange={onDeviceChange}
        size="3"
      >
        <Select.Trigger className="w-full">
          <Flex as="span" className="items-center gap-2">
            {icon}
            {devices.find((device) => device.deviceId === selectedDevice)
              ?.label || placeholderLabel}
          </Flex>
        </Select.Trigger>
        <Select.Content>
          {devices.map((device) => (
            <Select.Item key={device.deviceId} value={device.deviceId}>
              {device.label || `Device ${device.deviceId}`}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Flex>
  );
};

/**
 * PermissionsModal component manages video and microphone permissions for the user.
 * It allows users to preview their video feed, toggle audio/video controls, and select devices.
 *
 * @param {function} onClose - Function to close the modal.
 * @param {function} onPermissionGranted - Function to proceed once permissions are granted.
 *
 * @returns {JSX.Element} The rendered PermissionsModal component.
 */
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
    isVideoOn,
    isMicOn,
    setSelectedCamera,
    setSelectedMicrophone,
    requestPermissions,
    toggleTrack,
  } = useVideoAudioPermissionContext();

  const videoRef = useRef<HTMLVideoElement | null>(null);

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
        width={{ initial: "90vw", sm: "60vw", md: "80vw", xl: "70vw" }}
        maxWidth="1024px"
        columns={{ sm: "1", md: "2" }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-85 border border-gray-300 rounded-lg z-[1000] p-3"
      >
        <IconButton
          variant="ghost"
          className="absolute top-1 right-1"
          onClick={onClose}
        >
          <X />
        </IconButton>

        {/* Left Section */}
        <Flex direction="column" className="gap-3">
          {/* Video Stream */}
          <Box mt="4" className="relative">
            {mediaStream ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="aspect-square object-cover rounded-md w-full h-auto"
              />
            ) : (
              <Skeleton className="aspect-square rounded-md w-full h-auto" />
            )}

            {/* Mic/Video Controls */}
            <Flex className="gap-3 absolute bottom-2 left-1/2 transform -translate-x-1/2 z-[50]">
              <IconButton
                size="3"
                radius="full"
                onClick={() => toggleTrack("audio")}
              >
                {isMicOn ? <Mic /> : <MicOff />}
              </IconButton>
              <IconButton
                size="3"
                radius="full"
                onClick={() => toggleTrack("video")}
              >
                {isVideoOn ? <Video /> : <VideoOff />}
              </IconButton>
            </Flex>
          </Box>

          {/* Device Selection */}
          <Grid columns={{ xs: "1", md: "2" }} className="gap-2 w-full">
            {/* Camera Selection */}
            <DeviceSelector
              devices={cameras}
              selectedDevice={selectedCamera}
              onDeviceChange={setSelectedCamera}
              icon={<Video />}
              placeholderLabel="Camera"
            />

            {/* Microphone Selection */}
            <DeviceSelector
              devices={microphones}
              selectedDevice={selectedMicrophone}
              onDeviceChange={setSelectedMicrophone}
              icon={<Mic />}
              placeholderLabel="Microphone"
            />
          </Grid>
        </Flex>

        {/* Right Section */}
        <Flex
          direction="column"
          className="justify-center items-center p-3 w-[80%] mx-auto"
        >
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

          {!permissionsGranted ? (
            <Button size="4" className="w-[90%]" onClick={requestPermissions}>
              Grant Access
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
