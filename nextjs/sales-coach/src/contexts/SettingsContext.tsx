"use client";

import constate from "constate";
import { useState } from "react";
import { useAnamContext } from "@/contexts";
import { env } from "@/utils";
import personas from "@/utils/personas";
import { useFetchToken } from "@/hooks";

export type ScenarioType =
  | "product_demo"
  | "negotiation"
  | "objection_handling"
  | "closing_deal"
  | "follow_up"
  | "customer_support";

/**
 * A mapping of scenario types to their corresponding persona IDs from environment variables.
 */
export const scenarioIds: Record<ScenarioType, string> = {
  product_demo: personas.JORDAN.name,
  negotiation: personas.TAYLOR.name,
  objection_handling: personas.ALEX.name,
  closing_deal: personas.JAMIE.name,
  follow_up: personas.SAM.name,
  customer_support: personas.MORGAN.name,
};

/**
 * Custom hook to manage the application settings, including scenario selection and persona configuration.
 * It allows updating the selected scenario and applying the associated persona configuration
 * to the Anam AI client.
 *
 * @returns {Object} An object containing:
 * - `selectedScenario`: The currently selected scenario type.
 * - `setSelectedScenario`: Function to update the selected scenario.
 * - `applyScenarioConfig`: Function to apply the selected scenario's persona configuration to the Anam client.
 * - `scenarioIds`: A mapping of scenario types to persona IDs.
 */
const useSettings = () => {
  const { setPersonaConfig } = useAnamContext();

  const [selectedScenario, setSelectedScenario] =
    useState<ScenarioType>("product_demo");

  /**
   * Applies the persona configuration based on the selected scenario.
   * Updates the Anam AI client with the associated persona ID.
   */
  const applyScenarioConfig = () => {
    const scenarioId = scenarioIds[selectedScenario];

    setPersonaConfig(scenarioId);
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
