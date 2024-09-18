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
          <p class="modal-card-title">${title}</p>
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

  onConfirm = () => {
    const { bookmarkNode } = this.props;
    this.onClickConfirmBtn(async () => {
      const titleValue = this.titleInput.onValidField();
      const urlValue = this.urlInput.onValidField();
      if (!titleValue || !urlValue) {
        return;
      }
      try {
        await chrome.bookmarks.create({
          parentId: bookmarkNode.id,
          title: titleValue,
          url: urlValue
        });
        this.onHide();
        // todo
        window.resetData();
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

class DeleteDialog extends BasicDialog {
  onConfirm = ({ callback }) => {
    const { bookmarkNode } = this.props;
    this.onClickConfirmBtn(async () => {
      await chrome.bookmarks.remove(String(bookmarkNode.id));
      this.onHide();
      if (callback) {
        callback();
      }
    });
  }
  dialogContent = () => {
    return this.commonContent({
      title: '删除此标签',
      confirmClassName: "is-danger"
    })
  }
}

class EditDialog extends BasicDialog {
  constructor(props) {
    super(props);
    this.titleInput = new InputWithDialog({
      dialogIdName: this.props.dialogIdName,
      fieldClassName: "js-title-field",
      label: "标题",
      tip: "标题不能为空",
      value: this.props.bookmarkNode.title
    });
  }
  onInput = () => {
    this.titleInput.onInput();
  }
  onConfirm = () => {
    this.onClickConfirmBtn(async () => {
      const titleValue = this.titleInput.onValidField();
      if (!titleValue) {
        return;
      }
      const { bookmarkNode } = this.props;
      await chrome.bookmarks.update(String(bookmarkNode.id), {
        title: titleValue
      });
      this.onHide();
      // todo
      window.resetData();
    });
  }
  dialogContent = () => {
    return this.commonContent({
      title: '编辑此标签',
      contentSlot: `
        <section class="modal-card-body">
          ${this.titleInput.createInput()}
        </section>
      `,
    })
  }
}