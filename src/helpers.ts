export function getTable(htmlElement: HTMLDivElement) {
  return htmlElement.querySelector<HTMLTableElement>(".ba-tbl-list__table");
}

export function getElemFromResponse(resp: string) {
  const el = document.createElement("div");
  el.innerHTML = resp;
  return el;
}
export function filterTableRows(table: HTMLTableElement) {
  return Array.from(table.rows)
    .filter(row => {
      return row.classList.length === 0;
    })
}
export function priceFilter(row: HTMLTableElement, min: number, max: number) {
  const priceEl = row.querySelector('.price-primary');
  if (!priceEl) {
    return false;
  }
  const price = Number.parseFloat(priceEl.innerHTML);
  return min <= price && price <= max;
}