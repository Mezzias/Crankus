
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

    // Recuperar tipos de stats
    const { data: tipos, error: errorTipos } = await supabase
        .from("tipos_stats")
        .select("*");
    if (errorTipos) {
        mostrarEstado("Error cargando tipos: " + errorTipos.message, "error");
        return;
    }

    const tiposMap = {};
    for (const tipo of tipos) {
        tiposMap[tipo.id] = tipo.nombre;
    }

    // Recuperar stats del personaje
    const { data: stats, error: errorStats } = await supabase
        .from("stats")
        .select("*")
        .eq("personaje_id", personajeId);

    if (errorStats) {
        mostrarEstado("Error cargando stats: " + errorStats.message, "error");
        return;
    }

    const tbody = document.getElementById("atributos-body");
    tbody.innerHTML = "";

    for (const stat of stats) {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td class="border px-2 py-1">${tiposMap[stat.atributo_id]}</td>
            <td class="border px-2 py-1">
                <input type="number" id="base-${stat.atributo_id}" class="w-16 border" value="${stat.base}">
            </td>
            <td class="border px-2 py-1">
                <input type="number" id="mundo-${stat.atributo_id}" class="w-16 border" value="${stat.mundo}">
            </td>
            <td class="border px-2 py-1">
                <input type="number" id="profesion-${stat.atributo_id}" class="w-16 border" value="${stat.profesion}">
            </td>
            <td class="border px-2 py-1">
                <input type="number" id="total-${stat.atributo_id}" class="w-16 border" value="${stat.total}">
            </td>
        `;
        tbody.appendChild(tr);
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
