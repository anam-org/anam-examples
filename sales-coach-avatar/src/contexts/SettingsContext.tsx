"use client";

import constate from "constate";
import { useState } from "react";
import { useAnamContext } from "@/contexts";

export type ScenarioType =
  | "product_demo"
  | "negotiation"
  | "objection_handling"
  | "closing_deal"
  | "follow_up"
  | "customer_support";

/**
 * A mapping of scenario types to their corresponding scenario IDs.
 * This is used to map user-selected scenarios to persona configurations.
 */
export const scenarioIds: Record<ScenarioType, string> = {
  product_demo: "8c4af0ac-fbc1-4663-be3b-1fd6c7bf4f1f",
  negotiation: "db3e3034-b7d3-49a3-bc17-97750ba3f303",
  objection_handling: "a4788e42-46ab-4c1e-9d74-0245469c1f6a",
  closing_deal: "da6a5ae5-4c93-4ae3-848d-80d182f86019",
  follow_up: "c41b41f2-c8d8-437a-834b-c444974db4c7",
  customer_support: "5580786e-e277-4d3d-a8aa-fc675ee6b7a6",
};

/**
 * Custom hook to manage the application settings, including scenario selection and persona configuration.
 * and a function to apply the scenario's persona configuration.
 */
const useSettings = () => {
  const { setPersonaConfig } = useAnamContext();

  const [selectedScenario, setSelectedScenario] =
    useState<ScenarioType>("product_demo");

  const applyScenarioConfig = () => {
    const scenarioId = scenarioIds[selectedScenario];

    setPersonaConfig({
      personaId: scenarioId,
      disableBrains: false,
      disableFillerPhrases: true,
    });
  };

  return {
    selectedScenario,
    setSelectedScenario,
    applyScenarioConfig,
    scenarioIds,
  };
};

export const [SettingsContextProvider, useSettingsContext] =
  constate(useSettings);
