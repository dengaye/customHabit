function fileIcon() {
  return `
    <svg aria-hidden="true" focusable="false" role="img" class="icon-directory" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="display: inline-block; user-select: none; vertical-align: text-bottom; overflow: visible;">
      <path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Z"></path>
    </svg>
  `;
}

function rightAngleIcon() {
  return `
    <svg class="icon" style="width: 1em;height: 1em;vertical-align: middle; fill: currentColor; overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3536">
      <path d="M322.88768 188.66176a30.72 30.72 0 1 1 43.4176-43.4176l284.01664 283.97568-43.45856 43.4176-283.97568-283.97568z m312.9344 312.9344l0.16384 0.16384-313.09824 313.09824a30.72 30.72 0 0 0 43.4176 43.4176l331.93984-331.89888a34.816 34.816 0 0 0 0-49.23392l-18.96448-18.96448-43.45856 43.4176z" p-id="3538"></path>
    </svg>
  `
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fuzzyMatch(str, search) {
  if (!str) return false
  const pattern = new RegExp(search, "i");

  return pattern.test(str);
}

function faviconURL(pageUrl, size) {
  const url = new URL(chrome.runtime.getURL("/_favicon/"));
  url.searchParams.set('pageUrl', pageUrl);
  url.searchParams.set('size', size);
  return url.toString();
}

function createFavicon(pageUrl, size = '14') {
  const imgSrc = faviconURL(pageUrl, size);
  const img = $(`<img src="${imgSrc}" crossOrigin="anonymous" style="border-radius: 50%;" />`);
  img.on("error", () => {
    img.attr("src", "../../images/favicon.png");
  });
  return img
}