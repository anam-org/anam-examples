import { createClient } from "@anam-ai/js-sdk";
import { AnamEvent } from "@anam-ai/js-sdk/dist/module/types";

async function getSessionToken(userInput) {
  try {
    const response = await fetch("/getSessionToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personaConfig: {
          name: `persona_unknown`,
          description: "Roast-master",
          personaPreset: "leo_desk",
          systemPrompt: `You are a roast master, here to roast the user. Don't hold back, the user loves being roasted. The user input is: ${userInput}`,
          brainType: "ANAM_GPT_4O_MINI_V1",
        },
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to get session token: ${response.status}`);
    }
    const data = await response.json();
    console.log(
      `Received session token. First 5 characters: ${data.sessionToken.slice(
        0,
        5
      )}`
    );
    return data.sessionToken;
  } catch (error) {
    console.error("Error getting session token:", error);
    throw error;
  }
}

// Add this function to call the rateLimit worker
function checkRateLimit() {
  const RATE_LIMIT_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
  const lastRequestTime = localStorage.getItem("lastRoastRequestTime");
  const currentTime = Date.now();

  if (
    lastRequestTime &&
    currentTime - parseInt(lastRequestTime) < RATE_LIMIT_DURATION
  ) {
    const remainingTime = Math.ceil(
      (RATE_LIMIT_DURATION - (currentTime - parseInt(lastRequestTime))) /
        1000 /
        60
    );
    return `Rate limit exceeded. Please try again in ${remainingTime} minutes.`;
  }

  localStorage.setItem("lastRoastRequestTime", currentTime.toString());
  return null;
}

document.addEventListener("DOMContentLoaded", () => {
  const userInput = document.getElementById("user-input");
  const submitRoastButton = document.getElementById("submit-roast");
  const videoContainer = document.getElementById("video-container");
  const streamControls = document.getElementById("stream-controls");
  const loadingSpinner = document.getElementById("loading-spinner");
  const stopRoastButton = document.getElementById("stop-roast");

  let client;

  if (submitRoastButton) {
    submitRoastButton.addEventListener("click", async (e) => {
      e.preventDefault();

      const rateLimitError = checkRateLimit();
      if (rateLimitError) {
        console.log("Rate limit error:", rateLimitError);
        alert(rateLimitError);
        return;
      }

      const userInputText = userInput.value;
      console.log("User input:", userInputText);

      try {
        submitRoastButton.disabled = true;
        submitRoastButton.textContent = "Roasting...";

        videoContainer.style.display = "block";
        loadingSpinner.style.display = "flex";

        const sessionToken = await getSessionToken(userInputText);

        console.log("Session token:", sessionToken);

        client = createClient(sessionToken);
        console.log("Anam SDK client initialized successfully");

        client.streamToVideoAndAudioElements("video-stream", "audio-stream");

        client.addListener(AnamEvent.VIDEO_PLAY_STARTED, () => {
          loadingSpinner.style.display = "none";
        });

        streamControls.style.display = "block";
        userInput.style.display = "none";
        submitRoastButton.style.display = "none";
        stopRoastButton.disabled = false;
      } catch (error) {
        console.error("Detailed error:", error);
        alert("Failed to process roast request: " + error.message);
        videoContainer.style.display = "none";
        loadingSpinner.style.display = "none";
      } finally {
        submitRoastButton.disabled = false;
        submitRoastButton.textContent = "Roast Me";
      }
    });
  } else {
    console.error("Submit roast button not found");
  }

  if (stopRoastButton) {
    stopRoastButton.addEventListener("click", () => {
      if (client) {
        client.stopStreaming();
        client = null;
      }
      videoContainer.style.display = "none";
      streamControls.style.display = "none";
      userInput.style.display = "block";
      submitRoastButton.style.display = "block";
      stopRoastButton.disabled = true;
    });
  } else {
    console.error("Stop roast button not found");
  }
});
