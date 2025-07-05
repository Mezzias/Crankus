/**
 * Renderiza dinámicamente las filas de una tabla en un tbody.
 *
 * @param {string} tbodyId - ID del tbody donde insertar las filas
 * @param {Array<Object>} data - Array de objetos con los datos de las filas
 * @param {Array<Object>} columns - Definición de columnas [{ key: string, editable: boolean }]
 */
export function renderRows(tbodyId, data, columns) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) {
    console.error(`❌ No se encontró el elemento tbody con id: ${tbodyId}`);
    return;
  }

  tbody.innerHTML = ""; // limpia el tbody

  data.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");

    columns.forEach(col => {
      const td = document.createElement("td");
      td.className = "border px-2 py-1 text-xs sm:text-sm";

      const value = row[col.key] ?? "";

      if (col.editable) {
        const input = document.createElement("input");
        input.type = "number";
        input.value = value;
        input.className = "w-12 sm:w-16 border text-right px-1 py-0.5";
        input.dataset.row = rowIndex;
        input.dataset.key = col.key;
        td.appendChild(input);
      } else {
        td.textContent = value;
      }

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}
