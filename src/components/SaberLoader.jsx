// src/components/SaberLoader.jsx
import React, { useEffect, useRef, useState } from "react";
import "./saber.css";

/**
 * Props:
 *  - active: boolean       -> visible (true) / oculto (false)
 *  - playOnce: boolean     -> el encendido solo la 1a vez que active=true (default true)
 *  - color: "blue" | "green" | "red" | "purple"
 *  - crossed: boolean      -> dos sables en X
 *  - size: "sm" | "md" | "lg"
 *  - className: string
 */
export default function SaberLoader({
  active = false,
  playOnce = true,
  color = "blue",
  crossed = false,
  size = "md",
  className = "",
}) {
  const [mode, setMode] = useState("static"); // "once" | "static"
  const playedRef = useRef(false);

  useEffect(() => {
    if (!active) return;
    if (playOnce && !playedRef.current) {
      setMode("once");
      playedRef.current = true;
      // luego de la duración del encendido, quedará en "static" (sin reiniciar)
      const t = setTimeout(() => setMode("static"), 900);
      return () => clearTimeout(t);
    }
    // si ya jugó, solo mostrar en static
    setMode("static");
  }, [active, playOnce]);

  const wrap = [
    "saber-wrap",
    size,
    crossed ? "crossed" : "",
    mode,                 // "once" o "static"
    active ? "visible" : "hidden", // control de visibilidad sin desmontar
    className,
  ].join(" ").trim();

  return (
    <div className={wrap} role="status" aria-label="Cargando con sable láser">
      {crossed ? (
        <>
          <Saber color={color} cls="left" />
          <Saber color="red" cls="right" />
        </>
      ) : (
        <Saber color={color} />
      )}
    </div>
  );
}

function Saber({ color = "blue", cls = "" }) {
  return (
    <div className={`saber ${color} ${cls}`}>
      <div className="hilt">
        <span className="ring" />
        <span className="emitter" />
      </div>
      <div className="blade">
        <span className="core" />
        <span className="glow" />
      </div>
    </div>
  );
}
