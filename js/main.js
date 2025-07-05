
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
async function cargarHabilidades() {
    console.log("📥 Cargando habilidades…");

    mostrarEstado("Cargando habilidades…");

    const primBody = document.getElementById("habilidades-primarias-body");
    const secBody = document.getElementById("habilidades-secundarias-body");
    primBody.innerHTML = "";
    secBody.innerHTML = "";

    // Primarias
    const { data: primarias, error: errorPrim } = await supabase
        .from("habilidades_primarias")
        .select("*")
        .eq("personaje_id", personajeId);

    if (errorPrim) {
        mostrarEstado("Error cargando primarias: " + errorPrim.message, "error");
        return;
    }

    for (const hab of primarias) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="border px-2 py-1">${hab.habilidad}</td>
            <td class="border px-2 py-1">
                <input type="number" id="primaria-nivel-${hab.id}" class="w-16 border" value="${hab.nivel || 0}">
            </td>
            <td class="border px-2 py-1">
                <input type="text" id="primaria-bonus-${hab.id}" class="w-24 border" value="${hab.bonus || ""}">
            </td>
        `;
        primBody.appendChild(tr);
    }

    // Secundarias
    const { data: secundarias, error: errorSec } = await supabase
        .from("habilidades_secundarias")
        .select("*")
        .eq("personaje_id", personajeId);

    if (errorSec) {
        mostrarEstado("Error cargando secundarias: " + errorSec.message, "error");
        return;
    }

    for (const hab of secundarias) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="border px-2 py-1">${hab.habilidad}</td>
            <td class="border px-2 py-1">
                <input type="number" id="secundaria-nivel-${hab.id}" class="w-16 border" value="${hab.nivel || 0}">
            </td>
            <td class="border px-2 py-1">
                <input type="text" id="secundaria-bonus-${hab.id}" class="w-24 border" value="${hab.bonus || ""}">
            </td>
        `;
        secBody.appendChild(tr);
    }

    mostrarEstado("Habilidades cargadas correctamente", "success");
}

async function cargarExperiencia() {
    console.log("📥 Cargando experiencia gastada…");

    mostrarEstado("Cargando experiencia…");

    const expBody = document.getElementById("experiencia-body");
    expBody.innerHTML = "";

    const { data: gastos, error } = await supabase
        .from("gasto_experiencia")
        .select("*")
        .eq("personaje_id", personajeId);

    if (error) {
        mostrarEstado("Error cargando experiencia: " + error.message, "error");
        return;
    }

    for (const gasto of gastos) {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td class="border px-2 py-1">
                <input type="text" id="gasto-habilidad-${gasto.id}" class="w-48 border" value="${gasto.habilidad_id}">
            </td>
            <td class="border px-2 py-1">
                <input type="text" id="gasto-tipo-${gasto.id}" class="w-24 border" value="${gasto.tipo}">
            </td>
            <td class="border px-2 py-1">
                <input type="number" id="gasto-nivel-${gasto.id}" class="w-16 border" value="${gasto.nivel}">
            </td>
            <td class="border px-2 py-1">
                <input type="number" id="gasto-exp-${gasto.id}" class="w-20 border" value="${gasto.experiencia}">
            </td>
        `;
        expBody.appendChild(tr);
    }

    mostrarEstado("Experiencia cargada correctamente", "success");
}
async function cargarInventario() {
    console.log("📥 Cargando inventario…");

    mostrarEstado("Cargando inventario…");

    const invBody = document.getElementById("inventario-body");
    invBody.innerHTML = "";

    const { data: items, error } = await supabase
        .from("inventario")
        .select("*")
        .eq("personaje_id", personajeId);

    if (error) {
        mostrarEstado("Error cargando inventario: " + error.message, "error");
        return;
    }

    for (const item of items) {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td class="border px-2 py-1">
                <input type="text" id="item-nombre-${item.id}" class="w-48 border" value="${item.item}">
            </td>
            <td class="border px-2 py-1">
                <input type="number" id="item-cantidad-${item.id}" class="w-16 border" value="${item.cantidad}">
            </td>
            <td class="border px-2 py-1">
                <input type="number" id="item-peso-${item.id}" class="w-16 border" value="${item.peso || 0}">
            </td>
            <td class="border px-2 py-1">
                <input type="text" id="item-desc-${item.id}" class="w-64 border" value="${item.descripcion || ""}">
            </td>
        `;
        invBody.appendChild(tr);
    }

    mostrarEstado("Inventario cargado correctamente", "success");
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

async function cargarImplantes() {
    console.log("📥 Cargando implantes…");

    mostrarEstado("Cargando implantes…");

    const implantesBody = document.getElementById("implantes-body");
    implantesBody.innerHTML = "";

    const { data: implantes, error } = await supabase
        .from("implantes_personaje")
        .select("*")
        .eq("personaje_id", personajeId);

    if (error) {
        mostrarEstado("Error cargando implantes: " + error.message, "error");
        return;
    }

    for (const impl of implantes) {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td class="border px-2 py-1">
                <input type="text" id="implante-tipo-${impl.id}" class="w-32 border" value="${impl.implante_tipo}">
            </td>
            <td class="border px-2 py-1">
                <input type="number" id="implante-dificultad-${impl.id}" class="w-16 border" value="${impl.dificultad}">
            </td>
            <td class="border px-2 py-1">
                <input type="text" id="implante-datos-${impl.id}" class="w-48 border" value="${impl.datos_extra || ""}">
            </td>
            <td class="border px-2 py-1">
                <input type="text" id="implante-capacidades-${impl.id}" class="w-48 border" value="${impl.capacidades_extra || ""}">
            </td>
        `;
        implantesBody.appendChild(tr);
    }

    mostrarEstado("Implantes cargados correctamente", "success");
}

document.getElementById("cargarBtn").addEventListener("click", () => {
    cargarFicha();
    cargarHabilidades();
    cargarImplantes();
    cargarExperiencia();
    cargarInventario();
});
document.getElementById("guardarBtn").addEventListener("click", guardarFicha);
