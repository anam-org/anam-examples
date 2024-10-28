import { env, errorHandler, logger } from "@/utils";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Handles the GET request to fetch a session token from the Anam API.
 */
export async function GET() {
  const apiKey = env.ANAM_API_KEY;

  if (!apiKey) {
    const errorMessage = "API Key not found";
    errorHandler(errorMessage, "GET session token request");
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
      cache: "no-store",
    });

    if (!response.ok) {
      const errorMessage = `Failed to fetch session token. Status: ${response.status}`;
      const responseBody = await response.text();
      errorHandler(
        `${errorMessage}. Response: ${responseBody}`,
        "GET session token request",
      );
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    const { sessionToken } = await response.json();
    logger.info(`Session token fetched successfully: ${sessionToken}`);
    return NextResponse.json({ sessionToken });
  } catch (error) {
    errorHandler(`An error occurred: ${error}`, "GET session token request");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
