"use client";

import { useViewContext } from "@/contexts/ViewContext";
import { DemoView, DescriptionView, InitialView } from "@/app/_views";

const ViewRenderer = () => {
  const { currentView } = useViewContext();

  const renderView = () => {
    switch (currentView) {
      case "description":
        return <DescriptionView/>;
      case "demo":
        return <DemoView />;
      case "initial":
      default:
        return <InitialView />;
    }
  };

  return <>{renderView()}</>;
};

export default ViewRenderer;
