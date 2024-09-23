document.getElementById('darkBtn').addEventListener('click', async () => {
  const bgColor = 'rgb(46, 51, 61)';
  const color = '#ffffff';
  await changeBgColor(bgColor, color);
});

document.getElementById('randomBtn').addEventListener('click', async () => {
  const bgColor = '#' + Math.floor(Math.random()*16777215).toString(16);
  await changeBgColor(bgColor);
});

document.getElementById('bgColorConfirmBtn').addEventListener('click', async () => {
  const colors = document.getElementById('bgColorValue').value;
  const colorArr = colors.split("&");
  await changeBgColor(colorArr[0], colorArr[1])
});

async function changeBgColor(bgColor, color) {
  await setMsg('changeBgColor', { bgColor, color });
}

async function setMsg (eventName, data = {}) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: eventName, data });
}

document.addEventListener('DOMContentLoaded', function () {
  setMsg('initPage');
})
