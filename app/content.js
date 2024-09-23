chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case "changeBgColor":
      const { bgColor, color } = request.data;
      changeBgColor(bgColor, color);
      break;
    case 'initPage':
      initPage();
      break;
    default:
      break;
  }
});


const animation = `transition: background-color 0.5s, color 0.5s;`;
const customStyleIdName = 'jsCustomHubitStyle';

function changeBgColor(bgColor, color) {
  let styleInnnerHTML = '';
  if (color) {
    styleInnnerHTML = `
      body, * {
        background-color: ${bgColor} !important;
        ${animation}
        color: ${color} !important;
      }
    `;
  } else {
    styleInnnerHTML = `
      body, * {
        ${animation}
        background-color: ${bgColor} !important;
      }
    `;
  }
  handleCreateStyle(styleInnnerHTML);
}

function initPage() {
  handleCreateStyle(`
    body, * {
      ${animation}
    }
  `);
}

function handleCreateStyle(styleInnnerHTML) {
  const hasStyle = document.getElementById(customStyleIdName);
  if (hasStyle) {
    hasStyle.innerHTML = styleInnnerHTML
  } else {
    const style = document.createElement('style');
    document.id = customStyleIdName;
    style.innerHTML = styleInnnerHTML;
    document.head.appendChild(style);
  }
}