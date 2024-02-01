"use client"
import { useEffect, useState } from "react";

function useBigScreen() {
  const [width, setWidth] = useState(769);
  const breakpoint = 768;
  useEffect(() => {
    const handleResizeWindow = (): void => setWidth(window.innerWidth);
    handleResizeWindow();
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, []);
  return width > breakpoint;
}

export default useBigScreen;