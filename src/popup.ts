let count = 0;

const form = document.getElementById('form');
const start = <HTMLInputElement>document.getElementById('start-price');
const end = <HTMLInputElement>document.getElementById('end-price');

form.addEventListener('submit', e => {
  e.preventDefault();
  sendMsg(generateConditions());
});

function generateConditions() {
  return {
    name: 'search-params',
    start: Number(start.value),
    end: Number(end.value),
    text: '',
  }
}

function sendMsg(msg) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, msg);
  });
}
