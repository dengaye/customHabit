const PREFIX = 'CUSTOM_HUBIT';

function addPrefix(str) {
  return `${PREFIX}_${str}`;
}

/**
 * 链接 hover 时的样式
 */
const ANCHOR_HOVER_CLASS_NAME = addPrefix(`has-text-link`);

const ADD_DIALOG_ID_NAME = 'adddialog';
const EDIT_DIALOG_ID_NAME = 'editdialog';
const DELETE_DIALOG_ID_NAME = 'deletedialog';

const ADD_OPERATION_ID_NAME = addPrefix('addlink');
const EDIT_OPERATION_ID_NAME = addPrefix('editlink');
const EDLETE_OPERATION_ID_NAME = addPrefix('deletelink');

/** 操作文件夹 */
const ADD_FOLDER_OPERATION_ID_NAME = addPrefix('addFolderlink');

const CUSTOM_HUBIT_DIALOG = 'customHubiDtialog';

const OPERATION_TYPE_MAP = {
  ADD: "add",
  EDIT: "edit",
  DELETE: "delete",
  ADD_FLODER: 'addFolder'
}

const OPERATION_ID_NAME_MAP = {
  [OPERATION_TYPE_MAP.ADD]: ADD_OPERATION_ID_NAME,
  [OPERATION_TYPE_MAP.EDIT]: EDIT_OPERATION_ID_NAME,
  [OPERATION_TYPE_MAP.DELETE]: EDLETE_OPERATION_ID_NAME
}

const DIALOG_ID_NAME_MAP = {
  [OPERATION_TYPE_MAP.ADD]: ADD_DIALOG_ID_NAME,
  [OPERATION_TYPE_MAP.EDIT]: EDIT_DIALOG_ID_NAME,
  [OPERATION_TYPE_MAP.DELETE]: DELETE_DIALOG_ID_NAME
}

/** 操作组件 id */
const OPERATION_WRAPPER_ID_NAME = 'operationWrapper';