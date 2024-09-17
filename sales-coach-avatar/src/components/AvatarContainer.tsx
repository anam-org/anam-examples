"use client";

import { useRef, useEffect } from "react";
import { Flex } from "@radix-ui/themes";

interface AvatarContainerProps {
  videoSrc?: string;
  audioSrc?: string;
  shape?: "circle" | "square";
  size: number;
}

export const AvatarContainer = ({
  videoSrc,
  audioSrc,
  shape = "square",
  size,
}: AvatarContainerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    const audioElement = audioRef.current;

    if (videoElement && videoSrc) {
      videoElement.src = videoSrc;

      videoElement.addEventListener("canplay", () => {
        videoElement
          .play()
          .catch((err) => console.error("Video play failed:", err));
      });
    }

    if (audioElement && audioSrc) {
      audioElement.src = audioSrc;

      audioElement.addEventListener("canplay", () => {
        audioElement
          .play()
          .catch((err) => console.error("Audio play failed:", err));
      });
    }

    return () => {
      videoElement?.removeEventListener("canplay", () => videoElement.play());
      audioElement?.removeEventListener("canplay", () => audioElement.play());
    };
  }, [videoSrc, audioSrc]);

  return (
    <Flex
      width={`${size}px`}
      height={`${size}px`}
      align="center"
      justify="center"
      position="relative"
      overflow="hidden"
      style={{
        borderRadius: shape === "circle" ? "50%" : "0%",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#f5f5f5",
        aspectRatio: "1/1",
      }}
    >
      <video
        ref={videoRef}
        id="video"
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
          borderRadius: shape === "circle" ? "50%" : "0%",
        }}
        muted
        playsInline
        loop
        controls={false}
      />
      <audio ref={audioRef} id="audio" />
    </Flex>
  );
};
