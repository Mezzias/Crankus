export class RowFactory {
  /**
   * Genera un <tr> dinámico para una tabla.
   *
   * @param {Object} rowData - Datos de la fila
   * @param {Array<Object>} columns - Definición de columnas
   * @param {number} [rowIndex]
   * @returns {HTMLTableRowElement}
   */
  static createRow(rowData, columns, rowIndex = 0) {
    const tr = document.createElement("tr");

    columns.forEach(col => {
      const td = document.createElement("td");
      td.className = "border px-2 py-1 text-xs sm:text-sm text-center";

      const value = rowData[col.key] ?? "";

      if (col.editable) {
        const input = document.createElement("input");
        input.type = "number";
        input.value = value;
        input.className =
          "w-8 sm:w-10 border text-center px-0.5 py-0.5 text-xs";
        input.dataset.row = rowIndex;
        input.dataset.key = col.key;
        td.appendChild(input);
      } else {
        td.textContent = value;
      }

      tr.appendChild(td);
    });

    return tr;
  }
}
