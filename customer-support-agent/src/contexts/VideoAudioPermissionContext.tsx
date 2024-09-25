"use client";

import { useState } from "react";
import constate from "constate";

const useVideoAudioPermission = () => {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>("");
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

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

export const [VideoAudioPermissionProvider, useVideoAudioPermissionContext] =
  constate(useVideoAudioPermission);
