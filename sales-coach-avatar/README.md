# Anam AI Sales Coach Example

This application demonstrates how to integrate and utilize the Anam AI Avatar SDK to create an interactive sales training role-play experience. The application offers multiple scenarios and serves as a reference for engineers exploring the SDK's capabilities. For more in-depth information on the Anam client's capabilities, you can find its documentation [here](https://www.npmjs.com/package/@anam-ai/js-sdk).

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

   Once the personas are generated, you will receive an output with persona IDs. Update your `.env` file with the generated persona IDs as shown below:

   ```env
   ANAM_API_KEY=your_api_key
   NEXT_PUBLIC_BASE_URL=https://api.anam.ai

   # Persona IDs for each scenario
   NEXT_PUBLIC_PERSONA_JORDAN=generated_persona_id_for_jordan
   NEXT_PUBLIC_PERSONA_TAYLOR=generated_persona_id_for_taylor
   NEXT_PUBLIC_PERSONA_ALEX=generated_persona_id_for_alex
   NEXT_PUBLIC_PERSONA_JAMIE=generated_persona_id_for_jamie
   NEXT_PUBLIC_PERSONA_SAM=generated_persona_id_for_sam
   NEXT_PUBLIC_PERSONA_MORGAN=generated_persona_id_for_morgan
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
   │   │   │   └── ScenariosView.tsx
   │   │   │   └── DescriptionView.tsx
   │   │   │   └── DemoView.tsx
   │   │   └── page.tsx
   │   ├── _providers.tsx
   │   ├── layout.tsx
   │   └── page.tsx
   ├── components/
   │   └── PermissionsModal.tsx
   ├── contexts/
   │   ├── AnamContext.tsx
   │   ├── SettingsContext.tsx
   │   ├── VideoAudioPermissionContext.tsx
   │   └── ViewContext.tsx
   ├── utils/
   │   ├── env.js
   │   ├── errorHandler.ts
   │   ├── fetchSessionToken.ts
   │   ├── logger.ts
   │   └── types.ts
   └── ...
   ```

### Key Directories and Files

#### 1. **`app/`**

- **`_providers.tsx`**: Wraps the app with the necessary context providers (`AnamContext`, `SettingsContext`, etc.) for global state management.
- **`api/session-token/route.ts`**: Manages session token generation by communicating with the backend. The token is used to initialize and authenticate the Anam AI client.
- **`demo/`**:
  - **`page.tsx`**: The main entry point for the demo experience. It manages the lifecycle of different views (scenarios, descriptions, demo) using the `ViewContext`.
  - **`_views/`**:
    - **ScenariosView.tsx**: Displays a grid of selectable scenarios.
    - **DescriptionView.tsx**: Provides details about the selected scenario and instructions.
    - **DemoView.tsx**: Manages the interactive training session.

#### 2. **`components/`**

- **`PermissionsModal.tsx`**: Handles video/audio permissions, ensuring the required permissions are granted before starting a training session.

#### 3. **`contexts/`**

- **`AnamContext.tsx`**: Manages the initialization and integration with the Anam AI client, including handling session tokens and persona configurations.
- **`SettingsContext.tsx`**: Manages application settings such as the selected scenario and persona configuration.
- **`VideoAudioPermissionContext.tsx`**: Handles video/audio permissions and device management.
- **`ViewContext.tsx`**: Manages navigation between views without traditional routing, controlling the user flow between different stages of the demo.

#### 5. **`utils/`**

- **`env.js`**: Handles environment variable loading and validation.
- **`errorHandler.ts`**: Centralized error handling utility.
- **`fetchSessionToken.ts`**: Simple function for fetching session tokens.
- **`logger.ts`**: Provides logging functionality.
- **`types.ts`**: Contains TypeScript types and interfaces for error handling.

### Key Components in Action

- **`_views/`**: The components here manage the user interface and control the flow of the demo. Each view (Scenarios, Description, Demo) is modular, making it easy to extend or modify.

  - **ScenariosView**: Lists scenarios, updating the `SettingsContext` when a scenario is selected.
  - **DescriptionView**: Displays instructions for the selected scenario, using the `ViewContext` for navigation.
  - **DemoView**: The role-play session view, interacting with the Anam AI client through the `AnamContext`.

- **`AnamContext`**: Manages interaction with the Anam AI SDK, including initializing the client, updating personas, and handling client state.

- **`SettingsContext`**: Manages the application settings, including scenario selection and persona configuration.

- **`VideoAudioPermissionContext`**: Reusable context for managing video/audio permissions and device selection, which can be applied across the app.

### Extending the Example

You can extend or modify the application by adding new views, introducing your own personas/scenarios. Contexts like `SettingsContext` and `AnamContext` provide centralized control over configurations and can be expanded for more advanced use cases.
