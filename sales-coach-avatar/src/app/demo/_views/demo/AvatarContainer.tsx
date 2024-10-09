import { useAnamContext } from "@/contexts";
import { useToast } from "@/hooks";
import { errorHandler } from "@/utils";
import { AnamEvent } from "@anam-ai/js-sdk/dist/module/types";
import { Flex, Spinner } from "@radix-ui/themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { DemoControls } from "./DemoControls";
import { UserVideoContainer } from "./UserVideoContainer";

export const AvatarContainer = ({
  audioRef,
}: {
  audioRef: React.RefObject<HTMLAudioElement>;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { anamClient, isClientInitialized } = useAnamContext();
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Connecting...");
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const { toast } = useToast();

  const onConnectionEstablished = useCallback(() => {
    setLoadingText("Connected to a Persona.");
    toast({
      title: "Connection Established",
      description: "The video stream is starting now.",
    });
  }, [toast]);

  const onVideoStartedStreaming = useCallback(() => {
    setLoading(false);
    toast({
      title: "Video Started",
      description: "Streaming successfully started.",
    });
  }, [toast]);

  const onConnectionClosed = useCallback(
    (reason: string) => {
      toast({
        title: "Connection Closed",
        description: reason,
      });
      setLoading(false);
    },
    [toast],
  );

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
    const interval = setInterval(
      () => setSecondsElapsed((prev) => prev + 1),
      1000,
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      mt="2"
      className="relative lg:min-w-[735px] aspect-square bg-gray-100 rounded-lg border border-gray-300"
    >
      {loading && (
        <Flex className="absolute">
          <Spinner aria-label="Loading..." size="1" />
          <label className="ml-2 text-sm md:text-base lg:text-lg">
            {loadingText}
          </label>
        </Flex>
      )}
      <video
        id="video"
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover rounded-lg"
      />
      <audio id="audio" ref={audioRef} autoPlay hidden />
      <DemoControls
        secondsElapsed={secondsElapsed}
        audioRef={audioRef}
        setSecondsElapsed={setSecondsElapsed}
      />
      <UserVideoContainer />
    </Flex>
  );
};
