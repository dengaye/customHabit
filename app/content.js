chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case "changeBgColor":
      const { bgColor, color } = request.data;
      changeBgColor(bgColor, color);
      break;
    default:
      break;
  }
});

function changeBgColor(bgColor, color) {
  if (bgColor) {
    document.body.style.backgroundColor = bgColor;
    const containerEle = document.getElementById('container');
    if (containerEle) {
      containerEle.style.backgroundColor = bgColor;
    }
  }

  if (color) {
    const allElements = document.querySelectorAll('*');

    allElements.forEach(element => {
        element.style.color = color;
    });
  }
}
