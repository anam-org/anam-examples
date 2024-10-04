"use client";

import { useState, useEffect } from "react";
import constate from "constate";
import { errorHandler } from "@/utils";

/**
 * Custom hook for managing audio permissions and microphone devices.
 */
const useAudioPermission = () => {
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>("");
  const [audioPermissionsGranted, setAudioPermissionsGranted] = useState(false);
  const [audioErrorMessage, setAudioErrorMessage] = useState<string>("");

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
   * Toggles the enabled/disabled state of audio tracks in the audio stream.
   */
  const toggleAudioTrack = () => {
    audioStream?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
  };

  /**
   * Clean up audio stream resources when the component unmounts.
   */
  useEffect(() => {
    return () => {
      audioStream?.getTracks().forEach((track) => track.stop());
    };
  }, [audioStream]);

  /**
   * Re-enumerate audio devices when devices change (e.g., plugging in a new microphone).
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

/**
 * Provider and hook for accessing the audio permission state within React context.
 */
export const [AudioPermissionProvider, useAudioPermissionContext] =
  constate(useAudioPermission);
