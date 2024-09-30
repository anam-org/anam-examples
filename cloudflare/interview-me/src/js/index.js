console.log('main.js loaded');

import { createClient } from "@anam-ai/js-sdk";
import { AnamEvent } from "@anam-ai/js-sdk/dist/module/types";

async function getSessionToken() {
  try {
    const response = await fetch(`/getSessionToken`);
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
    const response = await fetch('/createPersona', {
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
  let messageHistory = [];

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

        client.addListener(AnamEvent.MESSAGE_HISTORY_UPDATED, (messages) => {
          messageHistory = messages;
          console.log('Updated Messages: ', messages);
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
    endInterviewButton.addEventListener('click', async () => {
      if (client) {
        client.stopStreaming();
        console.log('Final message history:', messageHistory);
        client = null;
      }
      videoContainer.style.display = 'none';
      streamControls.style.display = 'none';
      interviewSetup.style.display = 'block';
      startInterviewButton.style.display = 'block';
      endInterviewButton.disabled = true;
      interviewerImage.style.display = 'block';

      // Call the Cloudflare GPT Function after ending the interview
      try {
        const systemPrompt = "Please provide feedback on this interview based on the following conversation log:";
        const parsedMessageHistory = messageHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n');
        
        const response = await fetch('/callGPT', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: parsedMessageHistory }
            ]
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Interview feedback from GPT:", data.response);
        // You can add code here to handle the response, e.g., update the UI to display the feedback
      } catch (error) {
        console.error("Error calling GPT Function:", error);
      }

    });
  } else {
    console.error('End interview button not found');
  }
});