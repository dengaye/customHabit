/** 开始 */
document.addEventListener('DOMContentLoaded', function () {
  /** 展示书签 */
  showFolder();

  /** 每日一览 */
  renderViewAnchor();

  /** 搜索 */
  onSearch();
});

function showFolder(isFolder) {
  chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
    $('#bookmarks').append(dumpBookmarksWithFolder(bookmarkTreeNodes, isFolder));
  });
}

function renderViewAnchor() {
  chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
    $('#viewAnchor').append(genaratorAnchor(bookmarkTreeNodes));
  });
}

function onSearch() {
  let searchTemp = [];
  let isFolder = false;

  $('#search').change(function () {
    $('#bookmarks').empty();
    searchTemp = [];
    const keyWord = $('#search').val();
    chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
      if (keyWord)  {
        handleSearch(bookmarkTreeNodes, keyWord);
        isFolder = true;
      } else {
        searchTemp = bookmarkTreeNodes;
        isFolder = false;
      }
      $('#bookmarks').append(dumpBookmarksWithFolder(searchTemp, isFolder));
    });
  });

  function handleSearch(bookmarkTreeNodes, keyWord) {
    if (Array.isArray(bookmarkTreeNodes)) {
      for (let i = 0; i < bookmarkTreeNodes.length; i++) {
        const bookmarkTreeNode = bookmarkTreeNodes[i];
        if (bookmarkTreeNode.children && bookmarkTreeNode.children.length) {
          handleSearch(bookmarkTreeNode.children, keyWord);
        }
        if (bookmarkTreeNode.title) {
          const isFind = fuzzyMatch(bookmarkTreeNode.title, keyWord);
          if (isFind) {
            searchTemp.push(bookmarkTreeNode);
          }
        }
      }
    }
  }
}

function dumpBookmarksWithFolder(bookmarkNodes, isFolder) {
  const list = $('<ul class="menu-list">');
  for (let i = 0; i < bookmarkNodes.length; i++) {
    list.attr("data-parentId", bookmarkNodes[i].parentId);
    list.attr("data-id", bookmarkNodes[i].id);
    list.append(dumpNodeInFolder(bookmarkNodes[i], isFolder));
  }

  return list;
}

function dumpNodeInFolder(bookmarkNode, isFolder) {
  let section = '';
  const hasTitle = !!bookmarkNode.title;
  if (hasTitle) {

    const anchor = new Anchor(bookmarkNode);

    section = $('<section>');

    section.append(anchor);

    const operations = new Operation(bookmarkNode);

    section.hover(
      () => {
        anchor.append(operations.options);

        const actions = [
          {
            operationIdName: EDIT_OPERATION_ID_NAME,
            dialogIdName: EDIT_DIALOG_ID_NAME,
            type: OPERATION_TYPE_MAP.EDIT
          },
          {
            type: OPERATION_TYPE_MAP.ADD,
            dialogIdName: ADD_DIALOG_ID_NAME,
            operationIdName: ADD_OPERATION_ID_NAME
          },
          {
            operationIdName: EDLETE_OPERATION_ID_NAME,
            dialogIdName: DELETE_DIALOG_ID_NAME,
            type: OPERATION_TYPE_MAP.DELETE,
            successCallback: () => {
              anchor.remove();
            }
          }
        ]

        operations.handleOperations(actions)
      },
      () => {
        operations.options.remove();
      }
    )
  }

  const li = $(hasTitle ? '<li>' : '<section>').append(section);

  let ul = "";

  if (bookmarkNode.children && bookmarkNode.children.length > 0) {
    ul = dumpBookmarksWithFolder(bookmarkNode.children, isFolder);
    li.append(ul);
    if (!isFolder) {
      if (!(!bookmarkNode.parentId || bookmarkNode.parentId == 0)) {
        ul.hide();
      }
    }
  }

  if (hasTitle) {
    section.click((e) => {
      if (ul) {
        ul.is(":visible") ? ul.slideUp() : ul.slideDown();
      }
    })
  }

  return li;
}

function genaratorAnchor(bookmarkNodes) {
  if (Array.isArray(bookmarkNodes)) {
    const length = bookmarkNodes.length - 1;
    const random = getRandomInt(0, length);
    const bookmark = bookmarkNodes[random];
    if (bookmark.children && bookmark.children.length > 0) {
      return genaratorAnchor(bookmark.children);
    }
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
}

function resetData() {
  $('#bookmarks').empty();
  showFolder();
}
