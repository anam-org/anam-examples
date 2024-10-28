"use client";

import { Box, Button, Flex, IconButton, Select, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { Mic, MicOff, X } from "lucide-react";
import { useAudioPermissionContext } from "@/contexts";

interface AudioPermissionsModalProps {
  onClose: () => void;
  onPermissionGranted: () => void;
}

/**
 * AudioPermissionsModal component handles microphone permission requests, allowing the user to select a microphone
 * and toggle audio on/off before proceeding. Displays an overlay and modal with microphone options.
 */
export function AudioPermissionsModal({
  onClose,
  onPermissionGranted,
}: AudioPermissionsModalProps): JSX.Element {
  const {
    microphones,
    selectedMicrophone,
    audioPermissionsGranted,
    audioErrorMessage,
    setSelectedMicrophone,
    requestAudioPermissions,
    toggleAudioTrack,
  } = useAudioPermissionContext();

  const [isMicOn, setIsMicOn] = useState(true);

  useEffect(() => {
    requestAudioPermissions();
  }, [requestAudioPermissions]);

  const handlePermissionGranted = () => {
    if (audioPermissionsGranted) {
      onPermissionGranted();
    } else {
      alert("Please grant microphone permission to proceed.");
    }
  };

  const handleToggleMic = () => {
    toggleAudioTrack();
    setIsMicOn((prev) => !prev);
  };

  return (
    <>
      {/* Overlay */}
      <Box className="fixed inset-0 bg-black bg-opacity-50 z-[999]" />
      {/* Modal */}
      <Flex
        direction="column"
        align="center"
        justify="center"
        height="clamp(300px,60vh,325px)"
        width="clamp(300px,90vw,475px)"
        p="2"
        className="fixed p-5 top-1/2 left-1/2 z-[1000] transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 bg-opacity-85 dark:bg-opacity-95 border border-gray-300 dark:border-gray-600 rounded-lg"
      >
        <IconButton
          variant="ghost"
          className="absolute top-2 right-2"
          onClick={onClose}
        >
          <X />
        </IconButton>
        <Text className="text-center text-gray-700 dark:text-gray-300">
          To start we need your permission first
        </Text>
        {audioErrorMessage && (
          <Text className="mb-3 text-center text-red-500">
            {audioErrorMessage}
          </Text>
        )}
        <Flex className="justify-center items-center mt-4">
          <IconButton size="4" radius="full" onClick={handleToggleMic}>
            {isMicOn ? <Mic /> : <MicOff />}
          </IconButton>
        </Flex>
        <Flex direction="column" align="center" className="mt-4 w-full">
          <Select.Root
            value={selectedMicrophone}
            onValueChange={setSelectedMicrophone}
            size="3"
          >
            <Select.Trigger className="w-full">
              <Flex as="span" className="items-center gap-2">
                <Mic />
                {microphones.find((mic) => mic.deviceId === selectedMicrophone)
                  ?.label || "Select Microphone"}
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
        <Flex align="center" justify="center">
          <Button
            size="4"
            className="rounded-full mt-4"
            onClick={handlePermissionGranted}
          >
            Start Demo
          </Button>
        </Flex>
      </Flex>
    </>
  );
}
