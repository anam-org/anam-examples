"use client";

import constate from "constate";
import { useState } from "react";
import { useAnamContext } from "@/contexts";
import { useTheme } from "next-themes";

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
    friendly: { personaId: "7aff1f21-72e9-4641-b3fe-e9f385180985" },
    professional: { personaId: "7cb494c5-2538-4475-a89e-b9db74b7ae87" },
    formal: { personaId: "72141678-3755-4412-a4d8-e794fc5c186e" },
  },
  spanish: {
    friendly: { personaId: "6bc245b1-a340-409b-a5ae-a6e3af9f42c4" },
    professional: { personaId: "deeec82e-7b99-4676-b553-0b220638fdf5" },
    formal: { personaId: "91e0b3c8-a517-4a28-b183-1f31d9c257ab" },
  },
  german: {
    friendly: { personaId: "037b1bef-cde7-4a76-90dd-5f82895e3d3b" },
    professional: { personaId: "5b068a7f-a7c3-4f76-9f43-6b52750f0ca9" },
    formal: { personaId: "751ca11e-79ad-446b-b08e-24741688e37f" },
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
