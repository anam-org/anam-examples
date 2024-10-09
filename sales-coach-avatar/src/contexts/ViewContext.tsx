"use client";

import constate from "constate";
import { useState } from "react";

const useView = () => {
  const [currentView, setCurrentView] = useState("scenarios");
  const changeView = (view: string) => setCurrentView(view);
  return { currentView, changeView };
};

export const [ViewContextProvider, useViewContext] = constate(useView);
