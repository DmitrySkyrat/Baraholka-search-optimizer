import { RxHR } from '@akanass/rx-http-request/browser/index.js';
import { PopupState } from './popup';

let pageNum = 0;
let pageSize = 50;
let minPrice = 450;
let maxPrice = 800;

const table = getTable(document.body);

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.log(msg);
  if (msg.name === 'search-params') {

    localStorage.setItem('msg', JSON.stringify(msg));
    showActualContent(msg);

  } else if (msg.name === 'get-init-state') {

    if (localStorage.msg) {
      let state: PopupState = JSON.parse(localStorage.msg);
      showActualContent(state);

      sendResponse({
        start: state.start,
        end: state.end,
      });
    } else {
      sendResponse(null);
    }
    
  }
});


function showActualContent(state: PopupState) {
  minPrice = state.start;
  maxPrice = state.end;
  pageNum = 0;
  clearTable();
  loadMore();
}

function loadMore() {
  // TODO: better handle query params.
  RxHR.get(location.href + '&start=' + (pageNum++) * pageSize).subscribe(resp => {
    const el = getElemFromResponse(resp.body);
    const responseTable = getTable(el);
    const parsedRows = filterTableRows(responseTable);

    parsedRows
      .filter(row => priceFilter(row, minPrice, maxPrice))
      .forEach(row => {
        table.tBodies[0].appendChild(row);
      });

    if (parsedRows.length) { // empty page => last page
      loadMore();
    }
  });
}

function clearTable() {
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
}

function getTable(el: Element) {
  return <HTMLTableElement>el.querySelector('.ba-tbl-list__table');
}

function getElemFromResponse(resp: string) {
  const el = document.createElement('div');
  el.innerHTML = resp;
  return el;
}

function filterTableRows(table: HTMLTableElement) {
  return Array.from(table.rows)
    .filter(row => {
      return row.classList.length === 0;
    })
}

function priceFilter(row, min, max) {
  const priceEl = row.querySelector('.price-primary');

  if (!priceEl) {
    return false;
  }

  const price = Number.parseFloat(priceEl.innerHTML);

  return min <= price && price <= max;
}



