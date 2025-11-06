import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Spinner, Alert, ListGroup, Badge } from "react-bootstrap";

export default function CharacterList() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancel;
    setLoading(true);
    setErr(null);

    axios
      .get("https://swapi.dev/api/people/?page=1", {
        cancelToken: new axios.CancelToken(c => (cancel = c)),
      })
      .then(res => setPeople(res.data.results || []))
      .catch(e => setErr(e.message || "Error al cargar personajes"))
      .finally(() => setLoading(false));

    return () => cancel && cancel();
  }, []);

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <strong>Personajes de Star Wars</strong> <Badge bg="secondary">Paso 3</Badge>
      </Card.Header>
      <Card.Body>
        {loading && <Spinner animation="border" />}
        {err && <Alert variant="danger">{err}</Alert>}
        {!loading && !err && (
          <ListGroup>
            {people.map((p, i) => (
              <ListGroup.Item key={i}>
                <strong>{p.name}</strong> — Altura: {p.height} — Género: {p.gender}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
}
