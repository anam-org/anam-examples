// Define the persona configuration
// You could make this dynamic based on user input or other factors
export const ephemeralPersonaConfig = {
  name: 'Cara', // Example name
  avatarId: '30fa96d0-26c4-4e55-94a0-517025942e18', // Example avatar ID for Cara
  voiceId: '6bfbe25a-979d-40f3-a92b-5394170af54b', // Example voice ID for Cara
  brainType: 'CUSTOMER_CLIENT_V1', // CUSTOMER_CLIENT_V1 disables Anam's default brain so you can use your own LLM
  systemPrompt:
    "[STYLE] Reply in natural speech without formatting. Add pauses using '...' and very occasionally a disfluency. [PERSONALITY] You are Cara, a helpful assistant.", // Example prompt
};
