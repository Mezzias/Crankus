
// 👇 CONFIGURA AQUÍ TU PROYECTO
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

console.log("✅ main.js cargado y módulo ESM importado");

const supabaseUrl = "https://jeoivdvhdxzqxnbprpim.supabase.co"; // tu URL Supabase
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Implb2l2ZHZoZHh6cXhuYnBycGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTAxOTMsImV4cCI6MjA2NzI4NjE5M30.xjUuKrJlAYpWN4V98TMuC3In5oAUuoa1Sg5VzmOr_hs"; // tu clave pública
const supabase = createClient(supabaseUrl, supabaseKey); 

console.log("✅ Supabase cliente creado:", supabase);

const personajeId = "crankus_001";
const atributosContainer = document.getElementById("atributos-container");
const statusEl = document.getElementById("status-message");

let tiposStats = {};

function mostrarEstado(mensaje, tipo = "info") {
    statusEl.textContent = mensaje;
    statusEl.className = tipo;
}

async function cargarFicha() {
    console.log("📥 Cargando ficha…");
    mostrarEstado("Cargando ficha…");

    const { data: tipos, error: errorTipos } = await supabase.from("tipos_stats").select("*");
    console.log("🎯 tipos_stats:", tipos, errorTipos);

    if (errorTipos) {
        mostrarEstado("Error cargando tipos: " + errorTipos.message, "error");
        return;
    }

    tiposStats = {};
    atributosContainer.innerHTML = "";

    for (const tipo of tipos) {
        tiposStats[tipo.id] = tipo.nombre;

        const div = document.createElement("div");
        div.innerHTML = `
            <label>${tipo.nombre}</label>
            <input type="number" id="stat-${tipo.id}" value="0">
        `;
        atributosContainer.appendChild(div);
    }

    const { data: stats, error: errorStats } = await supabase
        .from("stats")
        .select("*")
        .eq("personaje_id", personajeId);

    console.log("🎯 stats:", stats, errorStats);

    if (errorStats) {
        mostrarEstado("Error cargando stats: " + errorStats.message, "error");
        return;
    }

    for (const stat of stats) {
        const input = document.getElementById(`stat-${stat.atributo_id}`);
        if (input) input.value = stat.total;
    }

    mostrarEstado("Ficha cargada correctamente", "success");
}

async function guardarFicha() {
    console.log("💾 Guardando ficha…");
    mostrarEstado("Guardando ficha…");

    const updates = [];

    for (const id in tiposStats) {
        const valor = parseInt(document.getElementById(`stat-${id}`).value, 10);
        updates.push({ personaje_id: personajeId, atributo_id: parseInt(id), total: valor });
    }

    for (const update of updates) {
        const { error } = await supabase
            .from("stats")
            .upsert(update, { onConflict: ["personaje_id", "atributo_id"] });
        if (error) {
            mostrarEstado("Error guardando ficha: " + error.message, "error");
            return;
        }
    }

    mostrarEstado("Ficha guardada correctamente", "success");
}

document.getElementById("cargarBtn").addEventListener("click", cargarFicha);
document.getElementById("guardarBtn").addEventListener("click", guardarFicha);
