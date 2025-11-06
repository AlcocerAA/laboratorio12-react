// src/api/swapi.js
export async function searchPeople({ query = "", page = 1 }) {
  const res = await fetch("https://akabab.github.io/starwars-api/api/all.json");
  if (!res.ok) throw new Error("No se pudo obtener personajes");

  const all = await res.json();

  // Filtra por nombre (case-insensitive)
  const filtered = all.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  // Pagina localmente (10 por página)
  const perPage = 10;
  const start = (page - 1) * perPage;
  const paged = filtered.slice(start, start + perPage);

  return {
    results: paged,
    count: filtered.length,
    next: start + perPage < filtered.length,
    previous: page > 1
  };
}
