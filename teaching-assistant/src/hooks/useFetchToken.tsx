"use client";

import useSWR from "swr";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

interface SessionTokenResponse {
  sessionToken: string;
}

interface DecodedToken {
  exp: number;
}

/**
 * Helper function to check if the token is expired.
 */
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

/**
 * Custom hook to fetch and manage the session token using SWR.
 */
export const useFetchToken = () => {
  const fetchSessionToken = async (): Promise<string> => {
    const response = await fetch("/api/session-token", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch session token");
    }

    const data: SessionTokenResponse = await response.json();
    return data.sessionToken;
  };

  const { data: sessionToken, error, mutate, isValidating } = useSWR<string, Error>(
    "/session-token",
    fetchSessionToken,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      dedupingInterval: 60000,
    }
  );

  useEffect(() => {
    if (sessionToken && isTokenExpired(sessionToken)) {
      mutate();
    }
  }, [sessionToken, mutate]);

  return { sessionToken, error, refreshToken: mutate, isValidating };
};
