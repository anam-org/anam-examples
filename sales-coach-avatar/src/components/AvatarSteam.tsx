"use client";

import { useState, useEffect, useRef, Fragment, useCallback } from "react";
import { Spinner } from "@radix-ui/themes";
import { AnamEvent } from "@anam-ai/js-sdk/dist/module/types";
import { AvatarContainer } from "@/components/AvatarContainer";
import { toast } from "sonner";
import { useAnamContext } from "@/app/_contexts";

interface AvatarStreamProps {
  startStream: boolean;
  onStreamStart: () => void;
  onStreamEnd: () => void;
}

export function AvatarStream({
  startStream,
  onStreamStart,
  onStreamEnd,
}: AvatarStreamProps) {
  const { anamClient } = useAnamContext();
  const [isLoading, setIsLoading] = useState(false);
  const isStreamingRef = useRef(false);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startStreaming = useCallback(async () => {
    if (!anamClient) {
      toast.error("Client is not available. Please try again later.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      await anamClient.streamToVideoAndAudioElements("video", "audio");
      isStreamingRef.current = true;
      onStreamStart();
      retryCountRef.current = 0;
      setIsLoading(false);
    } catch (err) {
      retryCountRef.current += 1;
      if (retryCountRef.current < 3) {
        retryTimeoutRef.current = setTimeout(startStreaming, 2000);
      } else {
        toast.error("Failed to start streaming after multiple attempts.");
        setIsLoading(false);
        onStreamEnd();
      }
    }
  }, [anamClient, onStreamStart, onStreamEnd]);

  const onConnectionClosed = useCallback(
    (reason: string) => {
      toast.error(reason || "Connection closed unexpectedly.");
      isStreamingRef.current = false;
      setIsLoading(false);
      onStreamEnd();
    },
    [onStreamEnd],
  );

  useEffect(() => {
    if (!anamClient || !startStream) return;

    startStreaming();
    anamClient.addListener(AnamEvent.CONNECTION_CLOSED, onConnectionClosed);

    return () => {
      anamClient.removeListener(
        AnamEvent.CONNECTION_CLOSED,
        onConnectionClosed,
      );
      if (isStreamingRef.current) anamClient.stopStreaming();
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, [anamClient, startStream, startStreaming, onConnectionClosed]);

  return (
    <Fragment>
      <AvatarContainer size={500} />
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <Spinner />
        </div>
      )}
    </Fragment>
  );
}
