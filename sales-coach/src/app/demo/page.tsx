"use client";

import { ViewContextProvider, useViewContext } from "@/contexts";
import { DemoView, DescriptionView, ScenariosView } from "./_views";

export default function DemoPage() {
  return (
    <ViewContextProvider>
      <Content />
    </ViewContextProvider>
  );
}

function Content() {
  const { currentView } = useViewContext();
  const renderView = () => {
    switch (currentView) {
      case "description":
        return <DescriptionView />;
      case "demo":
        return <DemoView />;
      case "scenarios":
      default:
        return <ScenariosView />;
    }
  };

  return <>{renderView()}</>;
}
