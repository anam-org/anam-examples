export interface Env {
  ANAM_API_KEY: string;
}

function corsHeaders(origin: string) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

async function createPersona(
  env: Env,
  clientIp: string,
  {
    name = `persona_${clientIp}`,
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
	console.log("Persona ID:", data.id);
    const responseBody = JSON.stringify({ persona_id: data.id });
    console.log("Response being sent to client:", responseBody);
    return new Response(responseBody, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Ensure CORS is properly set
      }
    });
  } catch (error) {
    console.error('Error creating persona:', error);
    return new Response(JSON.stringify({ error: `Error creating persona: ${error.message}` }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Ensure CORS is properly set
      }
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
    const origin = request.headers.get('Origin') || 'http://localhost:3000';

    console.log(`Received ${request.method} request for ${url.pathname}`);

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      console.log('Handling CORS preflight request');
      return new Response(null, {
        headers: corsHeaders(origin),
      });
    }

    if (request.method === 'GET' && url.pathname === '/') {
      console.log('Handling root path request');
      return new Response('Welcome to the anam demo app API', {
        headers: corsHeaders(origin),
      });
    }

    if (request.method === 'POST' && url.pathname === '/create_persona') {
      console.log('Handling create_persona request');
      try {
        const body = await request.json();
        console.log('Request body:', JSON.stringify(body));

        const {
          name,
          description,
          personaPreset,
          systemPrompt,
          personality,
          fillerPhrases,
          userInput
        } = body;

        const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';
        console.log('Client IP:', clientIp);

        console.log('Calling createPersona with:', {
          name, description, personaPreset, systemPrompt,
          personality, fillerPhrases, userInput, clientIp
        });

        const result = await createPersona(env, clientIp, {
          name,
          description,
          personaPreset,
          systemPrompt,
          personality,
          fillerPhrases,
          userInput
        });

        console.log('createPersona result:', result);

        if (result instanceof Response) {
          const resultBody = await result.text();
          console.log('Result body:', resultBody);
          return new Response(resultBody, {
            headers: {
              ...corsHeaders(origin),
              'Content-Type': 'application/json'
            }
          });
        } else {
          console.error('createPersona did not return a Response object');
          throw new Error('Internal server error');
        }
      } catch (error) {
        console.error('Error in create_persona:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: {
            ...corsHeaders(origin),
            'Content-Type': 'application/json'
          }
        });
      }
    }

    if (request.method === 'GET' && url.pathname === '/get_session_token') {
      console.log('Handling get_session_token request');
      try {
        const result = await getSessionToken(env);
        console.log('getSessionToken result:', result);

        if (result instanceof Response) {
          const resultBody = await result.text();
          console.log('Session token result body:', resultBody);
          return new Response(resultBody, {
            headers: {
              ...corsHeaders(origin),
              'Content-Type': 'application/json'
            }
          });
        } else {
          console.error('getSessionToken did not return a Response object');
          throw new Error('Internal server error');
        }
      } catch (error) {
        console.error('Error in get_session_token:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: {
            ...corsHeaders(origin),
            'Content-Type': 'application/json'
          }
        });
      }
    }

    console.log(`No matching route for ${request.method} ${url.pathname}`);
    return new Response('Not Found', {
      status: 404,
      headers: corsHeaders(origin)
    });
  },
};
