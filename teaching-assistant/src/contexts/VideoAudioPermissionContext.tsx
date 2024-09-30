"use client";

import { useState, useEffect } from "react";
import constate from "constate";
import { errorHandler } from "@/utils";

/**
 * Custom hook for managing video and audio permissions, including access
 * to cameras and microphones, along with selected devices and permission states.
 */
const useVideoAudioPermission = () => {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>("");
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Helper function to enumerate devices
  const enumerateDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput",
      );
      const audioDevices = devices.filter(
        (device) => device.kind === "audioinput",
      );
      setCameras(videoDevices);
      setMicrophones(audioDevices);

      if (videoDevices.length > 0) setSelectedCamera(videoDevices[0].deviceId);
      if (audioDevices.length > 0)
        setSelectedMicrophone(audioDevices[0].deviceId);
    } catch (error) {
      errorHandler(error, "Error enumerating devices");
    }
  };

  /**
   * Requests permissions for accessing the user's camera and microphone. On success,
   * it sets the available video and audio devices, the selected camera and microphone,
   * and the media stream. If permissions are denied, an error message is set.
   */
  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      setMediaStream(stream);
      await enumerateDevices();
      setPermissionsGranted(true);
    } catch (error) {
      setErrorMessage("Camera and microphone permissions are required.");
      setPermissionsGranted(false);
      errorHandler(error, "Video/Audio Permission Request");
    }
  };

  /**
   * Toggles the enabled/disabled state of video or audio tracks in the media stream.
   */
  const toggleTrack = (type: "audio" | "video") => {
    mediaStream?.getTracks().forEach((track) => {
      if (track.kind === type) {
        track.enabled = !track.enabled;
      }
    });
  };

  /**
   * Clean up media stream resources when the component unmounts.
   */
  useEffect(() => {
    return () => {
      mediaStream?.getTracks().forEach((track) => track.stop());
    };
  }, [mediaStream]);

  /**
   * Re-enumerate devices when devices change (e.g., plugging in a new mic).
   */
  useEffect(() => {
    navigator.mediaDevices.addEventListener("devicechange", enumerateDevices);
    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        enumerateDevices,
      );
    };
  }, []);

  return {
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
  };
};

/**
 * Provider and hook for accessing the video/audio permission state within React context.
 */
export const [VideoAudioPermissionProvider, useVideoAudioPermissionContext] =
  constate(useVideoAudioPermission);
