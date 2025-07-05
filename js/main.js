
// 👇 CONFIGURA AQUÍ TU PROYECTO
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://jeoivdvhdxzqxnbprpim.supabase.co"; // tu URL Supabase
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Implb2l2ZHZoZHh6cXhuYnBycGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTAxOTMsImV4cCI6MjA2NzI4NjE5M30.xjUuKrJlAYpWN4V98TMuC3In5oAUuoa1Sg5VzmOr_hs"; // tu clave pública
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

const personajeId = "crankus_001";
const atributosContainer = document.getElementById("atributos-container");
const statusEl = document.getElementById("status-message");

let tiposStats = {};

// Mensaje de estado
function mostrarEstado(mensaje, tipo = "info") {
    statusEl.textContent = mensaje;
    statusEl.className = `mt-4 text-center ${
        tipo === "success" ? "text-green-600" :
        tipo === "error" ? "text-red-600" : "text-gray-600"
    }`;
}

// Cargar ficha
async function cargarFicha() {
    mostrarEstado("Cargando ficha...");

    const { data: tipos, error: errorTipos } = await supabaseClient.from("tipos_stats").select("*");
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
            <label class="sheet-label">${tipo.nombre}</label>
            <input type="number" id="stat-${tipo.id}" class="sheet-input" value="0">
        `;
        atributosContainer.appendChild(div);
    }

    const { data: stats, error: errorStats } = await supabaseClient
        .from("stats")
        .select("*")
        .eq("personaje_id", personajeId);

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

// Guardar ficha
async function guardarFicha() {
    mostrarEstado("Guardando ficha...");

    const updates = [];

    for (const id in tiposStats) {
        const valor = parseInt(document.getElementById(`stat-${id}`).value, 10);
        updates.push({ personaje_id: personajeId, atributo_id: parseInt(id), total: valor });
    }

    for (const update of updates) {
        const { error } = await supabaseClient
            .from("stats")
            .upsert(update, { onConflict: ["personaje_id", "atributo_id"] });
        if (error) {
            mostrarEstado("Error guardando ficha: " + error.message, "error");
            return;
        }
    }

    mostrarEstado("Ficha guardada correctamente", "success");
}

// Botones
document.getElementById("cargarBtn").addEventListener("click", cargarFicha);
document.getElementById("guardarBtn").addEventListener("click", guardarFicha);
window.cargarFicha = cargarFicha;
window.guardarFicha = guardarFicha;
console.log("✅ main.js ejecutado y funciones publicadas en window");