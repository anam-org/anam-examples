# Interview Me

Interview Me is an interactive web application that showcases the integration of the Anam SDK with Cloudflare Pages and Workers. This app simulates a job interview experience with an AI-powered digital human interviewer, helping users practice their interview skills in a realistic setting.

If you're implementing this yourself you'll have to replace the GPT call defined in callGPT (which provides feedback on the user's interview at the end of the conversation) with your own LLM call. I would also suggest removing the rate limit logic for debugging purposes. If you're looking for a more minimal example to get started, html_js/local_example is a better starting point.

## Features

- User input for interview context and job description
- AI-generated interview questions based on the provided context
- Video and audio streaming of a digital human conducting the interview
- Real-time interaction with the AI interviewer
- Cloudflare Pages for hosting the frontend
- Cloudflare Workers for backend functionality

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or later)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (for Cloudflare Workers)

You'll also need:

- A Cloudflare account
- An Anam API key

## Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/interview-me.git
   cd interview-me
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `wrangler.toml` file in the project root (if it doesn't exist) and add your Anam API key:

   ```toml
   [vars]
   ANAM_API_KEY = "your-anam-api-key-here"
   AZURE_GPT_API_KEY = "your-azure-gpt-api-key-here"
   ```

4. Build the JavaScript bundle:

   ```bash
   npm run build:js
   ```

5. Run the project locally using Wrangler:

   ```bash
   npm run start
   ```

   This command will start a local development server, typically at `http://localhost:8788`.

## Deployment

To deploy the Interview Me app to Cloudflare Pages:

1. Ensure you're logged in to your Cloudflare account in Wrangler:

   ```bash
   wrangler login
   ```

2. Build your project:

   ```bash
   npm run build:js
   ```

3. Deploy to Cloudflare Pages:

   ```bash
   wrangler pages deploy
   ```

   Follow the prompts to select your project and complete the deployment.

4. After deployment, Wrangler will provide you with a URL where your app is live.

## Configuration

- Update the `ANAM_API_KEY` in your Cloudflare Pages environment variables (production and preview) or in the `wrangler.toml` file. For local development, you can also add it to the `.dev.vars` file.
- Modify the `src/js/index.js` file to customize the interview logic or adjust the Anam SDK integration.
- You can update the `index.html` file to change the layout or add additional UI elements.

## How It Works

1. Users enter details about the job they're interviewing for and their background.
2. The app uses Cloudflare Workers to create a persona for the AI interviewer using the Anam API.
3. The digital human appears on screen and begins asking interview questions.
4. Users can interact with the AI interviewer in real-time, practicing their responses.
5. The interview can be ended at any time by the user.

## Troubleshooting

- If the video stream doesn't start, check your browser console for any error messages related to the Anam SDK.
- If you're having issues with the AI responses, verify that your Anam API key is correctly set in the Cloudflare environment.

## Contributing

Contributions to improve Interview Me are welcome! Please feel free to submit a Pull Request or open an Issue for any bugs or feature requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- This project uses the Anam SDK for AI-powered digital humans.
- Cloudflare Pages and Workers are used for hosting and serverless functions.
