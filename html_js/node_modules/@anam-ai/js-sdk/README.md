# Anam AI JavaScript SDK

This is the official JavaScript SDK for integrating Anam AI realtime digital personas into your product. It provides a simple and intuitive API to interact with Anam AI's services.

## Introduction

The Anam AI JavaScript SDK is designed to help developers integrate Anam AI's digital personas into their JavaScript applications. The SDK provides a set of APIs and utilities to make it easier to create, manage, and interact with digital personas in a realtime environment.

## Prerequisites

### An Anam AI account

Public account creation is currently unavailable. If you are a design partner your account will be created for you by our team.

### An Anam API key

Public API keys are not yet available. If you are a design partner an API key will be shared with you during onboarding.

# Getting Started

First, install the SDK in your project

```zsh
npm install @anam-ai/js-sdk
```

## Local development

The quickest way to start testing the SDK is to use your API key directly with our SDK and [choose a default persona](#listing-personas) from our predefined examples.
To use the SDK you first need to create an instance of `AnamClient`. For local development you can do this using the `unsafe_createClientWithApiKey` method.

```typescript
import { unsafe_createClientWithApiKey } from '@anam-ai/js-sdk';

const anamClient = unsafe_createClientWithApiKey('your-api-key', {
  personaId: 'chosen-persona-id',
});
```

**NOTE**: the method `unsafe_createClientWithApiKey` is unsafe for production use cases because it requires exposing your api key to the client. When deploying to production see [production usage](#usage-in-production) first.

Once you have an instance of the Anam client initialised you can start a session by streaming to audio and video elements in the DOM.

```typescript
await anamClient.streamToVideoAndAudioElements(
  'video-element-id',
  'audio-element-id',
);
```

This will start a new session using the pre-configured persona id and start streaming video and audio to the elements in the DOM with the matching element ids.

To stop a session use the `stopStopStreaming` method.

```typescript
anamClient.stopStreaming();
```

## Usage in production

When deploying to production it is important not to publicly expose your API key. To avoid this issue you should first exchange your API key for a short-lived session token on the server side. Session tokens can then be passed to the client and used to initialise the Anam SDK.

**From the server**

```typescript
const response = await fetch(`https://api.anam.ai/v1/auth/session-token`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  },
});
const data = await response.json();
const sessionToken = data.sessionToken;
```

Once you have a session token you can use the `createClient` method of the Anam SDK to initialise an Anam client instance.

```typescript
import { createClient } from '@anam-ai/js-sdk';

const anamClient = createClient('your-session-token', {
  personaId: 'chosen-persona-id',
});
```

Regardless of whether you initialise the client using an API key or session token the client exposes the same set of available methods for streaming.

[See here](#starting-a-session-in-production-environments) for an example sequence diagram of starting a session in production environments.

## Using the talk command

Sometimes during a persona session you may wish to force a response from the persona. For example when the user interacts with an element on the page or when you have disabled the Anam LLM in order to use your own. To do this you can use the `talk` method of the Anam client.

```typescript
anamClient.talk('Content to say');
```

## Controlling the input audio

### Audio input state

By default the Anam client starts capturing input audio from the users microphone when a session starts and stops capturing the audio when the session ends. For certain use cases however, you may wish to control the input audio state programmatically.

To get the current input audio state.

```typescript
const audioState: InputAudioState = anamClient.getInputAudioState();
// { isMuted: false } or { isMuted: true }
```

To mute the input audio.

```typescript
const audioState: InputAudioState = anamClient.muteInputAudio();
// { isMuted: true }
```

**Note**: If you mute the input audio before starting a stream the session will start with microphone input disabled.

To unmute the input audio.

```typescript
const audioState: InputAudioState = anamClient.unmuteInputAudio();
// { isMuted: false }
```

### Using custom input streams

If you wish to control the microphone input audio capture yourself you can instead pass your own `MediaStream` object when starting a stream.

```typescript
anamClient.streamToVideoAndAudioElements(
  'video-element-id',
  'audio-element-id',
  {
    /** register any callbacks **/
  },
  userProvidedMediaStream,
);
```

The `userProvidedMediaStream` object must be an instance of `MediaStream` and the user input audio should be the first audio track returned from the `MediaStream.getAudioTracks()` method.

**Note**: This is the default behaviour if you are using `navigator.mediaDevices.getUserMedia()`.

## Additional Configuration

### Disable brains

You can turn off the Anam LLM by passing the `disableBrains` config option to the client during initialisation. If this option is set to `true` then the persona will wait to receive `talk` commands and will not respond to voice input from the user.

```typescript
import { createClient } from '@anam-ai/js-sdk';

const anamClient = createClient('your-session-token', {
  personaId: 'chosen-persona-id',
  disableBrains: true,
});
```

### Disable filler phrases

To turn off the use of filler phrases by the persona you can set the `disableFillerPhrases` option to true.

```typescript
import { createClient } from '@anam-ai/js-sdk';

const anamClient = createClient('your-session-token', {
  personaId: 'chosen-persona-id',
  disableFillerPhrases: true,
});
```

> **Note**: the option `disableFillerPhrases` has no effect if `disableBrains` is set to `true`.

### Updating client config after initialisation

If you have already initialised the Anam client but wish to update the persona configuration you can use the `setPersonaConfig` method

```typescript
import { createClient } from '@anam-ai/js-sdk';

const anamClient = createClient('your-session-token', {
  personaId: 'chosen-persona-id',
});

anamClient.setPersonaConfig({
  personaId: 'chosen-persona-id',
  disableFillerPhrases: true,
});
```

To check the currently set config use the `getPersonaConfig` method.

```typescript
const config = anamClient.getPersonaConfig();
```

## Using Callbacks

When starting a steam you can pass callback functions to the Anam client which will fire on specific events during the session.

```typescript
await anamClient.streamToVideoAndAudioElements(
  'video_element_id',
  'audio_element_id',
  {
    onConnectionEstablishedCallback: onConnectionEstablished,
    onConnectionClosedCallback: onConnectionClosed,
    onVideoPlayStartedCallback: onVideoPlayStarted,
    onMessageHistoryUpdatedCallback: onMessageHistoryUpdated,
  },
);
```

### Available Callback Functions

| Callback Name                     | Description                                                                                                                                                           |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onConnectionEstablishedCallback` | Called when the direct connection between the browser and the Anam Engine has been established.                                                                       |
| `onConnectionClosedCallback`      | Called when the direct connection between the browser and the Anam Engine has been closed.                                                                            |
| `onVideoPlayStartedCallback`      | When streaming directly to a video element this callback is called when the first frames start playing. Useful for removing any loading indicators during connection. |
| `onReceiveMessageCallback`        | Called with the message transcription of the persona speech.                                                                                                          |
| `onInputAudioStreamStartCallback` | Called with the users input audio stream when microphone input has been initialised.                                                                                  |

# Personas

Available personas are managed via the [Anam API](https://api.anam.ai/api).

> **Note**: The examples below are shown using bash curl syntax. For the best experience we recommend trying queries directly from our [interactive Swagger documentation](https://api.anam.ai/api). To use the interactive Swagger documentation you will first need to authenticate by clicking the Authorize button in the top right and pasting your API key into the displayed box.

### Listing Available Personas

To list all personas available for your account use the `/v1/persona` endpoint.

```bash
# Example Request
curl -X GET "https://api.anam.ai/v1/persona" -H "Authorization: Bearer your-api-key"

# Example Response
[
  {
    "id": "3c6025f0-698d-4e8d-b619-9c97a2750584",
    "name": "Eva",
    "description": "Eva is the virtual receptionist of the Sunset Hotel.",
    "personaPreset": "eva",
    "createdAt": "2021-01-01T00:00:00Z",
    "updatedAt": "2021-01-02T00:00:00Z"
  }
]
```

By default each account includes our example persona 'Eva'. The virtual receptionist of the Sunset Hotel.

> **Quick start**: Make a note of the ID for the Eva persona and use this to initialise the SDK.

To show more detail about a specific persona you can use the `/v1/persona/{id}` endpoint.

```bash
# Example Request
curl -X GET "https://api.anam.ai/v1/persona/3c6025f0-698d-4e8d-b619-9c97a2750584" -H "Authorization: Bearer your-api-key"

# Example Response
{
  "id": "3c6025f0-698d-4e8d-b619-9c97a2750584",
  "name": "Eva",
  "description": "Eva is the virtual receptionist of the Sunset Hotel.",
  "personaPreset": "eva",
  "brain": {
    "id": "3c4525f0-698d-4e8d-b619-8c97a23780512",
    "personality": "You are role-playing as a text chatbot hotel receptionist at The Sunset Hotel. Your name is Eva.",
    "systemPrompt": "You are role-playing as a text chatbot hotel receptionist at The Sunset Hotel...",
    "fillerPhrases": ["One moment please.", "Let me check that for you."],
    "createdAt": "2021-01-01T00:00:00Z",
    "updatedAt": "2021-01-02T00:00:00Z"
  }
}
```

### Creating Custom Personas

You can create your own custom personas by using the `/v1/persona` endpoint via a `POST` request which defined the following properties:
| Persona parameter | Description |
|----------------|---------------------------------------------------------------------------------------------------------|
| `name` | The name for the persona. This is used as a human-readable identifier for the persona. |
| `description` | A brief description of the persona. This is optional and helps provide context about the persona's role. Not used by calls to the LLM|
| `personaPreset`| Defines the face and voice of the persona from a list of available presets. Currently the only available preset is `eva` |
| `brain` | Configuration for the persona's LLM 'brain' including the system prompt, personality, and filler phrases.|

| Brain Parameter | Description                                                                                           |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| `systemPrompt`  | The prompt used for initializing LLM interactions, setting the context for the persona's behaviour.   |
| `personality`   | A short description of the persona's character traits which influences the choice of filler phrases.  |
| `fillerPhrases` | Phrases used to enhance interaction response times, providing immediate feedback before a full reply. |

Example usage

```bash
# Example Request
curl -X POST "https://api.anam.ai/v1/persona" -H "Content-Type: application/json" -H "Authorization: Bearer your-api-key" -d '{
  "name": "Eva",
  "description": "Eva is the virtual receptionist of the Sunset Hotel.",
  "personaPreset": "eva",
  "brain": {
    "systemPrompt": "You are Eva, a virtual receptionist...",
    "personality": "You are role-playing as a text chatbot hotel receptionist at The Sunset Hotel. Your name is Eva.",
    "fillerPhrases": ["One moment please.", "Let me check that for you."]
  }
}'

# Example Response
{
  "id": "new_persona_id",
  "name": "Eva",
  "description": "Eva is the virtual receptionist of the Sunset Hotel.",
  "personaPreset": "eva",
  "brain": {
    "id": "new_brain_id",
    "personality": "helpful and friendly",
    "systemPrompt": "You are Eva, a virtual receptionist...",
    "fillerPhrases": ["One moment please...", "Let me check that for you..."],
    "createdAt": "2021-01-01T00:00:00Z",
    "updatedAt": "2021-01-02T00:00:00Z"
  }
}
```

# Sequence Diagrams

## Starting a session in production environments

![Example sequence diagram](media://start-session.png)

## Interaction loop

![Example interaction loop](media://interaction-loop.png)

## Interaction loop with custom LLM usage

![Example interaction loop for custom LLM diagram](media://custom-llm-interaction.png)
