// 👇 CONFIGURA AQUÍ TU PROYECTO
const supabaseUrl = "https://jeoivdvhdxzqxnbprpim.supabase.co"; // tu URL Supabase
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Implb2l2ZHZoZHh6cXhuYnBycGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTAxOTMsImV4cCI6MjA2NzI4NjE5M30.xjUuKrJlAYpWN4V98TMuC3In5oAUuoa1Sg5VzmOr_hs"; // tu clave pública
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const personajeId = "crankus_ferrus";

// Mapeo de atributo_id (DB) a campo HTML
const atributosMap = {
    1: "movimiento",
    2: "fuerza",
    3: "resistencia",
    4: "iniciativa",
    5: "destreza",
    6: "voluntad",
    7: "inteligencia",
    8: "percepcion",
    9: "carisma",
    10: "ha",
    11: "hp",
    12: "heridas",
    13: "poder",
    14: "fe",
    15: "mana"
};

// Mostrar estado en la página
function mostrarEstado(mensaje, tipo = "info") {
    const statusEl = document.getElementById("status-message");
    statusEl.textContent = mensaje;

    switch (tipo) {
        case "success":
            statusEl.className = "text-center mt-4 text-green-600";
            break;
        case "error":
            statusEl.className = "text-center mt-4 text-red-600";
            break;
        default:
            statusEl.className = "text-center mt-4 text-gray-600";
    }
}

// Guardar ficha
async function guardarFicha() {
    mostrarEstado("Guardando...", "info");

    const stats = Object.entries(atributosMap).map(([id, htmlId]) => ({
        personaje_id: personajeId,
        atributo_id: parseInt(id),
        base: document.getElementById(htmlId).value,
        mundo: 0,
        profesion: 0,
        total: document.getElementById(htmlId).value,
        bonos: ""
    }));

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

// Cargar ficha
async function cargarFicha() {
    mostrarEstado("Cargando...", "info");

    const { data: stats, error } = await supabase
        .from("stats")
        .select("*")
        .eq("personaje_id", personajeId);

    if (error) {
        mostrarEstado("❌ Error cargando ficha", "error");
        console.error(error);
        return;
    }

    stats.forEach(stat => {
        const htmlId = atributosMap[stat.atributo_id];
        if (htmlId) {
            document.getElementById(htmlId).value = stat.base;
        }
    });

    mostrarEstado("✅ Ficha cargada correctamente", "success");
}