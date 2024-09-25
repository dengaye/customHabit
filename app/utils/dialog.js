class InputWithDialog {
  /**
   * @param {{ dialogIdName: string, fieldClassName: string, label: string, tip: string, value }} props 
   */
  constructor(props) {
    this.props = props;
  }

  onInput = () => {
    const { dialogIdName, fieldClassName } = this.props;
    const $filed = $(`#${dialogIdName} .${fieldClassName}`);
    $filed.find('.input').on("input", (e) => {
      if (e.target.value && $(e.target).hasClass('is-danger')) {
        $(e.target).removeClass("is-danger");
        $filed.find('.help').remove();
      }
    })
  }

  onValidField = () => {
    const { dialogIdName, fieldClassName, tip } = this.props;
    const $filed = $(`#${dialogIdName} .${fieldClassName}`);
    const value = this.getValue();
    if (!value) {
      const hasSetInvalid = this.hasInvalid();
      if (hasSetInvalid) {
        return false;
      }
      $filed.append(`
        <p class="help is-danger">${tip}</p>
      `);
      $filed.find('.input').addClass("is-danger");
      return false;
    }
    return value
  }

  setTip = (tip) => {
    const { dialogIdName, fieldClassName } = this.props;
    const newTip = tip || this.props.tip;
    const $filed = $(`#${dialogIdName} .${fieldClassName}`);

    const hasSetInvalid = this.hasInvalid();

    if (hasSetInvalid) {
      $filed.find('.help').text(newTip);
      return;
    }
    
    $filed.append(`
      <p class="help is-danger">${newTip}</p>
    `);
  }
  
  getValue = () => {
    const { dialogIdName, fieldClassName } = this.props;
    const $filed = $(`#${dialogIdName} .${fieldClassName}`);
    const $input = $filed.find('.input');
    const value = $input.val();
    return value;
  }

  // 是否已经设置了 invalid class
  hasInvalid = () => {
    const { dialogIdName, fieldClassName } = this.props;
    const $input = $(`#${dialogIdName} .${fieldClassName} .input`);
    if ($input.hasClass("is-danger")) {
      return true;
    }
    return false;
  }

  createInput = () => {
    const { fieldClassName, label, value = "" } = this.props;
    return `
      <div class="field ${fieldClassName}">
        <label class="label">${label}</label>
        <div class="control">
          <input class="input" type="text" placeholder="${label}" value="${value}">
        </div>
      </div>
    `
  }
};

class BasicDialog {
  /**
   * @param {{ dialogIdName, bookmarkNode }} props 
   */
  constructor(props) {
    this.props = props;
  }
  onClickConfirmBtn = (callback) => {
    $(`#${this.props.dialogIdName} .js-confirm-button`).click(
      () => {
        callback()
      }
    );
  }

  onShow = () => {
    $(`#${this.props.dialogIdName}`).addClass("is-active");
  }

  onHide = () => {
    $(`#${this.props.dialogIdName}`).removeClass("is-active");
  }

  onCancel = () => {
    $(`#${this.props.dialogIdName} .js-cancel-button`).click(
      () => {
        this.onHide();
      }
    );
  }
  commonContent = ({ title, contentSlot, confirmClassName }) => {
    return $(`
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title break-all is-flex-shrink-1">${title}</p>
        </header>
        ${contentSlot || ""}
        <footer class="modal-card-foot">
          <div class="buttons">
            <button class="button is-success js-confirm-button ${confirmClassName || ""}">确认</button>
            <button class="button js-cancel-button">取消</button>
          </div>
        </footer>
      </div>
    `)
  }
}

/** 添加书签 */
class AddDialog extends BasicDialog {
  /**
   * @param {{ dialogIdName, bookmarkNode }} props 
   */
  constructor(props) {
    super(props);
    const { dialogIdName } = this.props;
    this.titleInput = new InputWithDialog({
      dialogIdName,
      fieldClassName: "js-title-field",
      label: "标题",
      tip: "标题不能为空"
    });

    this.urlInput = new InputWithDialog({
      dialogIdName,
      fieldClassName: "js-url-field",
      label: "URL",
      tip: "URL 不能为空"
    });
  }

  onConfirm = ({ callback }) => {
    const { bookmarkNode } = this.props;
    this.onClickConfirmBtn(async () => {
      const titleValue = this.titleInput.onValidField();
      const urlValue = this.urlInput.onValidField();
      if (!titleValue || !urlValue) {
        return;
      }
      try {
        const newBookmark = await chrome.bookmarks.create({
          parentId: bookmarkNode.id,
          title: titleValue,
          url: urlValue
        });
        this.onHide();
        if (callback) {
          callback(newBookmark);
        }
      } catch (error) {
        this.urlInput.setTip(`${error}`)
      }
    });
  }

  onInput = () => {
    this.titleInput.onInput();
    this.urlInput.onInput();
  }

  dialogContent = () => {
    return this.commonContent({
      title: `添加新标签到 ${this.props.bookmarkNode.title}`,
      contentSlot: `
        <section class="modal-card-body">
          ${this.titleInput.createInput()}
          ${this.urlInput.createInput()}
        </section>
      `
    })
  }
};

/** 删除书签 */
class DeleteDialog extends BasicDialog {
  onConfirm = ({ callback }) => {
    const { bookmarkNode } = this.props;
    this.onClickConfirmBtn(async () => {
      await chrome.bookmarks.removeTree(String(bookmarkNode.id));
      this.onHide();
      if (callback) {
        callback(bookmarkNode);
      }
    });
  }
  dialogContent = () => {
    const { url, title} = this.props.bookmarkNode;
    const isFolder = !url;
    return this.commonContent({
      title: `删除此${isFolder ? '文件夹' : '标签'} ${title}`,
      confirmClassName: "is-danger"
    })
  }
}

/** 编辑书签 */
class EditDialog extends BasicDialog {
  /**
   * 
   * @param {{ dialogIdName, bookmarkNode }} props 
   */
  constructor(props) {
    super(props);
    const { title, url } = props.bookmarkNode;
    this.titleInput = new InputWithDialog({
      dialogIdName: this.props.dialogIdName,
      fieldClassName: "js-title-field",
      label: "标题",
      tip: "标题不能为空",
      value: title,
    });
    const isFolder = !url;
    this.isFolder = isFolder;
    if (!isFolder) {
      this.urlInput = new InputWithDialog({
        dialogIdName: this.props.dialogIdName,
        fieldClassName: "js-url-field",
        label: "URL",
        tip: "URL 不能为空",
        value: url
      });
    }
  }
  onInput = () => {
    this.titleInput.onInput();
    if (this.urlInput) {
      this.urlInput.onInput();
    }
  }
  onConfirm = ({ callback }) => {
    this.onClickConfirmBtn(async () => {
      const titleValue = this.titleInput.onValidField();
      let urlValue = '';
      if (!titleValue) {
        return;
      }
      if (this.urlInput) {
        urlValue = this.urlInput.onValidField();
        if (!urlValue) {
          return;
        }
      }
      const { bookmarkNode } = this.props;
      const data = { title: titleValue };
      if (this.urlInput) {
        data.url = urlValue;
      }
      const newBookmark = await chrome.bookmarks.update(String(bookmarkNode.id), data);
      this.onHide();
      if (callback) {
        callback(newBookmark);
      }
    });
  }
  dialogContent = () => {
    return this.commonContent({
      title: '编辑此标签',
      contentSlot: `
        <section class="modal-card-body">
          ${this.titleInput.createInput()}
          ${this.isFolder ? '' : this.urlInput.createInput()}
        </section>
      `,
    })
  }
}

/** 添加文件夹 */
class AddFolderDialog extends BasicDialog {
  /**
   * @param {{ dialogIdName, bookmarkNode }} props 
   */
  constructor(props) {
    super(props);
    const { dialogIdName } = this.props;
    this.folderInput = new InputWithDialog({
      dialogIdName,
      fieldClassName: "js-title-field",
      label: "文件夹名称",
      tip: "文件夹名称不能为空"
    });
  }
 
  onConfirm = ({ callback }) => {
    const { bookmarkNode } = this.props;
    this.onClickConfirmBtn(async () => {
      const folderValue = this.folderInput.onValidField();
      if (!folderValue) {
        return;
      }
      const newBookmark = await chrome.bookmarks.create({
        parentId: bookmarkNode.id,
        title: folderValue
      });
      this.onHide();
      if (callback) {
        callback(newBookmark);
      }
    });
  }

  onInput = () => {
    this.folderInput.onInput();
  }

  dialogContent = () => {
    return this.commonContent({
      title: `添加文件夹到 ${this.props.bookmarkNode.title}`,
      contentSlot: `
        <section class="modal-card-body">
          ${this.folderInput.createInput()}
        </section>
      `
    })
  }
};