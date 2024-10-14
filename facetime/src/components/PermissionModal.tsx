import { ReactNode, useEffect, useRef } from "react";
import { Mic, MicOff, Video, VideoOff, X } from "lucide-react";
import { useVideoAudioPermissionContext } from "@/contexts";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

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

export const DeviceSelector = ({
  devices,
  selectedDevice,
  onDeviceChange,
  icon,
  placeholderLabel,
}: DeviceSelectorProps) => {
  return (
    <div className="flex items-center w-full">
      <select
        value={selectedDevice}
        onChange={(e) => onDeviceChange(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300"
      >
        <option value="">{placeholderLabel}</option>
        {icon}
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Device ${device.deviceId}`}
          </option>
        ))}
      </select>
    </div>
  );
};

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

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[999]" />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg z-[1000] w-[90vw] max-w-[460px] p-4">
        <button
          className="absolute top-1 right-1 text-gray-900 dark:text-gray-300"
          onClick={onClose}
        >
          <X />
        </button>

        {/* Modal content */}
        <div className="flex flex-col gap-3">
          {/* Video Stream & Controls */}
          <div className="flex flex-col items-center justify-center w-full">
            <div className="relative w-full mt-4 mb-4">
              {mediaStream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="aspect-square object-cover rounded-md w-full"
                />
              ) : (
                <Skeleton className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-md w-full" />
              )}

              {/* Mic/Video Controls */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-4">
                <button
                  className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full"
                  onClick={() => toggleTrack("audio")}
                >
                  {isMicOn ? <Mic /> : <MicOff />}
                </button>
                <button
                  className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full"
                  onClick={() => toggleTrack("video")}
                >
                  {isVideoOn ? <Video /> : <VideoOff />}
                </button>
              </div>
            </div>

            {/* Device Selection */}
            <div className="grid grid-cols-1 gap-4 w-full">
              <DeviceSelector
                devices={cameras}
                selectedDevice={selectedCamera}
                onDeviceChange={setSelectedCamera}
                icon={<Video />}
                placeholderLabel="Camera"
              />
              <DeviceSelector
                devices={microphones}
                selectedDevice={selectedMicrophone}
                onDeviceChange={setSelectedMicrophone}
                icon={<Mic />}
                placeholderLabel="Microphone"
              />
            </div>
          </div>

          {/* Text and Buttons */}
          <div className="flex flex-col justify-center items-center w-full text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Before proceeding, we need to check your camera and microphone.
            </p>
            {errorMessage && (
              <p className="text-red-500 mb-4">{errorMessage}</p>
            )}

            {!permissionsGranted ? (
              <Button
                className="px-6 py-2 font-semibold rounded-lg transition w-full"
                onClick={requestPermissions}
              >
                Authorize
              </Button>
            ) : (
              <Button
                className="px-6 py-2 font-semibold rounded-lg transition w-full"
                onClick={handlePermissionGranted}
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
