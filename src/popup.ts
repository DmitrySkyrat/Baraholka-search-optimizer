let count = 0;

const form = document.getElementById('form');
const start = <HTMLInputElement>document.getElementById('start-price');
const end = <HTMLInputElement>document.getElementById('end-price');

sendMsg({
  name: 'get-init-state'
}, state => {
  if (state) {
    start.value = state.start;
    end.value = state.end;
  }
})

form.addEventListener('submit', e => {
  e.preventDefault();
  sendMsg(generateConditions());
});

console.log('activated!');

function sendMsg(msg, callback?) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, msg, callback);
  });
}

function generateConditions() {
  return {
    name: 'search-params',
    start: Number(start.value),
    end: Number(end.value),
    text: '',
  }
}

export interface PopupState {
  start: number;
  end: number;
}
