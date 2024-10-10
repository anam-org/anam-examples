"use client";

import { useState, useEffect } from "react";
import constate from "constate";
import { errorHandler } from "@/utils";

/**
 * Custom hook for managing video and audio permissions, including access
 * to cameras and microphones, along with selected devices and permission states.
 *
 * @returns {Object} An object containing:
 * - `cameras`: Array of available video input devices (cameras).
 * - `microphones`: Array of available audio input devices (microphones).
 * - `selectedCamera`: ID of the currently selected camera.
 * - `selectedMicrophone`: ID of the currently selected microphone.
 * - `permissionsGranted`: Boolean indicating whether video/audio permissions are granted.
 * - `errorMessage`: Error message string in case of permission errors.
 * - `mediaStream`: The current media stream object from the user's devices.
 * - `isVideoOn`: Boolean indicating whether the video track is enabled.
 * - `isMicOn`: Boolean indicating whether the audio track is enabled.
 * - `setSelectedCamera`: Function to set the selected camera.
 * - `setSelectedMicrophone`: Function to set the selected microphone.
 * - `requestPermissions`: Function to request video/audio permissions from the user.
 * - `toggleTrack`: Function to toggle the video/audio tracks on or off.
 */
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

  /**
   * Enumerates available media devices (video and audio input devices) and updates the state.
   */
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

  /**
   * Requests video and audio permissions from the user and retrieves the media stream.
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
   * Toggles the video or audio track on or off based on the `type` parameter.
   *
   * @param {string} type - The type of track to toggle ("audio" or "video").
   */
  const toggleTrack = (type: "audio" | "video") => {
    mediaStream?.getTracks().forEach((track) => {
      if (track.kind === type) {
        track.enabled = !track.enabled;
      }
    });
    if (type === "audio") setIsMicOn((prev) => !prev);
    if (type === "video") setIsVideoOn((prev) => !prev);
  };

  // Cleanup the media stream when the component is unmounted
  useEffect(() => {
    return () => {
      mediaStream?.getTracks().forEach((track) => track.stop());
    };
  }, [mediaStream]);

  // Re-enumerate devices when there is a change in the connected devices
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
