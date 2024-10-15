"use client";

import constate from "constate";
import { useState } from "react";

/**
 * Custom hook to manage the current view state of the application.
 * It tracks which view is active and provides a function to change the view.
 *
 * @returns {Object} An object containing:
 * - `currentView`: The name of the current view.
 * - `changeView`: Function to change the current view.
 */
const useView = () => {
  const [currentView, setCurrentView] = useState("Demo");

  /**
   * Updates the current view state to the provided view name.
   *
   * @param {string} view - The name of the view to switch to.
   */
  const changeView = (view: string) => setCurrentView(view);

  return { currentView, changeView };
};

export const [ViewContextProvider, useViewContext] = constate(useView);