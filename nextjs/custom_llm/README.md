# Anam NextJS Example

This example disables the persona brains in combination with OpenAI API to demonstrate a custom LLM integration using the Anam SDK. The approach uses a callback function to receive updates to the conversation message history. After each message history update from the user the app makes a call to OpenAI in order to get a response for the persona. The app then uses the `talk()` command to instruct the persona to speak the response content.

## Running the example

### Install the dependencies

```bash
npm install
```

### Configure env variables

Copy the file `.env.example` and rename to `.env`. Replace `YOUR_API_KEY` with you API key from the Anam Lab.
Also replace `YOUR_OPEN_AI_API_KEY` with an Open AI API key in order to obtain responses based on user input.

### Run the project

```bash
npm run dev
```
