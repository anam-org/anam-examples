export interface Env {
  ANAM_API_KEY: string;
}

export async function onRequestPost(context) {
  const env = context.env;
  const request = context.request;

  try {
    const { name, description, personaPreset, systemPrompt, personality, fillerPhrases, userInput } = await request.json();

    const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';

    const payload = {
      name: name || `persona_${clientIp}`,
      description: description || "An AI assistant",
      personaPreset: personaPreset || "leo_desk",
      brain: {
        systemPrompt: userInput ? `${systemPrompt || "You are an AI assistant."} Here's the user input: ${userInput}` : (systemPrompt || "You are an AI assistant."),
        personality: personality || "You are an AI assistant.",
        fillerPhrases: fillerPhrases || ["ummm", "well", "ermm", "so", "ok"]
      }
    };
    console.log("Payload being sent to Anam API:", JSON.stringify(payload, null, 2));

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

    return new Response(JSON.stringify({ persona_id: data.id }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error creating persona:', error);
    return new Response(JSON.stringify({ error: `Error creating persona: ${error.message}` }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
