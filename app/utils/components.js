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
  }

  init = () => {
    const { anchor, bookmarkNode, hasAnchor } = this;

    if (!hasAnchor) {
      this.anchor.append(`
        <span class="icon is-small js-angle-icon mu-animation is-align-self-baseline mt-3">
          ${rightAngleIcon()}
        </span>
      `)
      this.addIcon()
    } else {
      this.addWebIcon(bookmarkNode.url);
      this.hover()
    }

    anchor.append(`<span>${bookmarkNode.title}</span>`);

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
    const { anchor, hasAnchor, bookmarkNode } = this;

    anchor.on('click', () => {
      if (!hasAnchor) {
        return
      };
      chrome.tabs.create({ url: bookmarkNode.url });
    })
  }

  update = (bookmarkNode) => {
    this.bookmarkNode = bookmarkNode;
    this.anchor.off('click');
    this.anchor.empty();
    this.init();
  }

  addIcon = () => {
    this.anchor.append(`
      <span class="icon is-small is-align-self-baseline mt-3">
        ${fileIcon()}
      </span>
    `);
  }

  addWebIcon = (url) => {
    this.anchor.append(
      createFavicon(url).addClass("is-align-self-baseline mt-3")
    )
  }
}

/**
 * 操作
 */
class Operation {
  /**
   * @param {{ operationIdName, dialogIdName, type, successCallback }[]} options 
   */
  constructor(bookmarkNode, options) {
    this.bookmarkNode = bookmarkNode;
    const content = this.initContent(options);
    this.content = content;
  }

  initContent = (options) => {
    const displayOptions = this.getDisplayOptions(options);
    this.displayOptions = displayOptions;

    const contents = displayOptions.map((displayOption, index) => {
      const mbClassName = displayOptions.length - 1 !== index ? ' mb-2' : '';
      return `
        <li class="menu-item is-clickable${mbClassName} ${displayOption.className}" id="${displayOption.operationIdName}">
          ${displayOption.text}
        </li>
      `;
    })

    const content = $(`
      <ul class="menu-list">
        ${contents.join('')}
      </ul>
    `);

    return content;
  }


  onClick = () => {
    this.displayOptions.forEach(option => {
      const { operationIdName, dialogIdName, successCallback } = option;
      const dialogInstance = this.createDialog(option);
      if (!dialogInstance) return;

      $(`#${operationIdName}`).on('click', (event) => {
        event.stopPropagation();
        $(`#${dialogIdName}`)
          .empty()
          .append(dialogInstance.dialogContent());

        dialogInstance.onShow();

        if (dialogInstance.onInput) {
          dialogInstance.onInput();
        }

        dialogInstance.onConfirm({
          callback: (newBooknode) => {
            if (successCallback) {
              successCallback(newBooknode);
            }
          }
        });
        dialogInstance.onCancel();
      })
    })
  }

  getDisplayOptions = (options) => {
    const { bookmarkNode } = this;
    const tmp = [];
    /** 是否是文件夹 */
    const isFolder = !bookmarkNode.url;
    const folderActions = [OPERATION_TYPE_MAP.ADD_FLODER, OPERATION_TYPE_MAP.ADD, OPERATION_TYPE_MAP.EDIT, OPERATION_TYPE_MAP.DELETE];
    const linkActions = [OPERATION_TYPE_MAP.EDIT, OPERATION_TYPE_MAP.DELETE];
    options.forEach(option => {
      if (isFolder) {
        if (folderActions.includes(option.type)) {
          tmp.push(option);
        }
      } else {
        if (linkActions.includes(option.type)) {
          tmp.push(option);
        }
      }
    });
    return tmp;
  }

  /** 创建弹窗 */
  createDialog = (option) => {
    const { dialogIdName, type } = option;
    const { bookmarkNode } = this;
    const dialogInstanceMap = {
      [OPERATION_TYPE_MAP.ADD]: AddDialog,
      [OPERATION_TYPE_MAP.EDIT]: EditDialog,
      [OPERATION_TYPE_MAP.DELETE]: DeleteDialog,
      [OPERATION_TYPE_MAP.ADD_FLODER]: AddFolderDialog,
    }
    let DialogInstance = dialogInstanceMap[type];
    if (DialogInstance) {
      return new DialogInstance({ bookmarkNode, dialogIdName })
    };
  }
}
