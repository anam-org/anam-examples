import { useVideoAudioPermissionContext } from "@/contexts";
import { useEffect, useRef } from "react";

export const UserVideoContainer = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { mediaStream } = useVideoAudioPermissionContext();

  useEffect(() => {
    if (mediaStream && videoRef.current) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className="absolute w-[110px] h-[110px] md:w-[125px] md:h-[125px] lg:w-[150px] lg:h-[150px] rounded-lg object-cover top-0 right-0"
    />
  );
};
