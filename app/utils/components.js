/**
 * 标题
 */
class Anchor {
  constructor(bookmarkNode) {
    this.bookmarkNode = bookmarkNode;
    this.hasAnchor = !!bookmarkNode.url;
    const className = `level is-justify-content-start is-flex is-align-items-baseline custom-item${this.hasAnchor ? "" : " title"}`
    this.anchor = $(`<a class="${className}">`);
    this.init();

    return this.anchor
  }

  init = () => {
    const { anchor, bookmarkNode, hasAnchor } = this;

    if (!hasAnchor) {
      this.addIcon()
    } else {
      this.addWebIcon(bookmarkNode.url);
      this.hover()
    }

    anchor.append(bookmarkNode.title);

    this.click();
  }

  hover = () => {
    this.anchor.hover(
      () => {
        this.anchor.addClass(ANCHOR_HOVER_CLASS_NAME)
      },
      () => {
        this.anchor.removeClass(ANCHOR_HOVER_CLASS_NAME)
      }
    )
  }

  click = () => {
    const { anchor, bookmarkNode, hasAnchor } = this;
    anchor.click(
      (e) => {
        if (!hasAnchor) {
          return
        };
        chrome.tabs.create({ url: bookmarkNode.url });
      }
    );
  }

  addIcon = () => {
    this.anchor.append(fileIcon());
  }

  addWebIcon = (url) => {
    this.anchor.append(createFavicon(url))
  }
}

/**
 * 操作
 */
class Operation {
  constructor(bookmarkNode) {
    this.bookmarkNode = bookmarkNode;
    const options = this.init();

    this.options = options;
  }

  init = () => {
    const { bookmarkNode } = this;
    const hasChildren = !!bookmarkNode.children;
    const options = hasChildren ? this.createAdd() : this.createEdit();

    const addDialog = new AddDialog({ bookmarkNode, dialogIdName: ADD_DIALOG_ID_NAME });
    const deleteDialog = new DeleteDialog({ dialogIdName: DELETE_DIALOG_ID_NAME, bookmarkNode })
    const editDialog = new EditDialog({ dialogIdName: EDIT_DIALOG_ID_NAME, bookmarkNode })

    this.dialogInstanceMap = {
      [OPERATION_TYPE_MAP.EDIT]: editDialog,
      [OPERATION_TYPE_MAP.ADD]: addDialog,
      [OPERATION_TYPE_MAP.DELETE]: deleteDialog
    }

    return options;
  }

  /**
   * @param {{ operationIdName, dialogIdName, type, successCallback }[]} options 
   */
  handleOperations = (options) => {
    options.forEach(option => {
      const { operationIdName, dialogIdName, type, successCallback } = option;
      const dialogInstance = this.dialogInstanceMap[type];
      if (!dialogInstance) return;

      $(`#${operationIdName}`).click((event) => {
        event.stopPropagation();
        $(`#${dialogIdName}`)
          .empty()
          .append(dialogInstance.dialogContent());

        dialogInstance.onShow();

        if (dialogInstance.onInput) {
          dialogInstance.onInput();
        }

        dialogInstance.onConfirm({
          callback: () => {
            if (successCallback) {
              successCallback();
            }
          }
        });
        dialogInstance.onCancel();
      })
    })
  }

  createAdd = () => {
    return $(`
      <ul class="menu-list">
        <li class="menu-item is-clickable pb-2" id="${ADD_OPERATION_ID_NAME}">添加</li>
      </ul>
    `);
  }

  createEdit = () => {
    return $(`
      <ul class="menu-list">
        <li class="menu-item is-clickable pb-2" id="${EDIT_OPERATION_ID_NAME}">编辑</li>
        <li class="menu-item is-clickable" id="${EDLETE_OPERATION_ID_NAME}">删除</li>
      </ul>
    `);
  }
}
