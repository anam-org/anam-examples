"use client";

import { useState, useEffect } from "react";
import constate from "constate";
import { errorHandler } from "@/utils";

const useVideoAudioPermission = () => {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>("");
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

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

      if (videoDevices.length > 0 && !selectedCamera)
        setSelectedCamera(videoDevices[0].deviceId);
      if (audioDevices.length > 0 && !selectedMicrophone)
        setSelectedMicrophone(audioDevices[0].deviceId);
    } catch (error) {
      errorHandler(error, "Error enumerating devices");
    }
  };

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

  const toggleTrack = (type: "audio" | "video") => {
    mediaStream?.getTracks().forEach((track) => {
      if (track.kind === type) {
        track.enabled = !track.enabled;
      }
    });
    if (type === "audio") setIsMicOn((prev) => !prev);
    if (type === "video") setIsVideoOn((prev) => !prev);
  };

  useEffect(() => {
    return () => {
      mediaStream?.getTracks().forEach((track) => track.stop());
    };
  }, [mediaStream]);

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
    isVideoOn,
    isMicOn,
    setSelectedCamera,
    setSelectedMicrophone,
    requestPermissions,
    toggleTrack,
  };
};

export const [VideoAudioPermissionProvider, useVideoAudioPermissionContext] =
  constate(useVideoAudioPermission);
