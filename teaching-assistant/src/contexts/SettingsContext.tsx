"use client";

import constate from "constate";
import { useState } from "react";
import { useAnamContext } from "@/contexts";
import { useTheme } from "next-themes";
import { env } from "@/utils";

export type PersonaType = "friendly" | "professional" | "formal";
export type LanguageType = "french" | "spanish" | "german";

interface PersonaConfig {
  personaId: string;
}

const personaConfigurations: Record<
  LanguageType,
  Record<PersonaType, PersonaConfig>
> = {
  french: {
    friendly: { personaId: env.NEXT_PUBLIC_PERSONA_FRENCH_FRIENDLY },
    professional: { personaId: env.NEXT_PUBLIC_PERSONA_FRENCH_PROFESSIONAL },
    formal: { personaId: env.NEXT_PUBLIC_PERSONA_FRENCH_FORMAL },
  },
  spanish: {
    friendly: { personaId: env.NEXT_PUBLIC_PERSONA_SPANISH_FRIENDLY },
    professional: { personaId: env.NEXT_PUBLIC_PERSONA_SPANISH_PROFESSIONAL },
    formal: { personaId: env.NEXT_PUBLIC_PERSONA_SPANISH_FORMAL },
  },
  german: {
    friendly: { personaId: env.NEXT_PUBLIC_PERSONA_GERMAN_FRIENDLY },
    professional: { personaId: env.NEXT_PUBLIC_PERSONA_GERMAN_PROFESSIONAL },
    formal: { personaId: env.NEXT_PUBLIC_PERSONA_GERMAN_FORMAL },
  },
};

const useSettings = () => {
  const { setPersonaConfig } = useAnamContext();
  const { theme } = useTheme();

  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageType>("french");
  const [selectedPersona, setSelectedPersona] =
    useState<PersonaType>("friendly");

  const applyPersonaConfig = () => {
    const config = personaConfigurations[selectedLanguage][selectedPersona];
    setPersonaConfig(config);
  };

  return {
    selectedLanguage,
    setSelectedLanguage,
    selectedPersona,
    setSelectedPersona,
    isDarkMode: theme === "dark",
    applyPersonaConfig,
  };
};

export const [SettingsContextProvider, useSettingsContext] =
  constate(useSettings);
