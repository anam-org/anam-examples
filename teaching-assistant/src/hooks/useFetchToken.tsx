"use client";

import useSWR from "swr";
import { jwtDecode } from "jwt-decode";
import { useEffect, useRef, useCallback } from "react";
import { logger } from "@/utils";

interface SessionTokenResponse {
  sessionToken: string;
}

interface DecodedToken {
  exp: number;
  iat: number;
}

const formatTimestamp = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleString();

export const useFetchToken = () => {
  const tokenRefreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSessionToken = async (): Promise<string> => {
    const response = await fetch("/api/session-token", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch session token");
    }

    const data: SessionTokenResponse = await response.json();
    return data.sessionToken;
  };

  const {
    data: sessionToken,
    error,
    mutate,
  } = useSWR<string, Error>("/session-token", fetchSessionToken, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
    dedupingInterval: 60000,
  });

  const refreshToken = useCallback(() => {
    if (sessionToken) {
      try {
        const { exp, iat } = jwtDecode<DecodedToken>(sessionToken);
        const currentTime = Date.now() / 1000;
        const expiresIn = exp - currentTime;

        logger.info(
          `Issued At: ${formatTimestamp(iat)}, Expires At: ${formatTimestamp(exp)}, Expires In: ${expiresIn} seconds`,
        );

        if (expiresIn > 60) {
          tokenRefreshTimeoutRef.current = setTimeout(
            mutate,
            (expiresIn - 60) * 1000,
          );
        } else {
          mutate();
        }
      } catch (error) {
        logger.error("Failed to decode token:", error);
        mutate();
      }
    }
  }, [sessionToken, mutate]);

  useEffect(() => {
    refreshToken();
    return () => {
      if (tokenRefreshTimeoutRef.current) {
        clearTimeout(tokenRefreshTimeoutRef.current);
      }
    };
  }, [sessionToken, refreshToken]);

  return { sessionToken, error, refreshToken };
};
