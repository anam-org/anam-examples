# Anam NextJS Example

This example demonstrates integrating the Anam JS SDK into a NextJS 14 project.
The project uses the NextJS App Router layout and creates the Anam client as part of a context provider.
The Anam client is initialised with a session token which is obtained by exchanging the API key for a token on the server side when the root layout is requested.

The example also shows use of callback functions and demonstrates the talk command.

## Running the example

### Install the dependencies

```bash
npm install
```

### Configure env variables

Copy the file `.env.example` and rename to `.env`. Replace `YOUR_API_KEY` with you API key and `YOUR_PERSONA_ID` with your chosen persona id.

### Run the project

```bash
npm run dev
```

## Additional configuration

Run You can also set the boolean values `NEXT_PUBLIC_DISABLE_BRAINS` and `NEXT_PUBLIC_DISABLE_FILLER_PHRASES` in your `.env` file. These options will be passed to the Anam client on creation.

## Talk command

When interacting with a persona you can click the 'show chat' button to display the text history of the current conversation (right hand panel). The left hand panel allows you to enter text which gets passed to the SDK `talk()` command. You can use this section to try out different talk commands.
