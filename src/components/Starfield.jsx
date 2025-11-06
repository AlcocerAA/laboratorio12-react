import React from "react";
import "./starfield.css";

export default function Starfield() {
  return (
    <div className="sw-sky" aria-hidden="true" role="presentation">
      {/* Capas de estrellas (parallax) */}
      <div className="sw-stars layer1" />
      <div className="sw-stars layer2" />
      <div className="sw-stars layer3" />

      {/* Nebulosas suaves */}
      <div className="sw-nebula" />

      {/* Estrella de la Muerte */}
      <DeathStar />

      {/* (Opcional) Cometas sutiles */}
      <div className="sw-comet c1" />
      <div className="sw-comet c2" />
    </div>
  );
}

function DeathStar() {
  return (
    <div className="deathstar-wrap">
      {/* anillo orbital */}
      <div className="ds-orbit" />
      {/* la estrella */}
      <svg className="deathstar" viewBox="0 0 300 300" aria-label="Estrella de la Muerte">
        {/* cuerpo */}
        <defs>
          <radialGradient id="dsBody" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#cfd6dd" />
            <stop offset="60%" stopColor="#9aa3ad" />
            <stop offset="100%" stopColor="#6d7783" />
          </radialGradient>
          <linearGradient id="dsTrench" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#606a76" />
            <stop offset="100%" stopColor="#4c5460" />
          </linearGradient>
        </defs>

        <g>
          <circle cx="150" cy="150" r="140" fill="url(#dsBody)" />
          {/* hemisferio sombreado */}
          <path
            d="M10,150a140,140 0 0,0 280,0"
            fill="rgba(0,0,0,0.12)"
          />
          {/* trinchera ecuatorial */}
          <rect x="15" y="140" width="270" height="20" fill="url(#dsTrench)" opacity="0.9" />
          {/* superláser */}
          <g className="ds-superlaser">
            <circle cx="95" cy="95" r="40" fill="#545e69" />
            <circle cx="95" cy="95" r="30" fill="#6c7783" />
            <circle cx="95" cy="95" r="10" fill="#a4adb8" />
            <circle cx="95" cy="95" r="5"  fill="#e7edf4" />
          </g>
          {/* paneles/placas (líneas) */}
          <g stroke="rgba(0,0,0,0.25)" strokeWidth="1">
            <line x1="150" y1="12"  x2="150" y2="288" />
            <line x1="30"  y1="150" x2="270" y2="150" />
            <line x1="60"  y1="60"  x2="240" y2="60"  />
            <line x1="60"  y1="240" x2="240" y2="240" />
            <line x1="40"  y1="110" x2="260" y2="110" />
            <line x1="40"  y1="190" x2="260" y2="190" />
          </g>
        </g>
      </svg>
    </div>
  );
}