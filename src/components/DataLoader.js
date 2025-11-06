import { useState } from "react";
import axios from "axios";
import { Card, Button, Form, Spinner, Alert } from "react-bootstrap";
import { pretty } from "../utils/prettyJson";

export default function DataLoader() {
  const [url, setUrl] = useState("https://swapi.dev/api/planets/?page=1");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    setData(null);
    try {
      const res = await axios.get(url);
      setData(res.data);
    } catch (e) {
      setErr(e.message || "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <strong>DataLoader</strong> — Carga cualquier endpoint <em>(Pasos 6–8)</em>
      </Card.Header>
      <Card.Body>
        <Form
          onSubmit={e => {
            e.preventDefault();
            load();
          }}
        >
          <Form.Group className="mb-2">
            <Form.Label>URL</Form.Label>
            <Form.Control
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://..."
            />
          </Form.Group>
          <Button type="submit" disabled={loading}>
            {loading ? "Cargando..." : "Cargar datos"}
          </Button>
        </Form>
        <div className="mt-3">
          {loading && <Spinner animation="border" />}
          {err && <Alert variant="danger">{err}</Alert>}
          {data && (
            <pre
              style={{
                background: "#0b0b0b10",
                borderRadius: 8,
                padding: 12,
                maxHeight: 320,
                overflow: "auto",
              }}
            >
              {pretty(data)}
            </pre>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}