'use client';

import { useState, useEffect, useRef, Fragment, useCallback } from 'react';
import { Flex, Skeleton } from '@radix-ui/themes';
import { errorHandler, FetchError } from '@/utils';
import { useAnamContext } from '@/contexts';
import { AnamEvent } from '@anam-ai/js-sdk/dist/module/types';
import { AvatarContainer } from '@/components/AvatarContainer';
import { toast } from 'sonner';

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
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<FetchError | null>(null);

  const isStreamingRef = useRef(false);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startStreaming = useCallback(async () => {
    if (!anamClient) {
      const clientUnavailableError = new FetchError(
        'Client is not available. Please try again later.',
        500
      );
      errorHandler(clientUnavailableError, 'Stream Initialization');
      setError(clientUnavailableError);
      toast.error('Client is not available. Please try again later.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      await anamClient.streamToVideoAndAudioElements('video', 'audio');
      setIsStreaming(true);
      isStreamingRef.current = true;
      onStreamStart();
      retryCountRef.current = 0;
      setIsLoading(false);
    } catch (err) {
      const fetchError = new FetchError(
        (err as Error)?.message || 'Failed to start streaming after multiple attempts',
        500
      );
      retryCountRef.current += 1;

      if (retryCountRef.current < 3) {
        retryTimeoutRef.current = setTimeout(startStreaming, 2000);
      } else {
        errorHandler(fetchError, 'Stream Initialization');
        setError(fetchError);
        toast.error('Failed to start streaming after multiple attempts.');
        setIsLoading(false);
        onStreamEnd();
      }
    }
  }, [anamClient, onStreamStart, onStreamEnd]);

  const onConnectionClosed = useCallback(
    (reason: string) => {
      const connectionClosedError = new FetchError(
        reason || 'Connection closed unexpectedly.',
        500
      );
      errorHandler(connectionClosedError, 'Connection Closed');
      setError(connectionClosedError);
      toast.error('Connection closed unexpectedly.');
      isStreamingRef.current = false;
      setIsStreaming(false);
      setIsLoading(false);
      onStreamEnd();
    },
    [onStreamEnd],
  );

  useEffect(() => {
    if (!anamClient) return;

    if (startStream) {
      startStreaming();
    }

    anamClient.addListener(AnamEvent.CONNECTION_CLOSED, onConnectionClosed);

    return () => {
      anamClient?.removeListener(AnamEvent.CONNECTION_CLOSED, onConnectionClosed);
      if (isStreamingRef.current) anamClient?.stopStreaming();
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, [anamClient, startStream, startStreaming, onConnectionClosed]);

  return (
    <Fragment>
      {isLoading ? (
        <Skeleton
          style={{
            width: '500px',
            height: '500px',
            borderRadius: '8px',
          }}
        />
      ) : isStreaming ? (
        <AvatarContainer size={500} />
      ) : (
        <Flex
          style={{
            width: 500,
            height: 500,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#e0e0e0',
            aspectRatio: '1 / 1',
          }}
        />
      )}
    </Fragment>
  );
}
