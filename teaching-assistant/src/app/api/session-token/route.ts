import { env, errorHandler, logger } from "@/utils";
import { NextResponse } from "next/server";

/**
 * Handles the GET request to fetch a session token from the Anam API.
 */
export async function GET() {
  const apiKey = env.ANAM_API_KEY;

  if (!apiKey) {
    const errorMessage = "API Key not found";
    logger.error(errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }

  logger.info("Fetching session token...");

  try {
    const response = await fetch("https://api.anam.ai/v1/auth/session-token", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        cache: "no-store",
      },
    });

    if (!response.ok) {
      const errorMessage = `Failed to fetch session token. Status: ${response.status}`;
      const responseBody = await response.text();
      logger.error(`${errorMessage}. Response body: ${responseBody}`);

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    const data = await response.json();
    logger.info(`Session token fetched successfully: ${data.sessionToken}`);
    return NextResponse.json({ sessionToken: data.sessionToken });
  } catch (error) {
    logger.error(
      "An error occurred during the session token fetch request:",
      error,
    );
    errorHandler(error, "GET session token request");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
