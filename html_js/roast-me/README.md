# Roast Me

Roast Me is a fun, interactive web application that demonstrates the integration of the Anam SDK with Cloudflare Pages and Workers. This app allows users to input information about themselves and receive a humorous "roast" from an AI-powered digital human.

If you're implementing this yourself I would suggest removing the rate limit logic for debugging purposes. If you're looking for a more minimal example to get started, html_js/local_example is a better starting point.

## Features

- User input for personal information
- AI-generated roasts using the Anam SDK
- Video and audio streaming of a digital human delivering the roast
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
   git clone https://github.com/your-repo/roast-me.git
   cd roast-me
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `wrangler.toml` file in the project root (if it doesn't exist) and add your Anam API key:
   ```toml
   [vars]
   ANAM_API_KEY = "your-anam-api-key-here"
   ```

4. Build the JavaScript bundle:
   ```bash
   npm run build:js
   ```

5. Run the project locally using Wrangler:
   ```bash
   wrangler pages dev
   ```

   This command will start a local development server, typically at `http://localhost:8788`.

## Deployment

To deploy the Roast Me app to Cloudflare Pages:

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
- Modify the `src/js/index.js` file to customize the roast generation logic or adjust the Anam SDK integration.

## Troubleshooting

- If you encounter CORS issues, ensure your Cloudflare Workers are properly configured to handle CORS.
- Check the browser console and Cloudflare Workers logs for any error messages.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
