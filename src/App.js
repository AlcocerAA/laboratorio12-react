import React, { useState } from "react";
import { Container } from "react-bootstrap";
import PeopleSearch from "./components/PeopleSearch";
import StarWarsChrome from "./components/StarWarsChrome";
import Starfield from "./components/Starfield";
import "./App.css";

export default function App() {
  // “warpTick” lo dejamos por si luego quieres re-activar hiperespacio; hoy no se usa.
  const [warpTick] = useState(0);

  return (
    <>
      <Starfield /> {/* Fondo estelar con naves grandes */}
      <Container className="py-4">
        <StarWarsChrome />
        <PeopleSearch /* onBurst={() => setWarpTick(n=>n+1)} */ />
      </Container>
    </>
  );
}
