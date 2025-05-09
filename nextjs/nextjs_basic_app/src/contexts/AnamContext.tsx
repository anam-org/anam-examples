'use client';
import { createClient, AnamClient } from '@anam-ai/js-sdk';
import { createContext, useContext } from 'react';

type AnamContextValue =
  | { anamClient: AnamClient; sessionToken: string }
  | { anamClient: null; sessionToken: undefined };

const AnamContext = createContext<AnamContextValue>({
  anamClient: null,
  sessionToken: undefined,
});

type AnamContextProviderProps = {
  children: React.ReactNode;
  sessionToken?: string;
};

export const AnamContextProvider = ({
  children,
  sessionToken,
}: AnamContextProviderProps) => {
  if (sessionToken) {
    const client = createClient(sessionToken);
    return (
      <AnamContext.Provider value={{ anamClient: client, sessionToken }}>
        {children}
      </AnamContext.Provider>
    );
  } else {
    console.error('Anam Provider: No session token provided');
    return (
      <AnamContext.Provider
        value={{
          anamClient: null,
          sessionToken: undefined,
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
  if (context.anamClient === null) {
    throw new Error(
      'AnamProvider: anamClient is null. Ensure AnamContextProvider receives a valid session token.',
    );
  }
  return context;
};
