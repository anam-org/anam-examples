import { Message } from '@anam-ai/js-sdk/dist/module/types';
import { AnamClient } from '@anam-ai/js-sdk';
import { ephemeralPersonaConfig } from './persona-config';

export async function getSessionToken(apiKey: string) {
  const response = await fetch(`https://api.anam.ai/v1/auth/session-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ personaConfig: ephemeralPersonaConfig }),
    cache: 'no-cache', // force dynamic rendering of the page by preventing caching: https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering
  });
  const data = await response.json();
  console.log('session token fetched: ', data.sessionToken);
  return data.sessionToken;
}

export async function callChatAPI(
  messages: { role: string; content: string }[],
) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  return response.json();
}

export async function getPersonaResponse(messages: Message[]) {
  const chatCompletionMessages = messages.map((message) => ({
    role: message.role === 'user' ? 'user' : 'assistant',
    content: message.content,
  }));
  const { response } = await callChatAPI(chatCompletionMessages);
  return response;
}

// Streams chat responses from OpenAI to the Anam TalkMessageStream
export async function streamPersonaResponse(
  messages: Message[],
  anamClient: AnamClient,
  onError?: (error: any) => void,
) {
  try {
    const chatCompletionMessages = messages.map((message) => ({
      role: message.role === 'user' ? 'user' : 'assistant',
      content: message.content,
    }));

    // Create a talk message stream from the Anam client
    const talkStream = anamClient.createTalkMessageStream();
    let isFirstChunk = true;

    // Start the fetch request with streaming
    const response = await fetch('/api/chat-stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: chatCompletionMessages }),
    });

    if (!response.ok) {
      throw new Error(`Stream request failed: ${response.status}`);
    }

    // Get the response as a ReadableStream
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get stream reader');
    }

    const textDecoder = new TextDecoder();

    // Process the stream
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        // Complete the stream when we're done
        if (talkStream.isActive()) {
          talkStream.endMessage();
        }
        break;
      }

      if (value) {
        const text = textDecoder.decode(value);
        const lines = text.split('\n').filter((line) => line.trim() !== '');

        for (const line of lines) {
          try {
            const data = JSON.parse(line);

            if (data.content) {
              const contentToSend = data.content;
              // Check if the stream is still active before sending
              if (talkStream.isActive()) {
                // Don't mark as end of speech until we know we're done
                talkStream.streamMessageChunk(contentToSend, false);
                isFirstChunk = false;
              } else {
                // Stream was interrupted, break out
                break;
              }
            }
          } catch (parseError) {
            console.error('Error parsing stream chunk:', parseError);
          }
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error in streamPersonaResponse:', error);
    if (onError) {
      onError(error);
    }
    return false;
  }
}
