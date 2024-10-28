"use client";

import { useState, useEffect } from "react";
import constate from "constate";
import { errorHandler } from "@/utils";

/**
 * Custom hook for managing audio permissions and microphone devices.
 * This hook handles permission requests for microphone access, enumeration of available audio input devices,
 * and managing the audio stream.
 *
 * - `microphones` {MediaDeviceInfo[]}: List of available microphone devices.
 * - `selectedMicrophone` {string}: The currently selected microphone's device ID.
 * - `audioPermissionsGranted` {boolean}: Indicates if the microphone permissions have been granted.
 * - `audioErrorMessage` {string}: Error message for any issues related to audio permissions.
 * - `audioStream` {MediaStream | null}: The current audio stream if microphone access is granted.
 * - `setSelectedMicrophone` {function}: Function to set the selected microphone device ID.
 * - `requestAudioPermissions` {function}: Function to request microphone permissions from the user.
 * - `toggleAudioTrack` {function}: Function to enable or disable the current audio stream.
 */
const useAudioPermission = () => {
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>("");
  const [audioPermissionsGranted, setAudioPermissionsGranted] = useState(false);
  const [audioErrorMessage, setAudioErrorMessage] = useState<string>("");

  /**
   * Enumerates available audio input devices (microphones).
   * Filters the devices and sets the `microphones` state to the list of audio input devices.
   */
  const enumerateAudioDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = devices.filter(
        (device) => device.kind === "audioinput",
      );
      setMicrophones(audioDevices);

      if (audioDevices.length > 0)
        setSelectedMicrophone(audioDevices[0].deviceId);
    } catch (error) {
      errorHandler(error, "Error enumerating audio devices");
    }
  };

  /**
   * Requests permissions for accessing the user's microphone.
   * Upon successful permission, it sets the audio stream and enumerates the available devices.
   * If the request fails, it sets an error message and disables audio permissions.
   */
  const requestAudioPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      setAudioStream(stream);
      await enumerateAudioDevices();
      setAudioPermissionsGranted(true);
    } catch (error) {
      setAudioErrorMessage("Microphone permissions are required.");
      setAudioPermissionsGranted(false);
      errorHandler(error, "Audio Permission Request");
    }
  };

  /**
   * Toggles the enabled/disabled state of all audio tracks in the current audio stream.
   */
  const toggleAudioTrack = () => {
    audioStream?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
  };

  /**
   * Cleans up the audio stream when the component using this hook is unmounted.
   * Stops all tracks to release media devices.
   */
  useEffect(() => {
    return () => {
      audioStream?.getTracks().forEach((track) => track.stop());
    };
  }, [audioStream]);

  /**
   * Adds an event listener to re-enumerate audio devices when devices change,
   * such as when a new microphone is plugged in.
   */
  useEffect(() => {
    navigator.mediaDevices.addEventListener(
      "devicechange",
      enumerateAudioDevices,
    );
    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        enumerateAudioDevices,
      );
    };
  }, []);

  return {
    microphones,
    selectedMicrophone,
    audioPermissionsGranted,
    audioErrorMessage,
    audioStream,
    setSelectedMicrophone,
    requestAudioPermissions,
    toggleAudioTrack,
  };
};

export const [AudioPermissionProvider, useAudioPermissionContext] =
  constate(useAudioPermission);
