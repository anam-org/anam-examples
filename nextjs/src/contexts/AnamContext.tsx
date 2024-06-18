'use client';
import {
  createClient,
  AnamClient,
  unsafe_createClientWithApiKey,
} from '@anam-ai/js-sdk';
import { createContext, useContext } from 'react';

const PERSONA_ID = process.env.NEXT_PUBLIC_PERSONA_ID;
const DISABLE_BRAINS = process.env.NEXT_PUBLIC_DISABLE_BRAINS === 'true';
const DISABLE_FILLER_PHRASES =
  process.env.NEXT_PUBLIC_DISABLE_FILLER_PHRASES === 'true';

interface AnamContextDetails {
  anamClient: AnamClient;
  sessionToken: string | undefined;
  apiKey: string | undefined;
}

const AnamContext = createContext<AnamContextDetails>({
  anamClient: createClient('dummy', {
    personaId: PERSONA_ID!,
    disableBrains: DISABLE_BRAINS,
    disableFillerPhrases: DISABLE_FILLER_PHRASES,
  }),
  sessionToken: undefined,
  apiKey: undefined,
});

type AnamContextProviderProps = {
  children: React.ReactNode;
  apiKey?: string;
  sessionToken?: string;
};

export const AnamContextProvider = ({
  children,
  apiKey,
  sessionToken,
}: AnamContextProviderProps) => {
  if (sessionToken) {
    const client = createClient(sessionToken, {
      personaId: PERSONA_ID!,
      disableBrains: DISABLE_BRAINS,
      disableFillerPhrases: DISABLE_FILLER_PHRASES,
    });
    return (
      <AnamContext.Provider
        value={{ anamClient: client, sessionToken, apiKey }}
      >
        {children}
      </AnamContext.Provider>
    );
  } else if (apiKey) {
    const client = unsafe_createClientWithApiKey(apiKey, {
      personaId: PERSONA_ID!,
      disableBrains: DISABLE_BRAINS,
      disableFillerPhrases: DISABLE_FILLER_PHRASES,
    });
    return (
      <AnamContext.Provider
        value={{ anamClient: client, sessionToken, apiKey }}
      >
        {children}
      </AnamContext.Provider>
    );
  } else {
    console.error('Anam Provider: No session token or API key provided');
    return (
      <AnamContext.Provider
        value={{
          anamClient: createClient('dummy', {
            personaId: PERSONA_ID!,
            disableBrains: DISABLE_BRAINS,
            disableFillerPhrases: DISABLE_FILLER_PHRASES,
          }),
          sessionToken: undefined,
          apiKey: undefined,
        }}
      >
        {children}
      </AnamContext.Provider>
    );
  }
};

export const useAnam = () => {
  const context = useContext(AnamContext);
  if (!context) {
    throw new Error('useAnam must be used within an AnamProvider');
  }
  return context;
};
