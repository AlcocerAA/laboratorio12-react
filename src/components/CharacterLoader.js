import { useState } from "react";
import axios from "axios";
import { Card, Button, Spinner, Alert, ListGroup, Row, Col, Badge } from "react-bootstrap";

export default function CharacterLoader() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [page, setPage] = useState(1);

  const load = async (newPage = 1) => {
    setLoading(true);
    setErr(null);
    try {
      const res = await axios.get(`https://swapi.dev/api/people/?page=${newPage}`);
      setPeople(res.data.results || []);
      setPage(newPage);
    } catch (e) {
      setErr(e.message || "Error al cargar personajes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <Row className="align-items-center">
          <Col>
            <strong>CharacterLoader</strong> <Badge bg="secondary">Pasos 9–10</Badge>
          </Col>
          <Col className="text-end">
            <Button onClick={() => load(1)} disabled={loading}>
              {loading ? "Cargando..." : "Cargar Personajes"}
            </Button>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        {err && <Alert variant="danger">{err}</Alert>}
        {!loading && people.length > 0 && (
          <>
            <ListGroup className="mb-3">
              {people.map((p, i) => (
                <ListGroup.Item key={i}>
                  <div className="d-flex justify-content-between">
                    <span><strong>{p.name}</strong></span>
                    <small>
                      Altura: {p.height} | Masa: {p.mass} | Género: {p.gender}
                    </small>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" onClick={() => load(Math.max(1, page - 1))} disabled={loading || page <= 1}>
                ← Anterior
              </Button>
              <Button variant="outline-secondary" onClick={() => load(page + 1)} disabled={loading}>
                Siguiente →
              </Button>
              <span className="align-self-center">Página: {page}</span>
            </div>
          </>
        )}
        {loading && <Spinner animation="border" />}
      </Card.Body>
    </Card>
  );
}