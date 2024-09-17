"use client";

import { useState } from "react";
import { Box } from "@radix-ui/themes";
import InitialView from "./_views/initial";
import DescriptionView from "./_views/description";
import { DemoView } from "./_views/demo";

export default function HomePage() {
  const [currentView, setCurrentView] = useState("initial");

  const changeView = (view: string) => {
    setCurrentView(view);
  };

  return (
    <Box>
      {currentView === "initial" && <InitialView changeView={changeView} />}
      {currentView === "description" && (
        <DescriptionView changeView={changeView} />
      )}
      {currentView === "demo" && <DemoView changeView={changeView} />}
    </Box>
  );
}
