## background 可选
指定一个需要运行的 service worker 文件，在后台运行。
与 web 中的 service worker 不同，extension service worker 在需要时被加载，休眠时卸载。
不能访问 DOM，但是可以来处理屏幕外的文档。
[Service Worker](https://developer.chrome.com/docs/extensions/mv3/service_workers/#manifest)
```json
{
  "background": {
    "service_worker": "",
    "type": "module",
  }
}
```

## content_scripts 可选
content_scripts 中的文件时网页的上下文中运行的，可以读取页面中 DOM 的详细信息，并对它进行更改，然后传递消息给 parent extension

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