import { Message } from '@anam-ai/js-sdk/dist/module/types';

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
