import { env, errorHandler, logger } from "@/utils";
import { NextResponse } from "next/server";

/**
 * Handles the GET request to fetch a session token from the Anam API.
 *
 * The API key is retrieved from environment variables and used to authorize the request.
 * The session token is cached for 600 seconds, with a stale-while-revalidate time of 60 seconds.
 *
 * If the API key is missing, or the request fails, appropriate error messages are logged, and
 * error responses are returned to the client.
 */
export async function GET() {
  const apiKey = env.ANAM_API_KEY;

  // Check if the API key is missing
  if (!apiKey) {
    const errorMessage = "API Key not found";
    logger.error(errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }

  try {
    // Make the request to fetch the session token
    const response = await fetch("https://api.anam.ai/v1/auth/session-token", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    // If the response is not OK, log and return the error
    if (!response.ok) {
      const errorMessage = "Failed to fetch session token";
      logger.error(`${errorMessage}. Status code: ${response.status}`);
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    // Parse the response and return the session token
    const data = await response.json();
    const nextResponse = NextResponse.json({ sessionToken: data.sessionToken });

    // Set cache headers
    nextResponse.headers.set(
      "Cache-Control",
      "public, max-age=600, stale-while-revalidate=60",
    );

    logger.info("Session token successfully fetched.");
    return nextResponse;
  } catch (error) {
    // Handle any unexpected errors using errorHandler
    errorHandler(error, "GET session token request");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
