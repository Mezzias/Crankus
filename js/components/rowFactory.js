/**
 * Genera una fila dinámica como una malla de divs en vez de <tr>/<td>.
 *
 * @param {Object} rowData - Datos de la fila
 * @param {Array<Object>} columns - Definición de columnas
 * @param {number} [rowIndex]
 * @returns {HTMLDivElement} - La fila construida
 */
export function rowFactory(rowData, columns, rowIndex = 0) {
  const row = document.createElement("div");
  row.className = "grid grid-cols-" + columns.length + " gap-1 text-xs sm:text-sm py-0.5";

  columns.forEach(col => {
    const cell = document.createElement("div");
    cell.className = "border px-1 py-0.5 text-center";

    const value = rowData[col.key] ?? "";

    if (col.editable) {
      // Editable div para manejar un solo dígito
      const editable = document.createElement("div");
      editable.contentEditable = true;
      editable.textContent = value;
      editable.className =
        "inline-block w-[2ch] border text-center px-0.5 py-0.5 text-xs bg-white";
      editable.dataset.row = rowIndex;
      editable.dataset.key = col.key;

      cell.appendChild(editable);
    } else {
      cell.textContent = value;
    }

    row.appendChild(cell);
  });

  return row;
}
