"use client";

import { useState, useEffect, useCallback, RefObject } from "react";

/**
 * A hook that returns the width and height of a referenced HTML element.
 * - `width` {number}: The current width of the element.
 * - `height` {number}: The current height of the element.
 */
export function useElementSize<T extends HTMLElement = HTMLElement>(
  elementRef: RefObject<T>,
) {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  /**
   * Updates the size of the element by reading the offsetWidth and offsetHeight.
   */
  const updateSize = useCallback(() => {
    if (elementRef.current) {
      const { offsetWidth, offsetHeight } = elementRef.current;
      setSize({ width: offsetWidth, height: offsetHeight });
    }
  }, [elementRef]);

  // Initializes size and sets up the resize event listener when the component mounts.
  useEffect(() => {
    if (elementRef.current) {
      updateSize();

      // Listen to window resize events and update the size accordingly.
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }
  }, [elementRef, updateSize]);

  return size;
}
