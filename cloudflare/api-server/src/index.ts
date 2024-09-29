export interface Env {
  ANAM_API_KEY: string;
}

async function createPersona(
  env: Env,
  clientIp: string,
  {
    name = `replit_persona_test_${clientIp}`,
    description = "A roaster AI",
    personaPreset = "leo_desk",
    systemPrompt = "You are a witty AI assistant specializing in roasting people based on the information they provide. Your task is to analyze the following user input and provide a humorous roast.",
    personality = "You are role-playing as a witty and sarcastic AI assistant specializing in roasting people.",
    fillerPhrases = ["ummm", "well", "ermm", "so", "ok"],
    userInput = ""
  }: {
    name?: string;
    description?: string;
    personaPreset?: string;
    systemPrompt?: string;
    personality?: string;
    fillerPhrases?: string[];
    userInput?: string;
  } = {}
): Promise<Response> {
  const payload = {
    name,
    description,
    personaPreset,
    brain: {
      systemPrompt: userInput ? `${systemPrompt} Here's the user input: ${userInput}` : systemPrompt,
      personality,
      fillerPhrases
    }
  };

  console.log("Payload being sent to Anam API:", JSON.stringify(payload, null, 2));

  try {
    const response = await fetch('https://api.anam.ai/v1/personas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.ANAM_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Anam API Error Response (${response.status}):`, errorBody);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }

    const data = await response.json();
    console.log("Successfully created new persona");
    return new Response(JSON.stringify({ persona_id: data.id }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating persona:', error);
    return new Response(JSON.stringify({ error: `Error creating persona: ${error.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function getSessionToken(env: Env): Promise<Response> {
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

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'GET' && url.pathname === '/') {
      return new Response('Welcome to the anam demo app API');
    }

	if (request.method === 'POST' && url.pathname === '/create_persona') {
	  const {
		name,
		description,
		personaPreset,
		systemPrompt,
		personality,
		fillerPhrases,
		userInput
	  } = await request.json();

	  const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';

	  return createPersona(env, clientIp, {
		name,
		description,
		personaPreset,
		systemPrompt,
		personality,
		fillerPhrases,
		userInput
	  });
	}

    if (request.method === 'GET' && url.pathname === '/get_session_token') {
      return getSessionToken(env);
    }

    return new Response('Not Found', { status: 404 });
  },
};
