
// 👇 CONFIGURA AQUÍ TU PROYECTO
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { FichaPage } from "./pages/fichaPage.js";

console.log("✅ main.js cargado y módulo ESM importado");

const supabaseUrl = "https://jeoivdvhdxzqxnbprpim.supabase.co"; // tu URL Supabase
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Implb2l2ZHZoZHh6cXhuYnBycGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTAxOTMsImV4cCI6MjA2NzI4NjE5M30.xjUuKrJlAYpWN4V98TMuC3In5oAUuoa1Sg5VzmOr_hs"; // tu clave pública
const supabase = createClient(supabaseUrl, supabaseKey); 

console.log("✅ Supabase cliente creado:", supabase);

const personajeId = "crankus_001";
const fichaPage = new FichaPage(supabase, personajeId);

document.getElementById("cargarBtn").addEventListener("click", () => fichaPage.cargarFicha());