"use client";

import { useState } from "react";
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

  /**
   * Requests permissions for accessing the user's camera and microphone. On success,
   * it sets the available video and audio devices, the selected camera and microphone,
   * and the media stream. If permissions are denied, an error message is set.
   *
   * @async
   * @function
   * @throws Will call the error handler on failure.
   */
  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

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

      setPermissionsGranted(true);
      setMediaStream(stream);
    } catch (error) {
      setErrorMessage("Camera and microphone permissions are required.");
      setPermissionsGranted(false);
      errorHandler(error, "Video/Audio Permission Request");
    }
  };

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
  };
};

/**
 * Provider and hook for accessing the video/audio permission state within React context.
 */
export const [VideoAudioPermissionProvider, useVideoAudioPermissionContext] =
  constate(useVideoAudioPermission);
