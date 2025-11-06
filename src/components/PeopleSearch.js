import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { searchPeople } from "../api/swapi"; // ← ahora usa Akabab (all.json) y pagina en front
import {
  Card, Form, InputGroup, Button, Alert, ListGroup, Badge, Row, Col, Image
} from "react-bootstrap";

const TYPING_DELAY_MS = 300;
const PER_PAGE = 10;

/* ---------- Orden disponible ---------- */
const SORT_KEYS = [
  { key: "name",       label: "Nombre" },
  { key: "height",     label: "Altura" },
  { key: "mass",       label: "Masa" },
  { key: "birth_year", label: "Nacimiento" }, // usa p.born (Akabab) o p.birth_year (SWAPI)
];

function parseNum(v) {
  if (v == null) return NaN;
  const s = String(v).replace(/,/g, "").trim();
  if (s === "unknown" || s === "n/a") return NaN;
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}
function parseBirth(v) {
  const value = (v ?? "").toString().trim(); // "19BBY", "19 BBY", "19 ABY", etc.
  if (!value || value.toLowerCase() === "unknown" || value.toLowerCase() === "n/a") return { val: NaN };
  const m = value.match(/([0-9]*\.?[0-9]+)\s*(BBY|ABY)/i);
  if (!m) return { val: NaN };
  const num = Number(m[1]);
  return { val: m[2].toUpperCase() === "BBY" ? num : -num }; // BBY positivo, ABY negativo
}
function compare(a, b, { key, dir }) {
  const mul = dir === "desc" ? -1 : 1;

  if (key === "name") {
    return mul * a.name.localeCompare(b.name, "es", { sensitivity: "base" });
  }
  if (key === "height") {
    const na = parseNum(a.height), nb = parseNum(b.height);
    if (Number.isNaN(na) && Number.isNaN(nb)) return 0;
    if (Number.isNaN(na)) return 1;
    if (Number.isNaN(nb)) return -1;
    return mul * (na - nb);
  }
  if (key === "mass") {
    const na = parseNum(a.mass), nb = parseNum(b.mass);
    if (Number.isNaN(na) && Number.isNaN(nb)) return 0;
    if (Number.isNaN(na)) return 1;
    if (Number.isNaN(nb)) return -1;
    return mul * (na - nb);
  }
  if (key === "birth_year") {
    // Akabab trae "born", SWAPI trae "birth_year"
    const aa = parseBirth(a.born ?? a.birth_year);
    const bb = parseBirth(b.born ?? b.birth_year);
    if (Number.isNaN(aa.val) && Number.isNaN(bb.val)) return 0;
    if (Number.isNaN(aa.val)) return 1;
    if (Number.isNaN(bb.val)) return -1;
    return mul * (aa.val - bb.val);
  }
  return 0;
}

export default function PeopleSearch() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [results, setResults] = useState([]); // página actual
  const [count, setCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const [sortKey, setSortKey] = useState("name");
  const [sortDirAsc, setSortDirAsc] = useState(true);
  const sortConf = { key: sortKey, dir: sortDirAsc ? "asc" : "desc" };

  const pages = useMemo(() => Math.max(1, Math.ceil(count / PER_PAGE)), [count]);

  const timerRef = useRef(null);

  const doSearch = useCallback(async (q, p) => {
    setLoading(true);
    setErr("");
    try {
      // searchPeople ahora trae TODO desde Akabab (all.json) y devuelve paginado local
      const { results, count, next, previous } = await searchPeople({ query: q, page: p });
      setResults(results);
      setCount(count);
      setHasNext(Boolean(next));
      setHasPrev(Boolean(previous));
      // scroll suave al inicio de la lista
      window.requestAnimationFrame(() => {
        const el = document.querySelector(".sw-card");
        el && el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (e) {
      setErr(e?.message ?? "Error al buscar");
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce de tecleo + cambio de página
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doSearch(query, page), TYPING_DELAY_MS);
    return () => timerRef.current && clearTimeout(timerRef.current);
  }, [query, page, doSearch]);

  const onChangeQuery = (e) => { setPage(1); setQuery(e.target.value); };
  const onKeyDown = (e) => { if (e.key === "Enter") { e.preventDefault(); doSearch(query, 1); } };
  const reset = () => { setQuery(""); setPage(1); };

  // Orden: se aplica a la página mostrada (puedes moverlo a toda la colección si prefieres)
  const sorted = useMemo(() => {
    const arr = results.slice();
    arr.sort((a, b) => compare(a, b, sortConf));
    return arr;
  }, [results, sortConf]);

  return (
    <Card className="shadow-sm sw-card">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>
          <strong className="sw-title" style={{ fontSize: "1.2rem" }}>Archivo Jedi</strong>{" "}
          <Badge bg="secondary">
            {SORT_KEYS.find(k => k.key === sortKey)?.label} ({sortDirAsc ? "Asc" : "Desc"})
          </Badge>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Form.Select
            size="sm"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            aria-label="Cambiar campo de orden"
          >
            {SORT_KEYS.map(({ key, label }) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </Form.Select>
          <Form.Check
            type="switch"
            id="order-dir"
            label={sortDirAsc ? "Asc" : "Desc"}
            checked={sortDirAsc}
            onChange={(e) => setSortDirAsc(e.target.checked)}
          />
          <Badge bg="dark" className="ms-2">Total: {count}</Badge>
          <Button variant="outline-secondary" size="sm" onClick={reset}>Reset</Button>
        </div>
      </Card.Header>

      <Card.Body>
        <Form onSubmit={(e) => e.preventDefault()} className="mb-3">
          <InputGroup>
            <Form.Control
              value={query}
              onChange={onChangeQuery}
              onKeyDown={onKeyDown}
              placeholder="Busca un personaje (ej: luke, vader, leia, yoda...)"
              aria-label="Buscar personaje de Star Wars"
            />
            <InputGroup.Text>⚡ {TYPING_DELAY_MS}ms</InputGroup.Text>
          </InputGroup>
        </Form>

        {err && <Alert variant="danger" className="mb-3">{err}</Alert>}
        {loading && <div className="text-center text-muted small mb-2">Cargando…</div>}
        {!loading && sorted.length === 0 && !err && (
          <div className="text-muted">Sin resultados. Prueba con otro término.</div>
        )}

        <ListGroup className="mb-3">
          {sorted.map((p, idx) => (
            <ListGroup.Item key={`${p.name}-${idx}`} className="sw-person media">
              <Row className="align-items-center gy-2">
                <Col xs="auto">
                  <div className="sw-avatar">
                    <Image
                      src={p.image /* <- viene directo de Akabab */}
                      alt={p.name}
                      onError={(e) => {
                        e.currentTarget.src = "https://starwars-visualguide.com/assets/img/placeholder.jpg";
                      }}
                      rounded
                      width={70}
                      height={70}
                    />
                  </div>
                </Col>
                <Col md={4}>
                  <strong className="sw-name">{p.name}</strong>
                </Col>
                <Col md={7} className="text-muted small">
                  <span className="sw-blue">Altura</span>: {p.height ?? "?"} &nbsp;|&nbsp;
                  <span className="sw-red">Masa</span>: {p.mass ?? "?"} &nbsp;|&nbsp;
                  Género: {p.gender ?? "unknown"} &nbsp;|&nbsp;
                  Nacimiento: {p.born ?? p.birth_year ?? "unknown"}
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>

        <div className="d-flex justify-content-between align-items-center">
          <div className="text-muted">Página {page} de {pages}</div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              disabled={!hasPrev || loading || page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ← Anterior
            </Button>
            <Button
              variant="outline-secondary"
              disabled={!hasNext || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente →
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
    