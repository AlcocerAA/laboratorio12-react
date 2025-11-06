import { Card } from "react-bootstrap";

export default function StarWarsChrome(){
  return (
    <div className="mb-4">
      <h1 className="sw-title">STAR WARS — Holocron</h1>
      <p className="text-muted mb-3">
        SWAPI en vivo • Búsqueda en tiempo real • Lista en orden alfabético
      </p>

      {/* Crawl opcional para “wow effect” del profe */}
      <div className="crawl-wrap">
        <div className="crawl">
          <p>Hace mucho tiempo, en una galaxia muy, muy lejana...</p>
          <p>Un padawan del código construyó una interfaz para consultar
             el Archivo Jedi con la Fuerza de AJAX y la sabiduría de SWAPI.</p>
          <p>Que el orden alfabético te guíe. Que la UX te acompañe.</p>
        </div>
      </div>
    </div>
  );
}
