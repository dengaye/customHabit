document.addEventListener('DOMContentLoaded', function () {
  handleShortCut();
})

/** 一些快捷键 */
function handleShortCut() {
  $(document).keydown((event) => {
    /** ctrl + x */
    if (event.ctrlKey) {
      switch(event.key) {
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
