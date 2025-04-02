import { NextRequest } from "next/server";
import OpenAI from "openai";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Create a streaming response from OpenAI
    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      stream: true,
    });

    // Create a TransformStream to convert the OpenAI stream to a ReadableStream
    const encoder = new TextEncoder();
    const textDecoder = new TextDecoder();
    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        // Pass the chunk through
        controller.enqueue(encoder.encode(JSON.stringify(chunk) + "\n"));
      },
    });

    // Connect OpenAI's stream to our transform stream
    const responseStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue({ content });
          }
        }
        controller.close();
      },
    }).pipeThrough(transformStream);

    // Return a streaming response
    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Streaming error:", error);
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
