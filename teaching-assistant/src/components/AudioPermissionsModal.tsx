"use client";

import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  IconButton,
  Select,
  Text,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { Mic, MicOff, X } from "lucide-react";
import { useAudioPermissionContext } from "@/contexts";
import { useTheme } from "next-themes";

interface AudioPermissionsModalProps {
  onClose: () => void;
  onPermissionGranted: () => void;
}

/**
 * AudioPermissionsModal component handles microphone permission requests, allowing the user to select a microphone
 * and toggle audio on/off before proceeding. Displays an overlay and modal with microphone options.
 *
 * @component
 * @param {AudioPermissionsModalProps} props - The props for the modal, including `onClose` and `onPermissionGranted` callbacks.
 * @returns {JSX.Element} The AudioPermissionsModal component.
 */
export function AudioPermissionsModal({
  onClose,
  onPermissionGranted,
}: AudioPermissionsModalProps) {
  const {
    microphones,
    selectedMicrophone,
    audioPermissionsGranted,
    audioErrorMessage,
    setSelectedMicrophone,
    requestAudioPermissions,
    toggleAudioTrack,
  } = useAudioPermissionContext();

  /**
   * State to track if the microphone is currently on.
   * @type {[boolean, Function]}
   */
  const [isMicOn, setIsMicOn] = useState(true);

  const { theme } = useTheme();

  /**
   * Requests microphone permissions when the component mounts.
   *
   * @useEffect
   */
  useEffect(() => {
    requestAudioPermissions();
  }, [requestAudioPermissions]);

  /**
   * Handles the permission grant action. If permissions are granted, calls `onPermissionGranted`, otherwise alerts the user.
   *
   * @function
   * @returns {void}
   */
  const handlePermissionGranted = () => {
    if (audioPermissionsGranted) {
      onPermissionGranted();
    } else {
      alert("Please grant microphone permission to proceed.");
    }
  };

  /**
   * Toggles the microphone's audio track on or off and updates the mic state.
   *
   * @function
   * @returns {void}
   */
  const handleToggleMic = () => {
    toggleAudioTrack();
    setIsMicOn((prev) => !prev);
  };

  return (
    <>
      {/* Overlay */}
      <Box className="fixed inset-0 bg-black bg-opacity-50 z-[999]" />
      {/* Modal */}
      <Grid className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 bg-opacity-85 dark:bg-opacity-95 border border-gray-300 dark:border-gray-600 rounded-lg z-[1000] p-9 w-[clamp(300px,90vw,600px)] h-[clamp(300px,60vh,400px)] grid-cols-1">
        <IconButton
          variant="ghost"
          className="absolute top-2 right-2"
          onClick={onClose}
        >
          <X />
        </IconButton>
        <Heading
          as="h2"
          size="3"
          className="text-center text-gray-900 dark:text-white"
        >
          Ready to Start?
        </Heading>
        <Text className="text-center text-gray-700 dark:text-gray-300">
          Before proceeding, we need to check your microphone.
        </Text>
        {audioErrorMessage && (
          <Text className="mb-3 text-center text-red-500">
            {audioErrorMessage}
          </Text>
        )}
        <Flex className="justify-center items-center gap-4 p-2">
          <IconButton size="4" radius="full" onClick={handleToggleMic}>
            {isMicOn ? <Mic /> : <MicOff />}
          </IconButton>
        </Flex>
        <Flex className="items-center gap-2 w-full">
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
      </Grid>
    </>
  );
}
