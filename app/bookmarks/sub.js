(function () {
  document.addEventListener('DOMContentLoaded', function () {
    handleShortCut();

    time();

    renderViewAnchor();
  })

  /** 一些快捷键 */
  function handleShortCut() {
    $(document).keydown((event) => {
      /** ctrl + x：快速搜索书签 */
      if (event.ctrlKey) {
        switch (event.key) {
          case 'f': {
            event.preventDefault();
            $('#search').focus();
            break;
          }
          default:
            break;
        }
      }
    })
  }

  /** 年-月-日 */
  const todayTime = getTodayTime();

  /** 时间 */
  function time() {
    const tody = new Date();
    const weeks = ['日', '一', '二', '三', '四', '五', '六'];

    const week = `星期${weeks[tody.getDay()]}`;

    $('#time').text(`${todayTime} ${week}`);
  }

  function padZero(num) {
    return num < 10 ? '0' + num : num;
  }

  function getTodayTime(format = '-') {
    const tody = new Date();
    const year = tody.getFullYear();
    const month = padZero(tody.getMonth() + 1);
    const day = padZero(tody.getDate());
    return `${year}${format}${month}${format}${day}`;
  }

  const localStorageKey = `[customHubit][ViewAnchor]${todayTime}`;
  /** 每日一览 */
  function renderViewAnchor() {
    chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
      let bookmark = localStorage.getItem(localStorageKey);
      if (bookmark) {
        bookmark = JSON.parse(bookmark);
      } else {
        bookmark = genaratorBookmark(bookmarkTreeNodes);
        localStorage.setItem(localStorageKey, JSON.stringify(bookmark));
      }
      $('#viewAnchor').append(genaratorAnchor(bookmark));
    });
  }

  /** 生成 a 标签 */
  function genaratorAnchor(bookmark) {
    const anchor = $(`
      <a href="${bookmark.url}" target="_blank" class="help is-text is-flex is-align-items-center is-size-6">
      </a>
    `);
    anchor.append(createFavicon(bookmark.url, 16));
    anchor.append(`
      <span class='pl-2'>${bookmark.title}</span>
    `);
    return anchor;
  }

  /** 生成书签 */
  function genaratorBookmark(bookmarkNodes) {
    if (Array.isArray(bookmarkNodes)) {
      const length = bookmarkNodes.length - 1;
      const random = getRandomInt(0, length);
      const bookmark = bookmarkNodes[random];
      if (bookmark.children && bookmark.children.length > 0) {
        return genaratorBookmark(bookmark.children);
      }
      return bookmark;
    }
  }
})()