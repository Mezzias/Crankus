// 👇 CONFIGURA AQUÍ TU PROYECTO
const supabaseUrl = "https://jeoivdvhdxzqxnbprpim.supabase.co"; // tu URL Supabase
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Implb2l2ZHZoZHh6cXhuYnBycGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTAxOTMsImV4cCI6MjA2NzI4NjE5M30.xjUuKrJlAYpWN4V98TMuC3In5oAUuoa1Sg5VzmOr_hs"; // tu clave pública
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const personajeId = "crankus_ferrus";

console.log("Supabase listo ✅");

async function guardarFicha() {
    const stats = [
        { atributo_id: 1, base: parseInt(document.getElementById("stat_movimiento").value), total: parseInt(document.getElementById("stat_movimiento").value) },
        { atributo_id: 2, base: parseInt(document.getElementById("stat_fuerza").value), total: parseInt(document.getElementById("stat_fuerza").value) }
    ].map(stat => ({ ...stat, personaje_id: personajeId }));

    const inventario = [
        {
            item: document.getElementById("inv_item").value,
            cantidad: 1,
            descripcion: document.getElementById("inv_desc").value,
            personaje_id: personajeId
        }
    ];

    // Borra datos previos
    await supabase.from("stats").delete().eq("personaje_id", personajeId);
    await supabase.from("inventario").delete().eq("personaje_id", personajeId);

    const { error: statsError } = await supabase.from("stats").insert(stats);
    const { error: invError } = await supabase.from("inventario").insert(inventario);

    if (statsError || invError) {
        alert("❌ Error al guardar ficha");
        console.error(statsError || invError);
    } else {
        alert("✅ Ficha guardada correctamente");
    }
}

async function cargarFicha() {
    const { data: stats, error: statsError } = await supabase.from("stats").select("*").eq("personaje_id", personajeId);
    const { data: inventario, error: invError } = await supabase.from("inventario").select("*").eq("personaje_id", personajeId);

    if (statsError || invError) {
        alert("❌ Error al cargar ficha");
        console.error(statsError || invError);
        return;
    }

    stats.forEach(stat => {
        if (stat.atributo_id === 1) document.getElementById("stat_movimiento").value = stat.base;
        if (stat.atributo_id === 2) document.getElementById("stat_fuerza").value = stat.base;
    });

    if (inventario.length > 0) {
        document.getElementById("inv_item").value = inventario[0].item;
        document.getElementById("inv_desc").value = inventario[0].descripcion;
    }

    alert("✅ Ficha cargada correctamente");
}