
// 👇 CONFIGURA AQUÍ TU PROYECTO
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { renderRows } from "./renderRows.js";

console.log("✅ main.js cargado y módulo ESM importado");

const supabaseUrl = "https://jeoivdvhdxzqxnbprpim.supabase.co"; // tu URL Supabase
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Implb2l2ZHZoZHh6cXhuYnBycGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTAxOTMsImV4cCI6MjA2NzI4NjE5M30.xjUuKrJlAYpWN4V98TMuC3In5oAUuoa1Sg5VzmOr_hs"; // tu clave pública
const supabase = createClient(supabaseUrl, supabaseKey); 

console.log("✅ Supabase cliente creado:", supabase);

const personajeId = "crankus_001";
const statusEl = document.getElementById("status-message");
const mostrarEstado = (mensaje, tipo = "info") => {
  statusEl.textContent = mensaje;
  statusEl.className = tipo;
};

async function cargarFicha() {
  mostrarEstado("Cargando ficha…");

  // 🔷 Atributos
  await cargarSeccion(
    "stats",
    "atributos-body",
    [
      { key: "tipo", editable: false },
      { key: "base", editable: true },
      { key: "mundo", editable: true },
      { key: "profesion", editable: true },
      { key: "total", editable: false }
    ],
    row => ({
      tipo: row.tipos_stats.nombre,
      base: row.base,
      mundo: row.mundo,
      profesion: row.profesion,
      total: row.total
    }),
    "*, tipos_stats(nombre)"
  );

  // 🔷 Habilidades primarias
  await cargarSeccion(
    "habilidades_primarias",
    "habilidades-primarias-body",
    [
      { key: "habilidad", editable: false },
      { key: "nivel", editable: true },
      { key: "bonus", editable: true }
    ]
  );

  // 🔷 Habilidades secundarias
  await cargarSeccion(
    "habilidades_secundarias",
    "habilidades-secundarias-body",
    [
      { key: "habilidad", editable: false },
      { key: "nivel", editable: true },
      { key: "bonus", editable: true }
    ]
  );

  // 🔷 Implantes
  await cargarSeccion(
    "implantes_personaje",
    "implantes-body",
    [
      { key: "implante_tipo", editable: false },
      { key: "dificultad", editable: false },
      { key: "datos_extra", editable: true },
      { key: "capacidades_extra", editable: true }
    ]
  );

  // 🔷 Experiencia
  await cargarSeccion(
    "gasto_experiencia",
    "experiencia-body",
    [
      { key: "habilidad_id", editable: false },
      { key: "tipo", editable: false },
      { key: "nivel", editable: false },
      { key: "experiencia", editable: false }
    ]
  );

  // 🔷 Inventario
  await cargarSeccion(
    "inventario",
    "inventario-body",
    [
      { key: "item", editable: false },
      { key: "cantidad", editable: true },
      { key: "peso", editable: true },
      { key: "descripcion", editable: true }
    ]
  );

  mostrarEstado("Ficha cargada correctamente", "success");
}

async function cargarSeccion(tabla, tbodyId, columns, transform = r => r, select = "*") {
  const tbody = document.getElementById(tbodyId);
  tbody.innerHTML = "";

  const { data, error } = await supabase
    .from(tabla)
    .select(select)
    .eq("personaje_id", personajeId);

  if (error) {
    mostrarEstado(`Error en ${tabla}: ${error.message}`, "error");
    return;
  }

  const filas = data.map((row, idx) => {
    const datosFila = transform(row);
    return createRow(datosFila, columns, idx);
  });

  filas.forEach(fila => tbody.appendChild(fila));
}

document.getElementById("cargarBtn").addEventListener("click", cargarFicha);