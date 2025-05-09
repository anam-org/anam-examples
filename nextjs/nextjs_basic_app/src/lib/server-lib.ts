'use server';
const personaConfig = {
  name: 'Cara', // Example name
  avatarId: '30fa96d0-26c4-4e55-94a0-517025942e18', // Example avatar ID for Cara
  voiceId: '6bfbe25a-979d-40f3-a92b-5394170af54b', // Example voice ID for Cara
  brainType: 'ANAM_GPT_4O_MINI_V1', // Example brain type
};

export const getSessionToken = async (apiKey: string): Promise<string> => {
  const response = await fetch(`https://api.anam.ai/v1/auth/session-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      personaConfig,
    }),
    cache: 'no-cache', // force dynamic rendering of the page by preventing caching: https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering
  });
  const data = await response.json();
  console.log('session token fetched: ', data.sessionToken);
  return data.sessionToken;
};
