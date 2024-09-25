chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case "changeBgColor":
      const { bgColor, color } = request.data;
      changeBgColor(bgColor, color);
      break;
    case 'changeThemeToDark':
      changeThemeToDark();
      break;
    case 'changeThemeToDefault':
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
      * {
        background-color: ${bgColor} !important;
        ${animation}
        color: ${color} !important;
      }
    `;
  } else {
    styleInnnerHTML = `
      * {
        ${animation}
        background-color: ${bgColor} !important;
      }
    `;
  }
  handleCreateStyle(styleInnnerHTML);
}

function initPage() {
  handleCreateStyle(`
    * {
      ${animation}
    }
  `);
}

function changeThemeToDark() {
  handleCreateStyle(`
    * {
      ${animation}
      filter: invert(1) hue-rotate(.5turn) !important;
    }
  `)
}

function handleCreateStyle(styleInnnerHTML) {
  const hasStyle = document.getElementById(customStyleIdName);
  console.log("hasStyle", hasStyle)
  if (hasStyle) {
    hasStyle.innerHTML = styleInnnerHTML
  } else {
    const styleElement = document.createElement('style');
    styleElement.id = customStyleIdName;
    styleElement.innerHTML = styleInnnerHTML;
    document.head.appendChild(styleElement);
  }
}