$('#search').change(function () {
  $('#bookmarks').empty();
  showFolder($('#search').val());
});

function dumpNodeInFolder(bookmarkNode, query) {
  let section = '';
  const hasTitle = !!bookmarkNode.title;
  if (hasTitle) {
    if (query && !bookmarkNode.children) {
      if (!fuzzyMatch(bookmarkNode.title, query)) {
        return '';
      }
    }

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
    ul = dumpBookmarksWithFolder(bookmarkNode.children, query);
    li.append(ul);
    if (!query) {
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

function dumpBookmarksWithFolder(bookmarkNodes, query) {
  const list = $('<ul class="menu-list">');
  for (let i = 0; i < bookmarkNodes.length; i++) {
    list.attr("data-parentId", bookmarkNodes[i].parentId);
    list.attr("data-id", bookmarkNodes[i].id);
    list.append(dumpNodeInFolder(bookmarkNodes[i], query));
  }

  return list;
}

function showFolder(query) {
  chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
    $('#bookmarks').append(dumpBookmarksWithFolder(bookmarkTreeNodes, query));
  });
}

document.addEventListener('DOMContentLoaded', function () {
  showFolder();
  renderViewAnchor();
});

function renderViewAnchor() {
  chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
    $('#viewAnchor').append(genaratorAnchor(bookmarkTreeNodes));
  });
}

function genaratorAnchor(bookmarkNodes) {
  if (Array.isArray(bookmarkNodes)) {
    const length = bookmarkNodes.length - 1;
    const random = getRandomInt(0, length);
    const bookmark = bookmarkNodes[random];
    if (bookmark.children && bookmark.children.length > 0) {
      return genaratorAnchor(bookmark.children);
    }
    return `
      <section">
        <a href="${bookmark.url}" target="_blank" class="has-text-black-ter">${bookmark.title}</a>
      </section>
    `;
  }
}

function resetData() {
  $('#bookmarks').empty();
  showFolder();
}
