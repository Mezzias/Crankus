
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

  // Atributos
  const { data: stats, error: errorStats } = await supabase
    .from("stats")
    .select("*, tipos_stats(nombre)")
    .eq("personaje_id", personajeId);

  if (errorStats) {
    mostrarEstado("Error cargando atributos: " + errorStats.message, "error");
    return;
  }

  const atributosData = stats.map(s => ({
    tipo: s.tipos_stats.nombre,
    base: s.base,
    mundo: s.mundo,
    profesion: s.profesion,
    total: s.total
  }));

  const atributosColumns = [
    { key: "tipo", editable: false },
    { key: "base", editable: true },
    { key: "mundo", editable: true },
    { key: "profesion", editable: true },
    { key: "total", editable: false }
  ];

  renderRows("atributos-body", atributosData, atributosColumns);

  // Habilidades primarias
  const { data: primarias } = await supabase
    .from("habilidades_primarias")
    .select("*")
    .eq("personaje_id", personajeId);

  const habilidadesPrimariasColumns = [
    { key: "habilidad", editable: false },
    { key: "nivel", editable: true },
    { key: "bonus", editable: true }
  ];

  renderRows("habilidades-primarias-body", primarias, habilidadesPrimariasColumns);

  // Habilidades secundarias
  const { data: secundarias } = await supabase
    .from("habilidades_secundarias")
    .select("*")
    .eq("personaje_id", personajeId);

  const habilidadesSecundariasColumns = [
    { key: "habilidad", editable: false },
    { key: "nivel", editable: true },
    { key: "bonus", editable: true }
  ];

  renderRows("habilidades-secundarias-body", secundarias, habilidadesSecundariasColumns);

  // Implantes
  const { data: implantes } = await supabase
    .from("implantes_personaje")
    .select("*")
    .eq("personaje_id", personajeId);

  const implantesColumns = [
    { key: "implante_tipo", editable: false },
    { key: "dificultad", editable: false },
    { key: "datos_extra", editable: true },
    { key: "capacidades_extra", editable: true }
  ];

  renderRows("implantes-body", implantes, implantesColumns);

  // Experiencia
  const { data: experiencia } = await supabase
    .from("gasto_experiencia")
    .select("*")
    .eq("personaje_id", personajeId);

  const experienciaColumns = [
    { key: "habilidad_id", editable: false },
    { key: "tipo", editable: false },
    { key: "nivel", editable: false },
    { key: "experiencia", editable: false }
  ];

  renderRows("experiencia-body", experiencia, experienciaColumns);

  // Inventario
  const { data: inventario } = await supabase
    .from("inventario")
    .select("*")
    .eq("personaje_id", personajeId);

  const inventarioColumns = [
    { key: "item", editable: false },
    { key: "cantidad", editable: true },
    { key: "peso", editable: true },
    { key: "descripcion", editable: true }
  ];

  renderRows("inventario-body", inventario, inventarioColumns);

  mostrarEstado("Ficha cargada correctamente", "success");
}

document.getElementById("cargarBtn").addEventListener("click", cargarFicha);