# Api-server

This is the backend required to run several app which use the Anam SDK and API. This server allows
secure session token generation as well as persona creation. It uses cloudflare workers & wrangler for deployment.

# Dev

To run the server locally, you will need to install wrangler and have a cloudflare account.

```bash
npx wrangler dev
```

# Deploy

```bash
npx wrangler deploy
```

# Endpoints

## GET /get_session_token

This endpoint generates a session token for the user. The token is used to authenticate the user with the Anam API.

### Example

```bash
curl -X GET http://localhost:8787/get_session_token
```

## POST /create_persona

This endpoint creates a persona for the user. The persona is used to store user data in the Anam API.

### Example

```bash
curl -X POST http://localhost:8787/create_persona \                                                                                                                                                        ok | base py | 16:47:24
-H "Content-Type: application/json" \
-d '{
  "name": "DummmyPersonaName",
  "description": "A test AI assistant for dummy data",
  "personaPreset": "leo_desk",
  "systemPrompt": "You are a test AI assistant created for demonstration purposes.",
  "personality": "You are helpful but always remind the user that you are a test assistant.",
  "fillerPhrases": ["hmm", "let me think", "processing", "beep boop"],
  "userInput": "This is a test input for the dummy persona."
```
