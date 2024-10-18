import { useEffect, useRef, useState } from "react";
import { PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useVideoAudioPermissionContext } from "@/contexts";
import { useViewportHeight } from "@/hooks";
import { AvatarContainer } from "@/components/AvatarContainer";

export function VideoCall() {
  useViewportHeight();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const userVideoRef = useRef<HTMLVideoElement | null>(null);

  const {
    mediaStream,
    isMicOn: isUserMicOn,
    isVideoOn: isUserVideoOn,
    toggleTrack,
  } = useVideoAudioPermissionContext();

  useEffect(() => {
    if (mediaStream && userVideoRef.current) {
      userVideoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  useEffect(() => {
    const interval = setInterval(
      () => setSecondsElapsed((prev) => prev + 1),
      1000,
    );
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  return (
    <div
      className="relative w-full bg-gray-100 dark:bg-gray-900"
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
    >
      <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-900">
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-6 h-6 border-4 border-t-4 border-t-transparent border-white rounded-full animate-spin"></div>
              <span>Connecting...</span>
            </div>
          </div>
        )}

        {/* AvatarContainer for video/audio streaming */}
        <AvatarContainer
          videoId="avatar-video"
          audioId="avatar-audio"
          className="w-full h-full object-cover"
          videoClassName="w-full h-full object-cover"
          onStreamingStart={() => setLoading(false)}
        />

        {/* User Video Element */}
        <video
          ref={userVideoRef}
          autoPlay
          muted
          playsInline
          className="absolute top-2 right-2 w-32 h-40 rounded-lg object-cover"
        />
      </div>

      {/* Video Call Controls */}
      <div className="absolute bottom-6 w-full flex justify-center gap-4 z-20">
        {/* Camera Toggle Button */}
        <button
          onClick={() => toggleTrack("video")}
          className="p-4 bg-gray-200 dark:bg-gray-700 rounded-full shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {isUserVideoOn ? (
            <Video className="text-gray-800 dark:text-white w-6 h-6" />
          ) : (
            <VideoOff className="text-gray-800 dark:text-white w-6 h-6" />
          )}
        </button>

        {/* Mic Toggle Button */}
        <button
          onClick={() => toggleTrack("audio")}
          className="p-4 bg-gray-200 dark:bg-gray-700 rounded-full shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {isUserMicOn ? (
            <Mic className="text-gray-800 dark:text-white w-6 h-6" />
          ) : (
            <MicOff className="text-gray-800 dark:text-white w-6 h-6" />
          )}
        </button>

        {/* End Call Button */}
        <button
          onClick={() => navigate("/feedback")}
          className="p-4 bg-red-500 rounded-full shadow-md hover:bg-red-600 transition"
        >
          <PhoneOff className="text-white w-6 h-6" />
        </button>
      </div>

      {/* Elapsed Time */}
      <div className="absolute top-3 w-full flex justify-center text-gray-100 text-lg">
        <span>{formatTime(secondsElapsed)}</span>
      </div>
    </div>
  );
}
