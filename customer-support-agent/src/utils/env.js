import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    ANAM_API_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_PERSONA_ID: z.string(),
    NEXT_PUBLIC_BASE_URL: z.string().url(),
    NEXT_PUBLIC_DISABLE_BRAINS: z.boolean(),
    NEXT_PUBLIC_DISABLE_FILLER_PHRASES: z.boolean(),
  },
  runtimeEnv: {
    ANAM_API_KEY: process.env.ANAM_API_KEY,
    NEXT_PUBLIC_PERSONA_ID: process.env.NEXT_PUBLIC_PERSONA_ID,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_DISABLE_BRAINS:
      process.env.NEXT_PUBLIC_DISABLE_BRAINS === "true",
    NEXT_PUBLIC_DISABLE_FILLER_PHRASES:
      process.env.NEXT_PUBLIC_DISABLE_FILLER_PHRASES === "true",
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
