(function () {
  document.addEventListener('DOMContentLoaded', function () {
    handleShortCut();

    time();
  })

  /** 一些快捷键 */
  function handleShortCut() {
    $(document).keydown((event) => {
      /** ctrl + x */
      if (event.ctrlKey) {
        switch (event.key) {
          case 'f': {
            event.preventDefault();
            $('#search').focus();
            break;
          }
          default:
            break;
        }
      }
    })
  }

  /** 时间 */
  function time() {
    const tody = new Date();
    const year = tody.getFullYear();
    const month = padZero(tody.getMonth() + 1);
    const day = padZero(tody.getDate());

    const weeks = ['日', '一', '二', '三', '四', '五', '六'];

    const week = `星期${weeks[tody.getDay()]}`;

    $('#time').text(`${year}-${month}-${day} ${week}`);
  }

  function padZero(num) {
    return num < 10 ? '0' + num : num;
  }
})()