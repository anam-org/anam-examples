import { useAnamContext, useVideoAudioPermissionContext } from "@/contexts";
import { Flex, IconButton, Separator, Slider } from "@radix-ui/themes";
import { Dispatch, RefObject, SetStateAction, useState } from "react";
import { GhostIconButton } from "./GhostButton";
import {
  RotateCcw,
  Video,
  VideoOff,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Timer } from "./_components/Timer";

export const DemoControls = ({
  secondsElapsed,
  setSecondsElapsed,
  audioRef,
}: {
  secondsElapsed: number;
  setSecondsElapsed: Dispatch<SetStateAction<number>>;
  audioRef: RefObject<HTMLAudioElement>;
}) => {
  const { toggleTrack, isVideoOn } = useVideoAudioPermissionContext();
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [previousVolume, setPreviousVolume] = useState(100);
  const { anamClient, isClientInitialized } = useAnamContext();

  const handleToggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.muted = false;
        audioRef.current.volume = previousVolume / 100;
        setVolume(previousVolume);
        setIsMuted(false);
      } else {
        setPreviousVolume(volume);
        audioRef.current.muted = true;
        audioRef.current.volume = 0;
        setVolume(0);
        setIsMuted(true);
      }
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const volumeValue = value[0];
    setVolume(volumeValue);
    if (audioRef.current) {
      audioRef.current.volume = volumeValue / 100;
      audioRef.current.muted = volumeValue === 0;
    }
    setIsMuted(volumeValue === 0);
    if (volumeValue > 0) {
      setPreviousVolume(volumeValue);
    }
  };

  const handleRestart = async () => {
    if (anamClient && isClientInitialized) {
      try {
        if (anamClient.isStreaming()) {
          await anamClient.stopStreaming();
        }

        await new Promise((resolve) => setTimeout(resolve, 500));

        await anamClient.streamToVideoAndAudioElements("video", "audio");

        setSecondsElapsed(0);
      } catch (error) {
        console.error("Error restarting the stream: ", error);
      }
    }
  };

  return (
    <Flex
      justify="center"
      align="center"
      gap="2"
      className="p-[0.75em_2em] rounded-[25px] bg-gray-700 absolute bottom-[1em]"
    >
      <Flex align="center">
        <GhostIconButton onClick={handleToggleMute}>
          {isMuted || volume === 0 ? (
            <VolumeX size="18" />
          ) : volume > 50 ? (
            <Volume2 size="18" />
          ) : (
            <Volume1 size="18" />
          )}
        </GhostIconButton>
        <Slider
          value={[volume]}
          max={100}
          step={1}
          onValueChange={handleVolumeChange}
          className="w-[70px] mx-2"
        />
      </Flex>
      <IconButton
        size="1"
        variant="ghost"
        className="text-gray-200"
        onClick={() => toggleTrack("video")}
      >
        {isVideoOn ? <Video size="18" /> : <VideoOff size="18" />}
      </IconButton>
      <Separator orientation="vertical" />
      <Timer secondsElapsed={secondsElapsed} />
      <GhostIconButton onClick={handleRestart}>
        <RotateCcw size="18" />
      </GhostIconButton>
    </Flex>
  );
};
