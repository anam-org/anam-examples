import { createClient } from "@anam-ai/js-sdk";
import { AnamEvent } from "@anam-ai/js-sdk/dist/module/types";

function checkRateLimit() {
  const RATE_LIMIT_DURATION = 20 * 60 * 1000; // 20 minutes in milliseconds
  const lastRequestTime = localStorage.getItem('lastInterviewRequestTime');
  const currentTime = Date.now();

  if (lastRequestTime && currentTime - parseInt(lastRequestTime) < RATE_LIMIT_DURATION) {
    const remainingTime = Math.ceil((RATE_LIMIT_DURATION - (currentTime - parseInt(lastRequestTime))) / 1000 / 60);
    return `Rate limit exceeded. Please try again in ${remainingTime} minutes.`;
  }

  localStorage.setItem('lastInterviewRequestTime', currentTime.toString());
  return null;
}

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
        description: "An interviewer for job practice.",
        personaPreset: "leo_desk",
        systemPrompt: `You are an interviewer conducting a job interview. The interview setup as given from the user is as follows: ${interviewSetup}. Always ask one question. Keep responses brief.`,
        personality: "You are interviewing the user.",
        fillerPhrases: ["Hmmm..", "I see..", "Interesting..", "Okay..", "Alright..", "Well..", "Thank you.."],
        userInput: undefined  // No user input needed as it's already provided in the interview setup
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
  const interviewSetup = document.getElementById('interview-setup');
  const startInterviewButton = document.getElementById('start-interview');
  const videoContainer = document.getElementById('video-container');
  const streamControls = document.getElementById('stream-controls');
  const loadingSpinner = document.getElementById('loading-spinner');
  const endInterviewButton = document.getElementById('end-interview');
  const interviewerImage = document.getElementById('interviewer-image');
  const feedbackContainer = document.getElementById('feedback-container');

  // Hide feedback container initially
  feedbackContainer.style.display = 'none';

  let client;
  let messageHistory = [];

  if (startInterviewButton) {
    startInterviewButton.addEventListener('click', async (e) => {
      e.preventDefault();

      const rateLimitError = checkRateLimit();
      if (rateLimitError) {
        console.log('Rate limit error:', rateLimitError);
        alert(rateLimitError);
        return;
      }

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
      
      // Show feedback container and loading spinner
      const feedbackLoadingSpinner = document.getElementById('feedback-loading-spinner');
      const feedbackContent = document.getElementById('feedback-content');
      const feedbackText = document.getElementById('feedback-text');
      
      feedbackContainer.style.display = 'block';
      feedbackLoadingSpinner.style.display = 'flex';
      feedbackContent.style.display = 'none';

      // Call the Cloudflare Function to get feedback
      try {
        const systemPrompt = "The user has just completed being interviewed by the AI interviewer and would like feedback. Please provide feedback " +
          "on this interview directed at them. Use 'you' as if you're speaking directly to them. Keep it friendly and encouraging but make sure to give critical " +
          " feedback. Base your response on the following conversation log (the AI interviewer is labelled with role of 'persona'):";
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
        if (data.error) {
          throw new Error(data.error);
        }
        
        // Display the feedback
        feedbackLoadingSpinner.style.display = 'none';
        feedbackContent.style.display = 'block';
        feedbackText.innerHTML = DOMPurify.sanitize(marked.parse(data.response));
        
      } catch (error) {
        console.error("Error calling GPT Function:", error);
        feedbackLoadingSpinner.style.display = 'none';
        feedbackContent.style.display = 'block';
        feedbackText.textContent = "Sorry, we couldn't generate feedback at this time. Please try again later.";
      }
    });
  } else {
    console.error('End interview button not found');
  }

  const returnToStartButton = document.getElementById('return-to-start');

  if (returnToStartButton) {
    returnToStartButton.addEventListener('click', () => {
      feedbackContainer.style.display = 'none';
      interviewSetup.style.display = 'block';
      startInterviewButton.style.display = 'block';
      interviewerImage.style.display = 'block';
    });
  } else {
    console.error('Return to start button not found');
  }
});