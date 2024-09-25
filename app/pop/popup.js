document.getElementById('darkBtn').addEventListener('click', async () => {
  setMsg('changeThemeToDark');
});

document.getElementById('resetBtn').addEventListener('click', async () => {
  setMsg('changeThemeToDefault');
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
