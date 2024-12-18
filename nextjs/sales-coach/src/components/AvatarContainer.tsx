"use client";

import { useEffect, useRef, forwardRef } from "react";
import { useAnamContext } from "@/contexts";
import { errorHandler } from "@/utils";

interface AvatarContainerProps {
  videoId?: string;
  audioId?: string;
  className?: string;
  videoClassName?: string;
  children?: React.ReactNode;
  audioStream?: MediaStream;
}

/**
 * AvatarContainer component handles the streaming of video and audio.
 * It allows passing in additional elements (e.g., video controls) as children, which will be rendered in the container.
 * It doesn't apply any default styling and remains flexible.
 */
export const AvatarContainer = forwardRef<HTMLDivElement, AvatarContainerProps>(
  (
    {
      videoId = "avatar-video",
      audioId = "avatar-audio",
      className = "",
      videoClassName = "",
      children,
      audioStream,
    }: AvatarContainerProps,
    ref,
  ): JSX.Element => {
    const { isClientInitialized, startStreaming, stopStreaming } =
      useAnamContext();

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
      if (isClientInitialized && videoRef.current && audioRef.current) {
        startStreaming(videoRef.current.id, audioRef.current.id, audioStream) 
          .catch((error) => {
            errorHandler(
              `Error during streaming: ${error}`,
              "AvatarContainer.tsx useEffect",
            );
          });
      }

      return () => {
        stopStreaming();
      };
    }, [isClientInitialized, startStreaming, stopStreaming]);

    return (
      <div ref={ref} className={className}>
        <video
          id={videoId}
          ref={videoRef}
          autoPlay
          playsInline
          className={videoClassName}
        />
        <audio
          id={audioId}
          ref={audioRef}
          autoPlay
          hidden
        />
        {children && <>{children}</>}
      </div>
    );
  },
);
