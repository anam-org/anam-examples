import { useCallback, useEffect, useRef, useState } from "react";
import { PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAnamContext } from "@/contexts";
import { errorHandler } from "@/utils";
import { AnamEvent } from "@anam-ai/js-sdk/dist/module/types";
import { useVideoAudioPermissionContext } from "@/contexts";
import { useViewportHeight } from "@/hooks";

export function VideoCall() {
  useViewportHeight();
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Connecting...");
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();

  const { anamClient, isClientInitialized } = useAnamContext();
  const {
    mediaStream,
    isMicOn: isUserMicOn,
    isVideoOn: isUserVideoOn,
    toggleTrack,
  } = useVideoAudioPermissionContext();

  const handleToggleMic = () => {
    toggleTrack("audio");
  };

  const handleToggleVideo = () => {
    toggleTrack("video");
  };

  const handleHangUp = async () => {
    try {
      if (anamClient) {
        await anamClient.stopStreaming();
        navigate("/feedback");
      }
    } catch (error) {
      errorHandler(error, "VideoCall Hang Up");
    }
  };

  const onConnectionEstablished = useCallback(() => {
    setLoadingText("Connected to a Persona.");
  }, []);

  const onVideoStartedStreaming = useCallback(() => {
    setLoading(false);
  }, []);

  const onConnectionClosed = useCallback(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    const startStreaming = async () => {
      if (
        isClientInitialized &&
        anamClient &&
        videoRef.current &&
        audioRef.current
      ) {
        try {
          anamClient.addListener(
            AnamEvent.CONNECTION_ESTABLISHED,
            onConnectionEstablished,
          );
          anamClient.addListener(
            AnamEvent.VIDEO_PLAY_STARTED,
            onVideoStartedStreaming,
          );
          anamClient.addListener(
            AnamEvent.CONNECTION_CLOSED,
            onConnectionClosed,
          );
          await anamClient.streamToVideoAndAudioElements(
            videoRef.current.id,
            audioRef.current.id,
          );
        } catch (error) {
          errorHandler(error);
        }
      }
    };

    startStreaming();

    return () => {
      if (anamClient) {
        anamClient.removeListener(
          AnamEvent.CONNECTION_ESTABLISHED,
          onConnectionEstablished,
        );
        anamClient.removeListener(
          AnamEvent.VIDEO_PLAY_STARTED,
          onVideoStartedStreaming,
        );
        anamClient.removeListener(
          AnamEvent.CONNECTION_CLOSED,
          onConnectionClosed,
        );
      }
    };
  }, [
    anamClient,
    isClientInitialized,
    onConnectionEstablished,
    onVideoStartedStreaming,
    onConnectionClosed,
  ]);

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
              <span>{loadingText}</span>
            </div>
          </div>
        )}
        <video
          id="video"
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <audio id="audio" ref={audioRef} autoPlay hidden />

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
          onClick={handleToggleVideo}
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
          onClick={handleToggleMic}
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
          onClick={handleHangUp}
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
