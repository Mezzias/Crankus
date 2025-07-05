/**
 * Genera una fila dinámica como una malla de divs.
 *
 * @param {Object} rowData - Datos de la fila
 * @param {Array<Object>} columns - Definición de columnas
 * @param {number} [rowIndex]
 * @returns {HTMLDivElement} - La fila construida
 */
export function rowFactory(rowData, columns, rowIndex = 0) {
  const row = document.createElement("div");
  row.className = `grid grid-cols-${columns.length} text-xs sm:text-sm text-center`;

  columns.forEach(col => {
    const cell = document.createElement("div");
    cell.className = "border border-gray-300 py-0.5 px-1";

    const value = rowData[col.key] ?? "";

    if (col.editable) {
      // Editable input para un solo dígito
      const input = document.createElement("input");
      input.type = "text";
      input.value = value;
      input.className =
        "text-center w-6 sm:w-8 px-0.5 py-0.5 text-xs border border-gray-300 bg-white";
      input.dataset.row = rowIndex;
      input.dataset.key = col.key;

      // limitar a un dígito visual
      input.maxLength = 1;
      input.style.width = "2ch";

      cell.appendChild(input);
    } else {
      cell.textContent = value;
    }

    row.appendChild(cell);
  });

  return row;
}