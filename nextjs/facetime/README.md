# AI Facetime App

This is an AI-powered video calling web application that allows users to engage in real-time conversations with an AI assistant. The app integrates with the Anam AI SDK for streaming video and audio, and it provides the ability to configure the AI's personality before starting the video call.

## Features

- **Dark Mode Support**: The app provides a toggle for dark mode, with preferences stored locally.
- **AI Video Call**: Start a real-time video call with the AI assistant using Anam's video streaming services.
- **Microphone and Camera Control**: During the call, users can mute/unmute their microphone and turn their camera on/off.
- **Persona Configuration**: Before the call, the user can configure the AI's personality and description.
- **User Video Feed**: The app streams the user's video in the corner of the screen during the call.
- **Call Timer**: A call timer at the top of the screen displays the duration of the call.

## Tech Stack

- **React (TypeScript)**
- **Vite**
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Anam AI SDK** for video and audio streaming

## Getting Started

### Prerequisites

- **An Anam AI account**: Public account creation is currently unavailable. Design partners will have their accounts created by the Anam team.
- **An Anam API key**: API keys are shared with design partners during onboarding.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/anam-org/anam-examples.git
   cd facetime
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root of the project with the following variables:

   ```plaintext
   VITE_BASE_URL=https://api.anam.ai
   VITE_ANAM_API_KEY=your_api_key
   VITE_PERSONA_ID=default_id
   ```

   Replace `your_api_key` and `default_id` with your Anam API key and the default persona ID, respectively.

4. **Start the development server:**

   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

   The application will now be running locally. Open your browser and navigate to:

   ```
   http://localhost:5173
   ```

## Usage

1. **Home Page**: Start by launching the app. You will be greeted with the home page, which includes a video preview and a button to start the video call.
2. **Configure AI**: Before the call, you will be able to configure the AI's personality and provide a description of its role.
3. **Video Call**: Once the AI is configured, you can start the video call, which streams your video along with the AI's video. You can mute/unmute your microphone or turn your camera on/off during the call.

## Important Security Consideration

This app uses the `unsafe_createClientWithApiKey` method from the Anam AI SDK because it is a client-only application. **This approach is not recommended for production deployments** as it exposes the API key directly in the client, which can lead to security vulnerabilities.

For production environments, it is recommended to set up a server-side solution that safely creates a session token. You can then pass this token to the client for authenticating the user securely.

To read more about safe ways to handle authentication and streaming in production, refer to the [Anam AI SDK documentation on npm](https://www.npmjs.com/package/@anam-ai/js-sdk).

## Extending the Example

You can extend or modify the application by adding new views, introducing your own personas, and tailoring the scenarios to meet your use case.
