import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Environment configuration using `createEnv` from `@t3-oss/env-nextjs`.
 *
 * This configuration validates environment variables both on the server and client.
 * It uses `zod` to enforce type and format validations for the variables.
 *
 * - **server**: Contains sensitive server-side environment variables.
 * - **client**: Contains environment variables exposed to the client-side, validated for correct types.
 * - **runtimeEnv**: Defines the actual runtime values for the environment variables.
 * - **skipValidation**: If `SKIP_ENV_VALIDATION` is set to `true`, environment validation will be skipped.
 * - **emptyStringAsUndefined**: If set to `true`, treats empty string values as `undefined`.
 */
export const env = createEnv({
  server: {
    ANAM_API_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_DEFAULT_PERSONA_ID: z.string(),
    NEXT_PUBLIC_PERSONA_FRENCH_FRIENDLY: z.string(),
    NEXT_PUBLIC_PERSONA_FRENCH_PROFESSIONAL: z.string(),
    NEXT_PUBLIC_PERSONA_FRENCH_FORMAL: z.string(),
    NEXT_PUBLIC_PERSONA_SPANISH_FRIENDLY: z.string(),
    NEXT_PUBLIC_PERSONA_SPANISH_PROFESSIONAL: z.string(),
    NEXT_PUBLIC_PERSONA_SPANISH_FORMAL: z.string(),
    NEXT_PUBLIC_PERSONA_GERMAN_FRIENDLY: z.string(),
    NEXT_PUBLIC_PERSONA_GERMAN_PROFESSIONAL: z.string(),
    NEXT_PUBLIC_PERSONA_GERMAN_FORMAL: z.string(),
    NEXT_PUBLIC_BASE_URL: z.string().url(),
    NEXT_PUBLIC_DISABLE_BRAINS: z.boolean(),
    NEXT_PUBLIC_DISABLE_FILLER_PHRASES: z.boolean(),
  },
  runtimeEnv: {
    ANAM_API_KEY: process.env.ANAM_API_KEY,
    NEXT_PUBLIC_DEFAULT_PERSONA_ID: process.env.NEXT_PUBLIC_DEFAULT_PERSONA_ID,
    NEXT_PUBLIC_PERSONA_FRENCH_FRIENDLY:
      process.env.NEXT_PUBLIC_PERSONA_FRENCH_FRIENDLY,
    NEXT_PUBLIC_PERSONA_FRENCH_PROFESSIONAL:
      process.env.NEXT_PUBLIC_PERSONA_FRENCH_PROFESSIONAL,
    NEXT_PUBLIC_PERSONA_FRENCH_FORMAL:
      process.env.NEXT_PUBLIC_PERSONA_FRENCH_FORMAL,
    NEXT_PUBLIC_PERSONA_SPANISH_FRIENDLY:
      process.env.NEXT_PUBLIC_PERSONA_SPANISH_FRIENDLY,
    NEXT_PUBLIC_PERSONA_SPANISH_PROFESSIONAL:
      process.env.NEXT_PUBLIC_PERSONA_SPANISH_PROFESSIONAL,
    NEXT_PUBLIC_PERSONA_SPANISH_FORMAL:
      process.env.NEXT_PUBLIC_PERSONA_SPANISH_FORMAL,
    NEXT_PUBLIC_PERSONA_GERMAN_FRIENDLY:
      process.env.NEXT_PUBLIC_PERSONA_GERMAN_FRIENDLY,
    NEXT_PUBLIC_PERSONA_GERMAN_PROFESSIONAL:
      process.env.NEXT_PUBLIC_PERSONA_GERMAN_PROFESSIONAL,
    NEXT_PUBLIC_PERSONA_GERMAN_FORMAL:
      process.env.NEXT_PUBLIC_PERSONA_GERMAN_FORMAL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_DISABLE_BRAINS:
      process.env.NEXT_PUBLIC_DISABLE_BRAINS === "true",
    NEXT_PUBLIC_DISABLE_FILLER_PHRASES:
      process.env.NEXT_PUBLIC_DISABLE_FILLER_PHRASES === "true",
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
