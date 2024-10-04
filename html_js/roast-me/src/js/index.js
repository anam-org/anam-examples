console.log('main.js loaded');

import { createClient } from "@anam-ai/js-sdk";
import { AnamEvent } from "@anam-ai/js-sdk/dist/module/types";

async function getSessionToken() {
  try {
    const response = await fetch('/getSessionToken');
    if (!response.ok) {
      throw new Error(`Failed to get session token: ${response.status}`);
    }
    const data = await response.json();
    console.log(`Received session token. First 5 characters: ${data.sessionToken.slice(0, 5)}`);
    return data.sessionToken;
  } catch (error) {
    console.error('Error getting session token:', error);
    throw error;
  }
}
async function createNewPersona(userInput) {
  try {
    console.log('Sending request to create new persona');
    console.log('User input:', userInput);
    const response = await fetch('/createPersona', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to create new persona. Status:', response.status, 'Response:', errorText);
      throw new Error(`Failed to create new persona: ${response.status} ${errorText}`);
    }

    const responseText = await response.text();
    console.log('Raw response text:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      throw new Error('Invalid JSON in response');
    }

    console.log('Parsed response data:', data);

    if (!data.persona_id) {
      throw new Error('Persona ID not returned from server');
    }

    console.log('Successfully created new persona:', data);
    return data.persona_id;
  } catch (error) {
    console.error('Error in createNewPersona:', error);
    throw error;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');

  const userInput = document.getElementById('user-input');
  const submitRoastButton = document.getElementById('submit-roast');
  const videoContainer = document.getElementById('video-container');
  const streamControls = document.getElementById('stream-controls');
  const loadingSpinner = document.getElementById('loading-spinner');
  const stopRoastButton = document.getElementById('stop-roast');

  let client;

  if (submitRoastButton) {
    submitRoastButton.addEventListener('click', async (e) => {
      e.preventDefault();
      console.log('Button clicked');
      const userInputText = userInput.value;
      console.log('User input:', userInputText);

      try {
        submitRoastButton.disabled = true;
        submitRoastButton.textContent = 'Roasting...';

        videoContainer.style.display = 'block';
        loadingSpinner.style.display = 'flex';

        const personaId = await createNewPersona(userInputText);
        console.log('Created persona with ID:', personaId);

        const sessionToken = await getSessionToken();

        client = createClient(sessionToken, {
          personaId: personaId,
        });
        console.log('Anam SDK client initialized successfully');

        client.streamToVideoAndAudioElements(
          "video-stream",
          "audio-stream"
        );

        client.addListener(AnamEvent.VIDEO_PLAY_STARTED, () => {
          loadingSpinner.style.display = 'none';
        });

        streamControls.style.display = 'block';
        userInput.style.display = 'none';
        submitRoastButton.style.display = 'none';
        stopRoastButton.disabled = false;
      } catch (error) {
        console.error('Detailed error:', error);
        alert('Failed to process roast request: ' + error.message);
        videoContainer.style.display = 'none';
        loadingSpinner.style.display = 'none';
      } finally {
        submitRoastButton.disabled = false;
        submitRoastButton.textContent = 'Roast Me';
      }
    });
  } else {
    console.error('Submit roast button not found');
  }

  if (stopRoastButton) {
    stopRoastButton.addEventListener('click', () => {
      if (client) {
        client.stopStreaming();
        client = null;
      }
      videoContainer.style.display = 'none';
      streamControls.style.display = 'none';
      userInput.style.display = 'block';
      submitRoastButton.style.display = 'block';
      stopRoastButton.disabled = true;
    });
  } else {
    console.error('Stop roast button not found');
  }
});