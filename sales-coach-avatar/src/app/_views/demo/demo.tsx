import { Grid } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { LeftPanel } from "./components/LeftPanel";
import { RightPanel } from "./components/RightPanel";

export function DemoView({
  changeView,
}: {
  changeView: (view: string) => void;
}) {
  const [showFullText, setShowFullText] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const toggleTextVisibility = () => {
    setShowFullText((prevState) => !prevState);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Grid columns="2fr 1fr" rows="1">
      <LeftPanel secondsElapsed={secondsElapsed} />
      <RightPanel
        showFullText={showFullText}
        toggleTextVisibility={toggleTextVisibility}
        changeView={changeView}
      />
    </Grid>
  );
}
