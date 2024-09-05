document.getElementById('darkBtn').addEventListener('click', async () => {
  const bgColor = 'rgb(46, 51, 61)';
  const color = '#ffffff';
  await setMsg(bgColor, color);
});

document.getElementById('randomBtn').addEventListener('click', async () => {
  const bgColor = '#' + Math.floor(Math.random()*16777215).toString(16);
  await setMsg(bgColor);
});

document.getElementById('bgColorConfirmBtn').addEventListener('click', async () => {
  const colors = document.getElementById('bgColorValue').value;
  const colorArr = colors.split("&");
  await setMsg(colorArr[0], colorArr[1])
});

async function setMsg (bgColor, color) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: "changeBgColor", data: { bgColor, color } });
}
