export function rowFactory(rowData, columns, rowIndex = 0) {
  const row = document.createElement("div");
  row.className = `row-dynamic`;
  row.style.gridTemplateColumns = `repeat(${columns.length}, 1fr)`;

  columns.forEach(col => {
    const cell = document.createElement("div");
    cell.className = "cell-dynamic";

    const value = rowData[col.key] ?? "";

    if (col.editable) {
      const input = document.createElement("input");
      input.type = "text";
      input.value = value;
      input.className = "input-dynamic";
      input.dataset.row = rowIndex;
      input.dataset.key = col.key;

      cell.appendChild(input);
    } else {
      cell.textContent = value;
    }

    row.appendChild(cell);
  });

  return row;
}
º