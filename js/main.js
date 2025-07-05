
// 👇 CONFIGURA AQUÍ TU PROYECTO
const { createClient } = supabase;
const supabaseUrl = "https://jeoivdvhdxzqxnbprpim.supabase.co"; // tu URL Supabase
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Implb2l2ZHZoZHh6cXhuYnBycGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTAxOTMsImV4cCI6MjA2NzI4NjE5M30.xjUuKrJlAYpWN4V98TMuC3In5oAUuoa1Sg5VzmOr_hs"; // tu clave pública
const supabaseClient = createClient(supabaseUrl, supabaseKey);
const { data, error } = await supabaseClient.from("stats").select("*");



const personajeId = "crankus_001";

let tiposStats = {}; // mapa atributo_id → nombre

function mostrarEstado(mensaje, tipo = "info") {
    const statusEl = document.getElementById("status-message");
    statusEl.textContent = mensaje;

    statusEl.className = `mt-4 text-center ${
        tipo === "success"
            ? "text-green-600"
            : tipo === "error"
            ? "text-red-600"
            : "text-gray-600"
    }`;
}

// 🔷 Inicializar: generar inputs dinámicos
async function inicializarFicha() {
    mostrarEstado("Cargando atributos...", "info");

    const { data: tipos, error } = await supabase
        .from("tipos_stats")
        .select("*")
        .order("id");

    if (error) {
        mostrarEstado("❌ Error cargando tipos_stats", "error");
        console.error(error);
        return;
    }

    tiposStats = {}; // reinicia el mapa
    const container = document.getElementById("atributos-container");
    container.innerHTML = "";

    tipos.forEach((stat) => {
        tiposStats[stat.id] = stat.nombre;

        const div = document.createElement("div");
        const label = document.createElement("label");
        label.textContent = stat.nombre;
        label.className = "sheet-label";

        const input = document.createElement("input");
        input.type = "number";
        input.id = `stat-${stat.id}`;
        input.className = "sheet-input";

        div.appendChild(label);
        div.appendChild(input);
        container.appendChild(div);
    });

    mostrarEstado("✅ Atributos listos", "success");
}

// 🔷 Cargar datos desde Supabase
async function cargarFicha() {
    mostrarEstado("Cargando ficha...", "info");

    const { data: stats, error } = await supabase
        .from("stats")
        .select("*")
        .eq("personaje_id", personajeId);

    if (error) {
        mostrarEstado("❌ Error cargando stats", "error");
        console.error(error);
        return;
    }

    stats.forEach((stat) => {
        const input = document.getElementById(`stat-${stat.atributo_id}`);
        if (input) {
            input.value = stat.total;
        }
    });

    mostrarEstado("✅ Ficha cargada correctamente", "success");
}

// 🔷 Guardar datos en Supabase
async function guardarFicha() {
    mostrarEstado("Guardando ficha...", "info");

    const stats = Object.entries(tiposStats).map(([id, nombre]) => {
        const input = document.getElementById(`stat-${id}`);
        return {
            personaje_id: personajeId,
            atributo_id: parseInt(id),
            base: parseInt(input.value) || 0,
            mundo: 0,
            profesion: 0,
            total: parseInt(input.value) || 0,
            bonos: ""
        };
    });

    const { error: delError } = await supabase
        .from("stats")
        .delete()
        .eq("personaje_id", personajeId);

    if (delError) {
        mostrarEstado("❌ Error eliminando stats anteriores", "error");
        console.error(delError);
        return;
    }

    const { error: insertError } = await supabase
        .from("stats")
        .insert(stats);

    if (insertError) {
        mostrarEstado("❌ Error guardando ficha", "error");
        console.error(insertError);
    } else {
        mostrarEstado("✅ Ficha guardada correctamente", "success");
    }
}

// 🔷 Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
    await inicializarFicha();  // primero genera los inputs
    await cargarFicha();       // después carga los valores
});
