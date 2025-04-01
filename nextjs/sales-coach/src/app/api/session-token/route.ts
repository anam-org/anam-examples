import { env, errorHandler, logger } from "@/utils";
import { NextResponse } from "next/server";
import personas from "@/utils/personas";

/**
 * Handles the GET request to fetch a session token from the Anam API.
 *
 * The API key is retrieved from environment variables and used to authorize the request.
 * A persona name is expected as a URL parameter, which is used to fetch the corresponding
 * persona configuration and include it in the POST request body.
 * The session token is cached for 600 seconds, with a stale-while-revalidate time of 60 seconds.
 *
 * If the API key is missing, the persona name is invalid, or the request fails, appropriate
 * error messages are logged, and error responses are returned to the client.
 *
 * @async
 * @function GET
 * @param {Request} request - The incoming request object containing URL parameters
 * @returns {Promise<NextResponse>} - Returns a JSON response containing the session token or an error message.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const apiKey = env.ANAM_API_KEY;

  // Check if the API key is missing
  if (!apiKey) {
    const errorMessage = "API Key not found";
    errorHandler(errorMessage, "GET session token request");
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }

  // Extract persona name from URL parameters
  const url = new URL(request.url);
  const personaName = url.searchParams.get("persona");

  if (!personaName) {
    const errorMessage = "Persona name parameter is required";
    errorHandler(errorMessage, "GET session token request");
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }

  // Look up the persona configuration
  const persona = personas[personaName.toUpperCase()];

  if (!persona) {
    const errorMessage = `Invalid persona name: ${personaName}`;
    errorHandler(errorMessage, "GET session token request");
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }

  try {
    // Make the request to fetch the session token, now as a POST with persona config
    const response = await fetch("https://api.anam.ai/v1/auth/session-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ personaConfig: persona }),
    });

    // If the response is not OK, log and return the error
    if (!response.ok) {
      const errorMessage = "Failed to fetch session token";
      errorHandler(
        `${errorMessage}. Status code: ${response.status}`,
        "GET session token request",
      );
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

    logger.info(
      `Session token successfully fetched for persona: ${personaName}`,
    );
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
