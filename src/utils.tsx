import React, { useState, useEffect } from "react";

const getHeight = () =>
  window.innerHeight ||
  document.body.clientHeight ||
  document.documentElement.clientHeight;

/**
 * Get height on resize
 */
export const hookHeight = () => {
  const [height, setHeight] = useState(getHeight());

  // Get height on init
  useEffect(() => {
    getHeight();
  }, []);

  useEffect(() => {
    const listenToResizeEvent = () => {
      setHeight(getHeight());
    };

    window.addEventListener("resize", listenToResizeEvent);

    return () => {
      window.removeEventListener("resize", listenToResizeEvent);
    };
  }, []);

  return height;
};
