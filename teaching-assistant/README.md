# Anam AI Avatar WebApp

This application is an example of how to integrate and utilize the Anam AI Avatar SDK to create interactive language teaching experiences. The AI avatar is configurable to teach various languages and serves as a showcase for engineers to reference and explore its capabilities.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Navigating the App](#navigating-the-app)
  - [Customizing the Avatar](#customizing-the-avatar)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

- **Interactive AI Avatar**: Engage with an AI-powered avatar capable of teaching different languages.
- **Configurable Language Settings**: Easily switch between languages to see how the avatar adapts.
- **Streaming Video and Audio**: Experience real-time streaming of the avatar's video and audio content.
- **Conversation History**: View past interactions with the avatar through the conversation popup.
- **Responsive Design**: Accessible on various devices with a user-friendly interface.
- **Engineer-Friendly**: Designed as a reference implementation for developers to explore and build upon.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- **An Anam AI account**: Public account creation is currently unavailable. If you are a design partner your account will be created for you by our team.
- **An Anam API key**: Public API keys are not yet available. If you are a design partner an API key will be shared with you during onboarding.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/anam-org/anam-examples.git
   cd teaching-assistant
   ```

2. **Install dependencies:**

   ```bash
   npm/pnpm/yarn install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory and add your Anam AI SDK credentials:

   ```env
   ANAM_API_KEY=your_api_key
   NEXT_PUBLIC_PERSONA_ID=your_persona_id
   NEXT_PUBLIC_SESSION_TOKEN=your_session_token
   NEXT_PUBLIC_DISABLE_BRAINS=false
   NEXT_PUBLIC_DISABLE_FILLER_PHRASES=false
   ```

   *Note: Replace the placeholders with your actual credentials.*

## Configuration

The application can be configured via environment variables:

- **`NEXT_PUBLIC_PERSONA_ID`**: The ID of the persona (avatar) to use.
- **`NEXT_PUBLIC_SESSION_TOKEN`**: Your Anam AI session token.
- **`NEXT_PUBLIC_DISABLE_BRAINS`**: Disable AI reasoning if set to `true`.
- **`NEXT_PUBLIC_DISABLE_FILLER_PHRASES`**: Disable filler phrases if set to `true`.

To change the language settings or other configurations, you can modify the settings within the app's interface or adjust the environment variables as needed.

## Usage

### Running the Application

To start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Navigating the App

- **Lessons**: Interact with the AI avatar as it teaches you the selected language.
- **Conversation Popup**: Click on the conversation icon to view your interaction history with the avatar.
- **Settings**: Configure your preferences, such as language selection and avatar settings.
- **Exit**: Stop the streaming session and return to the home screen.

### Customizing the Avatar

The application allows you to customize the AI avatar's behavior and teaching content:

1. **Language Selection**: Choose from a list of supported languages in the settings.
2. **Persona Configuration**: Update the avatar's persona ID to switch to a different avatar.
3. **Disable Features**: Use the environment variables to disable certain AI features like reasoning or filler phrases.

## Project Structure

An overview of the project's file and directory structure:

```
anam-ai-avatar-webapp/
├── app/
│   ├── api/
│   |   └── session-token/
│   |       └── route.ts
│   ├── demo/
│   |   ├── _views/
│   |   |   |── Lessons.tsx
│   |   |   └── Settings.tsx
│   |   └── page.tsx
│   ├── NavigationSidebar.tsx
│   ├── LessonsSidebar.tsx
│   └── ConversationPopup.tsx
├── components/
│   ├── AudioPermissionsModal.tsx
│   ├── ConversationPopup.tsx
│   ├── LessonsSidebar.tsx
│   └── NavigationSidebar.tsx
├── contexts/
│   ├── AnamContext.tsx
│   ├── AudioPermissionContext.tsx
│   ├── SettingsContext.tsx
│   └── ViewContext.tsx
├── providers/
│   └── Providers.tsx
├── utils/
│   ├── errorHandler.ts
│   ├── fetchSessionToken.ts
│   ├── logger.ts
│   └── types.ts
├── .env.local
├── package.json
└── README.md
```

- **`components/`**: React components used throughout the application.
- **`contexts/`**: Context providers for state management using React Context API.
- **`pages/`**: Next.js pages for routing.
- **`public/`**: Static assets like images.
- **`styles/`**: Global CSS styles.
- **`utils/`**: Utility functions for logging and error handling.

---

*This README serves as a starting point for documenting the Anam AI Avatar WebApp. Feel free to modify and expand upon it to suit your project's specific details and requirements.*