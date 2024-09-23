/** 开始 */
document.addEventListener('DOMContentLoaded', function () {
  /** 展示书签 */
  showFolder();

  /** 搜索 */
  onSearch();

  clickSpaceToHide();
});

function showFolder(isFolder) {
  chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
    $('#bookmarks').append(dumpBookmarksWithFolder(bookmarkTreeNodes, isFolder));
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
      if (keyWord) {
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


/** 点击空处消失 */
function clickSpaceToHide() {
  $(document).on('click', (event) => {
    const target = $(`#${OPERATION_WRAPPER_ID_NAME}`);

    if (!target.is(event.target) && target.has(event.target).length === 0 && target.is(":visible")) {
      target.hide();
    }
  })
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

    section.contextmenu(
      (event) => {
        event.preventDefault();
        $(`#${OPERATION_WRAPPER_ID_NAME}`).css({
          'top': `${event.clientY}px`,
          'left': `${event.clientX}px`
        }).show();
        $(`#${OPERATION_WRAPPER_ID_NAME} .content`).empty().append(operations.options);
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
      }
    );
  }

  const li = $(hasTitle ? '<li>' : '<section>').append(section);

  let ul = "";

  if (bookmarkNode.children && bookmarkNode.children.length > 0) {
    ul = dumpBookmarksWithFolder(bookmarkNode.children, isFolder);
    li.append(ul);
    if (!isFolder) {
      if (!(!bookmarkNode.parentId || bookmarkNode.id == 0)) {
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

function resetData() {
  $('#bookmarks').empty();
  showFolder();
}
