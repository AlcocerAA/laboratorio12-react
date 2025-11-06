import React, { useEffect, useState } from "react";
import "./starfield.css";

/** Overlay que muestra un burst corto tipo "hiperespacio" */
export default function HyperspaceOverlay({ trigger }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    setOn(true);
    const t = setTimeout(() => setOn(false), 650);
    return () => clearTimeout(t);
  }, [trigger]);

  return <div className={`hyperspace ${on ? "on" : ""}`} aria-hidden />;
}
