# mainfest.json

`manifest.json` 位于项目的根目录下。Chrome extension 的配置文件。

[常用 manifest.json 字段介绍](./docs/manifest.md)

## background 可选

指定一个需要运行的 service worker 文件，在后台运行。

与 web 中的 service worker 不同，extension service worker 在需要时被加载，休眠时卸载。

不能访问 DOM，但是可以来处理屏幕外的文档。

[Service Worker](https://developer.chrome.com/docs/extensions/mv3/service_workers/#manifest) 处理和监听浏览器事件。在这里可以使用所有的 Chrome API.

```json
{
  "background": {
    "service_worker": "",
    "type": "module",
  }
}
```

## [Content scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/) 可选
content_scripts 中的文件时网页的上下文中运行的，可以读取页面中 DOM 的详细信息，并对它进行更改，然后传递消息给 parent extension

包含页面上要执行的所有的 js 文件。可以读取页面的 DOM，也可以使用 Chrome APIs。可以与 service worker 进行交互，完成一些特定的功能。

```json
{
  "content_scripts" : [
    {
      "matches": ["<all_urls>"],
      "css": [],
      "js": []
    }
  ]
}

```