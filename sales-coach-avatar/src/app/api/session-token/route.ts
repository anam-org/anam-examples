import { env } from "@/env";
import { logger } from "@/utils";
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = env.ANAM_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API Key not found" }, { status: 500 });
  }

  try {
    const response = await fetch("https://api.anam.ai/v1/auth/session-token", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch session token" },
        { status: response.status },
      );
    }

    const data = await response.json();
    const nextResponse = NextResponse.json({ sessionToken: data.sessionToken });

    nextResponse.headers.set(
      "Cache-Control",
      "public, max-age=600, stale-while-revalidate=60",
    );

    return nextResponse;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
