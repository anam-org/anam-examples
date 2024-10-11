# Anam AI Sales Coach Example

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

   This will generate the personas required for the different scenarios in the application.

   Once the personas are generated, you will receive an output with persona IDs in the format:

   ```
   NEXT_PUBLIC_PERSONA_LANGUAGE_PERSONALITY=$PERSONA_ID
   ```

   Update your `.env` file with the generated persona IDs as shown below:

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

Key components are organized to facilitate quick navigation and extendibility.

### Project Structure

   ```
   sales-coach-avatar/
   ├── app/
   │   ├── api/
   │   │   └── session-token/
   │   │       └── route.ts
   │   ├── demo/
   │   │   ├── _views/
   │   │   │   └── Demo.tsx
   │   │   │   └── Settings.tsx
   │   │   └── page.tsx
   │   ├── _providers.tsx
   │   ├── layout.tsx
   │   └── page.tsx
   ├── components/
   │   ├── AudioPermissionsModal.tsx
   │   ├── AvatarContainer.tsx
   │   ├── ConversationPopUp.tsx
   │   ├── ConverstaionTracker.tsx
   │   ├── DemoSidebar.tsx
   │   └── NavigationSidebar.tsx
   ├── contexts/
   │   ├── AnamContext.tsx
   │   ├── AudioPermissionContext.tsx
   │   ├── SettingsContext.tsx
   │   └── ViewContext.tsx
   ├── utils/
   │   └── useFetchToken.js
   ├── utils/
   │   ├── env.js
   │   ├── errorHandler.ts
   │   ├── fetchSessionToken.ts
   │   ├── logger.ts
   │   └── types.ts
   └── ...
   ```

---

### Extending the Example

You can extend or modify the application by adding new views, introducing your own personas/scenarios. Contexts like `SettingsContext` and `AnamContext` provide centralized control over configurations and can be expanded for more advanced use cases.