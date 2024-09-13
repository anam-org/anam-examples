"use client";

import { errorHandler, FetchError, logger } from "@/utils";
import useSWR, { Revalidator, SWRConfiguration, SWRResponse } from "swr";

interface SessionTokenResponse {
  sessionToken: string;
}

export const useFetchToken = (): SWRResponse<string, FetchError> => {
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
      setTimeout(() => revalidate({ retryCount }), 2000);
    },
  });
};
