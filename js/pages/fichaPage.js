import { rowFactory } from '../components/rowFactory.js';

export class FichaPage {
  constructor(supabase, personajeId) {
    this.supabase = supabase;
    this.personajeId = personajeId;
    this.statusEl = document.getElementById("status-message");
  }

  mostrarEstado(mensaje, tipo = "info") {
    this.statusEl.textContent = mensaje;
    this.statusEl.className = tipo;
  }

  async cargarFicha() {
    this.mostrarEstado("Cargando ficha…");

    await this.cargarSeccion(
      "stats",
      "atributos-body",
      [
        { key: "tipo", editable: false },
        { key: "base", editable: true },
        { key: "mundo", editable: true },
        { key: "profesion", editable: true },
        { key: "total", editable: false }
      ],
      r => ({
        tipo: r.tipos_stats.nombre,
        base: r.base,
        mundo: r.mundo,
        profesion: r.profesion,
        total: r.total
      }),
      "*, tipos_stats(nombre)"
    );

    await this.cargarSeccion(
      "habilidades_primarias",
      "habilidades-primarias-body",
      [
        { key: "habilidad", editable: false },
        { key: "nivel", editable: true },
        { key: "bonus", editable: true }
      ]
    );

    await this.cargarSeccion(
      "habilidades_secundarias",
      "habilidades-secundarias-body",
      [
        { key: "habilidad", editable: false },
        { key: "nivel", editable: true },
        { key: "bonus", editable: true }
      ]
    );

    await this.cargarSeccion(
      "implantes_personaje",
      "implantes-body",
      [
        { key: "implante_tipo", editable: false },
        { key: "dificultad", editable: false },
        { key: "datos_extra", editable: true },
        { key: "capacidades_extra", editable: true }
      ]
    );

    await this.cargarSeccion(
      "gasto_experiencia",
      "experiencia-body",
      [
        { key: "habilidad_id", editable: false },
        { key: "tipo", editable: false },
        { key: "nivel", editable: false },
        { key: "experiencia", editable: false }
      ]
    );

    await this.cargarSeccion(
      "inventario",
      "inventario-body",
      [
        { key: "item", editable: false },
        { key: "cantidad", editable: true },
        { key: "peso", editable: true },
        { key: "descripcion", editable: true }
      ]
    );

    this.mostrarEstado("Ficha cargada correctamente", "success");
  }

  async cargarSeccion(tabla, tbodyId, columns, transform = r => r, select = "*") {
    const tbody = document.getElementById(tbodyId);
    tbody.innerHTML = "";

    const { data, error } = await this.supabase
      .from(tabla)
      .select(select)
      .eq("personaje_id", this.personajeId);

    if (error) {
      this.mostrarEstado(`Error en ${tabla}: ${error.message}`, "error");
      return;
    }

    data.forEach((row, idx) => {
      const datosFila = transform(row);
      const tr = RowFactory.createRow(datosFila, columns, idx);
      tbody.appendChild(tr);
    });
  }
}
