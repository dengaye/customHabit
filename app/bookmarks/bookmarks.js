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
          let isFind = false;
          switch (true) {
            case keyWord.endsWith(':url'): {
              const realKeyWord = keyWord.replace(/:url$/, "")
              isFind = fuzzyMatch(bookmarkTreeNode.url, realKeyWord);
              break;
            }
            case keyWord.endsWith(':all'): {
              const realKeyWord = keyWord.replace(/:all$/, "")
              isFind = fuzzyMatch(bookmarkTreeNode.title, keyWord) || fuzzyMatch(bookmarkTreeNode.url, realKeyWord);
              break;
            }
            default:
              isFind = fuzzyMatch(bookmarkTreeNode.title, keyWord);
              break;
          }
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
    list.append(dumpNodeInFolder(bookmarkNodes[i], isFolder));
  }

  return list;
}

function dumpNodeInFolder(bookmarkNode, isFolder) {
  let itemContentElement = '';
  let itemElement = '';
  const hasTitle = !!bookmarkNode.title;
  let subListElement = "";
  if (hasTitle) {
    const anchorIntance = new Anchor(bookmarkNode);
    const anchor = anchorIntance.anchor;

    itemContentElement = $('<section>');

    itemContentElement.append(anchor);

    itemContentElement.contextmenu(
      (event) => {
        event.preventDefault();
        const actions = [
          {
            operationIdName: ADD_FOLDER_OPERATION_ID_NAME,
            dialogIdName: CUSTOM_HUBIT_DIALOG,
            type: OPERATION_TYPE_MAP.ADD_FLODER,
            text: '添加新文件夹',
            successCallback: (newBooknode) => {
              const newAnchor = dumpNodeInFolder(newBooknode);
              if (subListElement) {
                subListElement.append(newAnchor);
                expandFolder(itemContentElement, subListElement);
              } else {
                const newSubListElement = dumpBookmarksWithFolder([newBooknode]);
                itemElement.append(newSubListElement);
                expandFolder(itemContentElement, newSubListElement);
              }
            }
          },
          {
            type: OPERATION_TYPE_MAP.ADD,
            dialogIdName: ADD_DIALOG_ID_NAME,
            operationIdName: ADD_OPERATION_ID_NAME,
            text: '添加新书签',
            successCallback: (newBooknode) => {
              const newAnchor = dumpNodeInFolder(newBooknode);
              subListElement.append(newAnchor).slideDown();
            }
          },
          {
            operationIdName: EDIT_OPERATION_ID_NAME,
            dialogIdName: EDIT_DIALOG_ID_NAME,
            type: OPERATION_TYPE_MAP.EDIT,
            text: '编辑',
            successCallback: (newBookmark) => {
              bookmarkNode = newBookmark;
              anchorIntance.update(newBookmark);
            }
          },
          {
            operationIdName: EDLETE_OPERATION_ID_NAME,
            dialogIdName: DELETE_DIALOG_ID_NAME,
            type: OPERATION_TYPE_MAP.DELETE,
            text: '删除',
            successCallback: () => {
              itemElement.remove();
            }
          }
        ];

        const operationsIntance = new Operation(bookmarkNode, actions);

        $(`#${OPERATION_WRAPPER_ID_NAME}`).css({
          'top': `${event.clientY}px`,
          'left': `${event.clientX}px`
        }).show();

        $(`#${OPERATION_WRAPPER_ID_NAME} .content`).empty().append(operationsIntance.content);

        operationsIntance.onClick()
      }
    );
  }

  itemElement = $(hasTitle ? `<li date-id="${bookmarkNode.id}">` : '<section>').append(itemContentElement);

  if (bookmarkNode.children && bookmarkNode.children.length > 0) {
    subListElement = dumpBookmarksWithFolder(bookmarkNode.children, isFolder);
    itemElement.append(subListElement);
    if (!isFolder) {
      if (!(!bookmarkNode.parentId || bookmarkNode.id == 0)) {
        subListElement.hide();
      }
    }
  }

  if (hasTitle) {
    itemContentElement.click((e) => {
      if (subListElement) {
        subListElement.is(":visible") ? foldFolder(itemContentElement, subListElement) : expandFolder(itemContentElement, subListElement);
      }
    })
  }

  return itemElement;
}

/** 展开文件夹 */
function expandFolder(itemContentElement, subListElement) {
  subListElement.slideDown();
  itemContentElement.find('.js-angle-icon').css('transform', `rotate(90deg)`);
}

/** 收齐文件夹 */
function foldFolder(itemContentElement, subListElement) {
  subListElement.slideUp();
  itemContentElement.find('.js-angle-icon').css('transform', `rotate(0deg)`);
}


function resetData() {
  $('#bookmarks').empty();
  showFolder();
}
