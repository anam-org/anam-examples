"use client";

import { useViewContext } from "@/contexts/ViewContext";
import {
  SettingsView,
  DemoView,
  DescriptionView,
  InitialView,
} from "@/app/_views";

export const ViewRenderer = () => {
  const { currentView } = useViewContext();

  const renderView = () => {
    switch (currentView) {
      case "settings":
        return <SettingsView />;
      case "description":
        return <DescriptionView />;
      case "demo":
        return <DemoView />;
      case "initial":
      default:
        return <InitialView />;
    }
  };

  return <>{renderView()}</>;
};
