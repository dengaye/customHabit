/**
 * 标题
 */
class Anchor {
  constructor(bookmarkNode) {
    this.bookmarkNode = bookmarkNode;
    this.hasAnchor = !!bookmarkNode.url;
    const className = `level is-justify-content-start is-flex custom-item${this.hasAnchor ? "" : " title"}`
    this.anchor = $(`<a class="${className}">`);
    this.init();

    return this.anchor
  }

  init = () => {
    const { anchor, bookmarkNode, hasAnchor } = this;

    if (!hasAnchor) {
      this.addIcon()
    } else {
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
}

const itemClassName = "level-item is-flex-grow-0 width-auto"
const tagClassName = "tag is-light has-text-weight-normal"

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
      <section class="${itemClassName}">
        <span id="${ADD_OPERATION_ID_NAME}" class="${tagClassName} is-primary">Add</span>
      </section>
    `)
  }

  createEdit = () => {
    return $(`
      <section class="${itemClassName}">
        <span id="${EDIT_OPERATION_ID_NAME}" class="${tagClassName} is-primary">Edit</span> &nbsp; &nbsp;
        <span id="${EDLETE_OPERATION_ID_NAME}" class="${tagClassName} is-danger">Delete</span>
      </section>
    `)
  }
}
