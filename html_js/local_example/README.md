# HTML and JavaScript Anam SDK Example

This example shows the most basic Anam SDK integration with plain JavaScript, HTML and using your API directly in the client.
Note that this approach is unsafe for production use cases as the API key is exposed to the client browser.

## Running the example

Install the dependencies

```bash
npm install
```

Open the file `src/js/main.js` and replace `YOUR_API_KEY_HERE` with your API key. Also replace `PERSONA_ID_HERE` with the ID of the persona you wish to use. Save the file and build the JavaScript bundle with the command.

```bash
npm run build:js
```

Run the example

```bash
npm run serve
```
