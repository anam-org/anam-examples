"use client ";

import { useEffect } from "react";

/**
 * A hook that sets the `--vh` CSS variable to represent 1% of the viewport height,
 * adjusting for mobile browsers that may hide address bars and other UI elements.
 *
 * It updates the value on window resize to ensure accuracy.
 */
export function useViewportHeight() {
  useEffect(() => {
    /**
     * Sets the `--vh` CSS variable to 1% of the current viewport height.
     */
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVh();

    // Update the value of `--vh` on window resize.
    window.addEventListener("resize", setVh);

    // Cleanup the event listener when the component unmounts.
    return () => {
      window.removeEventListener("resize", setVh);
    };
  }, []);
}
