export const getSessionToken = async (apiKey: string): Promise<string> => {
  const response = await fetch(`https://api.anam.ai/v1/auth/session-token`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    cache: 'no-cache', // force dynamic rendering of the page by preventing caching: https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering
  });
  const data = await response.json();
  console.log('session token fetched: ', data.sessionToken);
  return data.sessionToken;
};
