function fileIcon() {
  return `
    <svg aria-hidden="true" focusable="false" role="img" class="icon-directory" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="display: inline-block; user-select: none; vertical-align: text-bottom; overflow: visible;">
      <path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Z"></path>
    </svg>
  `;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fuzzyMatch(str, search) {
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
  const img = $(`<img src="${imgSrc}" crossOrigin="anonymous" />`);
  img.on("error", () => {
    img.attr("src", "../../images/favicon.png");
  });
  return img
}