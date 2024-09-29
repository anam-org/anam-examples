console.log('main.js loaded');

import { createClient } from "@anam-ai/js-sdk";
import { AnamEvent } from "@anam-ai/js-sdk/dist/module/types";

// const API_URL = 'http://localhost:8787';
const API_URL = 'https://api-server.ben-3b4.workers.dev';

async function getSessionToken() {
  try {
    const response = await fetch(`${API_URL}/get_session_token`);
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
async function createNewPersona(interviewSetup) {
  try {
    console.log('Sending request to create new interviewer persona');
    console.log('Interview setup:', interviewSetup);
    const response = await fetch(`${API_URL}/create_persona`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: "Interviewer",
        description: "An interviewer for job practice",
        personaPreset: "leo_desk",
        systemPrompt: `You are an interviewer conducting a job interview. The interview setup is as follows: ${interviewSetup}. Ask lots of questions. Keep responses brief.`,
        personality: "You are interviewing the user.",
        fillerPhrases: ["hmm", "I see", "interesting", "okay", "alright", "well", "thank you"],
        userInput: interviewSetup
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to create new persona. Status:', response.status, 'Response:', errorText);
      throw new Error(`Failed to create new persona: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Successfully created new interviewer persona:', data);
    return data.persona_id;
  } catch (error) {
    console.error('Error in createNewPersona:', error);
    throw error;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');

  const interviewSetup = document.getElementById('interview-setup');
  const startInterviewButton = document.getElementById('start-interview');
  const videoContainer = document.getElementById('video-container');
  const streamControls = document.getElementById('stream-controls');
  const loadingSpinner = document.getElementById('loading-spinner');
  const endInterviewButton = document.getElementById('end-interview');
  const interviewerImage = document.getElementById('interviewer-image');

  let client;

  if (startInterviewButton) {
    startInterviewButton.addEventListener('click', async (e) => {
      e.preventDefault();
      console.log('Start Interview button clicked');
      const interviewSetupText = interviewSetup.value;
      console.log('Interview setup:', interviewSetupText);

      try {
        startInterviewButton.disabled = true;
        startInterviewButton.textContent = 'Preparing Interview...';

        videoContainer.style.display = 'block';
        loadingSpinner.style.display = 'flex';

        console.log('Creating new interviewer persona:', interviewSetupText);

        const personaId = await createNewPersona(interviewSetupText);
        console.log('Created interviewer persona with ID:', personaId);

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
        interviewerImage.style.display = 'none';
        interviewSetup.style.display = 'none';
        startInterviewButton.style.display = 'none';
        endInterviewButton.disabled = false;

      } catch (error) {
        console.error('Detailed error:', error);
        alert('Failed to start interview: ' + error.message);
        videoContainer.style.display = 'none';
        loadingSpinner.style.display = 'none';
        interviewerImage.style.display = 'block';
      } finally {
        startInterviewButton.disabled = false;
        startInterviewButton.textContent = 'Start Interview';
      }
    });
  } else {
    console.error('Start interview button not found');
  }

  if (endInterviewButton) {
    endInterviewButton.addEventListener('click', () => {
      if (client) {
        client.stopStreaming();
        client = null;
      }
      videoContainer.style.display = 'none';
      streamControls.style.display = 'none';
      interviewSetup.style.display = 'block';
      startInterviewButton.style.display = 'block';
      endInterviewButton.disabled = true;
      interviewerImage.style.display = 'block';
    });
  } else {
    console.error('End interview button not found');
  }
});