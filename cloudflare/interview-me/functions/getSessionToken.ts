export interface Env {
  ANAM_API_KEY: string;
}

export async function onRequestGet(context) {
  const env = context.env;

  try {
    const response = await fetch('https://api.anam.ai/v1/auth/session-token', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.ANAM_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Session token generated successfully. First 5 characters: ${data.sessionToken.slice(0, 5)}`);
    return new Response(JSON.stringify({ sessionToken: data.sessionToken }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error getting session token:', error);
    return new Response(JSON.stringify({ error: `Error getting session token: ${error.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
