'use client';
import { createClient, AnamClient } from '@anam-ai/js-sdk';
import { createContext, useContext } from 'react';
interface AnamContextDetails {
  anamClient: AnamClient | undefined;
  sessionToken: string | undefined;
}

const AnamContext = createContext<AnamContextDetails>({
  anamClient: undefined,
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
          anamClient: undefined,
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
  return context;
};
