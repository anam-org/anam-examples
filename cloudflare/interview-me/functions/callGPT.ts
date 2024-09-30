export interface Env {
  AZURE_GPT_API_KEY: string;
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // Configuration
  const API_KEY = env.AZURE_GPT_API_KEY;
  const ENDPOINT = "https://east-us-anam-gpt.openai.azure.com/openai/deployments/anam-gpt-mini-0/chat/completions?api-version=2024-02-15-preview";

  try {
    const requestBody = await request.json();

    const headers = {
      "Content-Type": "application/json",
      "api-key": API_KEY,
    };

    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the actual message content from the API response
    const gptResponse = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    
    if (!gptResponse) {
      throw new Error('No valid response from GPT');
    }

    return new Response(JSON.stringify({ response: gptResponse }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

