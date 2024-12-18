import useSWR from "swr";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { logger } from "../utils";

interface SessionTokenResponse {
  sessionToken: string;
}

interface DecodedToken {
  exp: number;
}

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

export const useFetchToken = () => {
  const [fetchKey, setFetchKey] = useState<string>(
    `/session-token-${Date.now()}`,
  );

  const fetchSessionToken = async (): Promise<string> => {
    logger.info("Fetching new session token...");
    const response = await fetch("/api/session-token", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch session token");
    }

    const data: SessionTokenResponse = await response.json();
    logger.info("New session token received:", data.sessionToken);
    return data.sessionToken;
  };

  const {
    data: sessionToken,
    error,
    isValidating,
  } = useSWR<string, Error>(fetchKey, fetchSessionToken, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
    dedupingInterval: 0,
    revalidateOnMount: true,
  });

  useEffect(() => {
    if (sessionToken && isTokenExpired(sessionToken)) {
      logger.info("Token expired, refreshing...");
      setFetchKey(`/session-token-${Date.now()}`);
    }
  }, [sessionToken]);

  const refreshToken = () => {
    logger.info("Manually refreshing token...");
    setFetchKey(`/session-token-${Date.now()}`);
  };

  return { sessionToken, error, refreshToken, isValidating };
};
