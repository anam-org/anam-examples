import { useAnamContext } from "@/contexts";
import { errorHandler } from "@/utils";
import { AnamEvent } from "@anam-ai/js-sdk/dist/module/types";
import { Flex, Spinner } from "@radix-ui/themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { DemoControls } from "./DemoControls";
import { UserVideoContainer } from "./UserVideoContainer";

/**
 * AvatarContainer component handles the streaming of video and audio for the Avatar
 * using the Anam SDK. It listens to Anam client events for connection status and manages
 * the UI state based on the connection lifecycle (loading, connected, or disconnected).
 *
 * @param props - The props for the AvatarContainer component.
 * @param props.audioRef - Reference to the audio element used for streaming.
 *
 * @returns The rendered AvatarContainer component.
 */
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
    // Initializes video and audio streaming using the Anam client.
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
    // Updates the elapsed seconds every second.
    const interval = setInterval(
      () => setSecondsElapsed((prev) => prev + 1),
      1000,
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <Flex
      align="center"
      justify="center"
      mt="2"
      className="relative sm:min-w-[80vw] md:min-w-[500px] lg:min-h-[90vh] xl:min-h-[98vh] 2xl:min-h-[98vh] aspect-square bg-gray-100 rounded-lg border border-gray-300"
    >
      {loading && (
        <Flex className="absolute" align="center" justify="center">
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
        className="w-auto h-full object-cover rounded-lg"
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