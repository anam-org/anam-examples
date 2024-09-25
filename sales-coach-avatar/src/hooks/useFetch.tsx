"use client";

import { errorHandler, FetchError, logger } from "@/utils";
import useSWR, { Revalidator, SWRConfiguration, SWRResponse } from "swr";

/**
 * Interface representing the response structure of the session token.
 */
interface SessionTokenResponse {
  sessionToken: string;
}

/**
 * Custom hook to fetch the session token using SWR with error handling and retry logic.
 * including data, error, isLoading, and mutate functionalities.
 */
export const useFetchToken = (): SWRResponse<string, FetchError> => {
  /**
   * Function to fetch the session token from the server.
   */
  const fetchSessionToken = async (): Promise<string> => {
    try {
      const response = await fetch("/api/session-token", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new FetchError("Failed to fetch session token", response.status);
      }

      const data: SessionTokenResponse = await response.json();
      return data.sessionToken;
    } catch (error) {
      errorHandler(error as FetchError, "Fetching Session Token", null);
      throw error;
    }
  };

  return useSWR<string, FetchError>("/session-token", fetchSessionToken, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
    dedupingInterval: 60000,
    /**
     * Retry logic to attempt fetching the session token a maximum of 3 times with a delay of 2 seconds.
     * Logs each retry attempt and stops after the maximum retries.
     */
    onErrorRetry: (
      error: FetchError,
      _key: string,
      _config: SWRConfiguration,
      revalidate: Revalidator,
      { retryCount }: { retryCount: number },
    ) => {
      logger.info(
        `Retrying to fetch session token, attempt: ${retryCount + 1}`,
      );

      if (retryCount >= 3) {
        logger.warn(
          "Maximum retry attempts reached for fetching session token.",
        );
        return;
      }

      errorHandler(error, "Retrying Session Token Fetch");
      setTimeout(() => revalidate({ retryCount }), 2000);
    },
  });
};
