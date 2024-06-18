import { unsafe_createClientWithApiKey } from "@anam-ai/js-sdk";

const client = unsafe_createClientWithApiKey("YOUR_API_KEY_HERE", {
  personaId: "PERSONA_ID_HERE",
});

console.log(client);

console.log("client created!");

client.streamToVideoAndAudioElements(
  "my-video-element-id",
  "my-audio-element-id"
);
