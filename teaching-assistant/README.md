# Anam AI Teaching Assistant Example

This application demonstrates how to integrate and utilize the Anam AI Avatar SDK to create an interactive language teaching experience. The avatar can teach multiple languages and serves as a reference for engineers exploring the SDK's capabilities. For more in-depth information on the Anam client's capabilities, you can find its documentation [here](https://www.npmjs.com/package/@anam-ai/js-sdk).

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Navigating the Code](#navigating-the-code)

## Getting Started

### Prerequisites

- **An Anam AI account**: Public account creation is currently unavailable. Design partners will have their accounts created by the Anam team.
- **An Anam API key**: API keys are shared with design partners during onboarding.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/anam-org/anam-examples.git
   cd teaching-assistant
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Generate personas and set up your .env file:**

   After installing dependencies, run the following command to generate personas:

   ```bash
   npm run generate-personas
   # or
   pnpm generate-personas
   # or
   yarn generate-personas
   ```

   Update your `.env` file with the generated persona IDs (found in persona-ids.txt) as shown below:

   ```env
   ANAM_API_KEY=your_api_key
   NEXT_PUBLIC_BASE_URL=https://api.anam.ai

   # Persona IDs for each scenario
   NEXT_PUBLIC_PERSONA_FRENCH_FRIENDLY=FIRST_PERSONA_ID
   NEXT_PUBLIC_PERSONA_FRENCH_PROFESSIONAL=SECOND_PERSONA_ID
   NEXT_PUBLIC_PERSONA_FRENCH_FORMAL=THIRD_PERSONA_ID

   NEXT_PUBLIC_PERSONA_SPANISH_FRIENDLY=FOURTH_PERSONA_ID
   NEXT_PUBLIC_PERSONA_SPANISH_PROFESSIONAL=FIFTH_PERSONA_ID
   NEXT_PUBLIC_PERSONA_SPANISH_FORMAL=SIXTH_PERSONA_ID

   NEXT_PUBLIC_PERSONA_GERMAN_FRIENDLY=SEVENTH_PERSONA_ID
   NEXT_PUBLIC_PERSONA_GERMAN_PROFESSIONAL=EIGHTH_PERSONA_ID
   NEXT_PUBLIC_PERSONA_GERMAN_FORMAL=NINTH_PERSONA_ID
   ```

## Usage

### Running the Application

To start the development server, use one of the following commands:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Access the application at [http://localhost:3000](http://localhost:3000).

## Navigating the Code

### Key Directories and Files

### 1. **`app/`**

- **`_providers.tsx`**: Wraps the app with the necessary context providers (`AnamContext`, `SettingsContext`, `AudioPermissionContext`) for global state management. Ensures session tokens are fetched and required contexts are provided.
- **`api/session-token/route.ts`**: Manages session token generation by communicating with the backend. This token is used to initialize and authenticate the Anam AI client.

- **`demo/`**:

  - **`page.tsx`** (`Demo.tsx`): The main entry point for the demo experience. It tracks the remaining time using a countdown timer and manages the Anam client’s streaming state. The page renders conversation tracking and an avatar streaming video and audio.
    - **Key Components**:
      - `AvatarContainer`: Handles streaming of video and audio from the Anam client.
      - `ConversationTracker`: Displays the conversation between the user and the Anam persona.
      - `useStreamTimer`: Manages the countdown timer for stopping streaming automatically after a specified time.

- **`demo/settings/`**:
  - **`page.tsx`** (`Settings.tsx`): Manages persona and language settings, as well as dark mode preferences. It allows the user to configure the avatar's persona and language, and apply dark or light themes.
    - **Key Components**:
      - `useSettingsContext`: Provides access to the selected language, persona, and theme settings.
      - `applyPersonaConfig`: Applies the chosen persona configuration to the Anam client.

### 2. **`components/`**

- **`NavigationSidebar.tsx`**:

  - Renders the navigation sidebar with menu options such as "Lessons," "Vocabulary," and "Practice."
  - Supports toggling between expanded and collapsed states and allows navigation to different views.
  - **Key Functions**:
    - `handleMenuClick()`: Handles navigation and stops streaming when necessary.
    - `handleExitClick()`: Stops the Anam client streaming and navigates to the home page.
  - **Props**: No external props, manages internal state for toggling and navigation.

- **`LessonsSidebar.tsx`**:

  - Renders a toggleable sidebar with a list of lessons, based on the selected language from the context.
  - Supports toggling between expanded and collapsed views and adapts to different screen sizes.
  - **Key Functions**:
    - `useEffect()`: Updates the default selected lesson when the language changes.
  - **Props**: No external props, uses context for managing the selected language and lessons.

- **`AudioPermissionsModal.tsx`**:

  - Displays a modal to request microphone permissions from the user, allowing them to select a microphone and toggle the audio on/off.
  - **Key Functions**:
    - `requestAudioPermissions()`: Requests microphone access from the user.
    - `handleToggleMic()`: Toggles the audio stream on or off.
    - `setSelectedMicrophone()`: Allows the user to select from available microphones.
    - **Props**:
      - `onClose`: Closes the modal.
      - `onPermissionGranted`: Confirms microphone permission and starts the session.

- **`AvatarContainer.tsx`**:

  - Manages the streaming of video and audio from the Anam client. Initializes streaming when the client is ready and cleans up when the component unmounts.
  - **Key Functions**:
    - `startStreaming()`: Starts video and audio streaming.
    - `stopStreaming()`: Stops the stream when the component unmounts.
    - **Props**:
      - `videoId` & `audioId`: IDs for the HTML video and audio elements used for streaming.

- **`ConversationPopup.tsx`**:

  - Displays a chat interface within a popover, allowing the user to toggle the visibility of the conversation.
  - **Key Functions**:
    - `scrollToBottom()`: Scrolls to the bottom of the conversation.
    - **Props**:
      - No external props, but listens to conversation updates via `usePersonaConversation`.

- **`ConversationTracker.tsx`**:
  - Displays the conversation history in a toggleable UI, optimized for mobile screens. Automatically scrolls to the bottom when new messages arrive or when the history is opened.
  - **Key Functions**:
    - `scrollToBottom()`: Scrolls to the bottom of the conversation.
    - **Props**:
      - No external props, but listens to conversation updates via `usePersonaConversation`.

### 3. **`contexts/`**

- **`AnamContext.tsx`**:

  - Manages Anam AI client initialization and session tokens. Provides hooks for starting/stopping streaming, updating persona configurations, and setting event listeners.
  - **Key Components**:
    - `anamClient`: The initialized client.
    - `isClientInitialized`: Boolean indicating if the client is initialized.
    - **Listener Setters**: `setOnMessageHistoryUpdated`, `setOnConnectionEstablished`, `setOnVideoStartedStreaming`, `setOnConnectionClosed`.
    - `setPersonaConfig`: Updates the current persona.
    - `startStreaming` & `stopStreaming`: Controls streaming sessions.

- **`SettingsContext.tsx`**:

  - Manages application settings such as the selected language, persona type (friendly, professional, formal), and applies persona configurations to the Anam AI client.
  - **Key Components**:
    - `selectedLanguage`: Currently selected language (e.g., French, Spanish, German).
    - `selectedPersona`: Currently selected persona type (friendly, professional, formal).
    - `applyPersonaConfig`: Applies the selected persona configuration to the Anam client.
    - `isDarkMode`: Checks if dark mode is enabled.

- **`AudioPermissionContext.tsx`**:
  - Manages microphone access, audio permissions, and available audio devices.
  - **Key Components**:
    - `microphones`: List of available microphones.
    - `selectedMicrophone`: Current microphone in use.
    - `audioPermissionsGranted`: Boolean indicating if microphone access is granted.
    - `requestAudioPermissions`: Requests microphone access.
    - `toggleAudioTrack`: Toggles the audio stream on/off.

### 4. **`hooks/`**

- **`useFetchToken.ts`**:

  - A hook for fetching and managing session tokens using `SWR`. It checks for token expiration and refreshes automatically or manually.
  - **Functions**:
    - `fetchSessionToken()`: Fetches the session token from the API.
    - `isTokenExpired()`: Checks if the token is expired.
    - `refreshToken()`: Manually triggers a token refresh.
  - **Returns**: `sessionToken`, `error`, `refreshToken`, `isValidating`.

- **`usePersonaConversation.ts`**:

  - A hook for tracking and updating the conversation from the Anam client.
  - **Functions**:
    - `updateConversation()`: Maps the received messages, splitting between "persona" and "user".
  - **Uses**: `setOnMessageHistoryUpdated` to listen for message updates from the Anam client.
  - **Returns**: The current `conversation` as an array of `{ sender, text }`.

- **`useStreamTimer.ts`**:
  - A countdown timer hook for managing streaming sessions.
  - **Functions**:
    - Decrements the timer every second and stops streaming when time reaches zero.
  - **Returns**: `[timeLeft, progressValue]`, where `progressValue` is the timer's progress as a percentage.

#### 5. **`utils/`**

- **`env.js`**: Handles environment variable loading and validation.
- **`errorHandler.ts`**: Centralized error handling utility.
- **`logger.ts`**: Provides logging functionality.
- **`types.ts`**: Contains TypeScript types and interfaces for error handling.

### Extending the Example

You can extend or modify the application by adding new views, introducing your own personas/scenarios. Contexts like `SettingsContext` and `AnamContext` provide centralized control over configurations and can be expanded for more advanced use cases.
