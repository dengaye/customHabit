# 开发 chrome extension 的流程
## Chrome extension 是什么？
想 Chrome 浏览器增加特性和功能来增强用户体验

## 技术
HTML
CSS
JavaScript

## APIS
- 浏览器提供的所有 JavaScript API
- Chrome 浏览器提供 API
[Chrome API reference](https://developer.chrome.com/docs/extensions/reference/)

[完整的 API](https://developer.chrome.com/docs/extensions/mv3/devguide/)


# 开发中需要使用的 `mainfest.json` 中配置项

`manifest.json` 位于项目的根目录下。Chrome extension 的配置文件。

[常用 manifest.json 字段介绍](./docs/manifest.md)


## 开发中使用 `import`

```

```

## 读取浏览器书签数据
  
在 `mainfest.json` 中声明 `bookmarks` 权限
  
```
{
  "permissions": ["bookmarks"]
}
```

## 打开新 `Tab` 后，展示页面

`mainfest.json` 中添加 `chrome_url_overrides` 

```
{
  "chrome_url_overrides": {
    "nnewtab": "bookmarks.html"
  }
}

```

## 点击插件的图标后展示弹窗，需要自定义此弹窗

配置 `action.default_popup`

```
{
  "action": {
    "default_popup": "app/pop/popup.html"
  }
}
```

## 使用网站图标

权限：`permissions: ['favicon']`

```
{
  "permissions": ["favicon"]
}

```

根据 pageUrl 获取 favicon 

```
function faviconURL(u) {
  const url = new URL(chrome.runtime.getURL("/_favicon/"));
  url.searchParams.set("pageUrl", u);
  url.searchParams.set("size", "32");
  return url.toString();
}
```

[详细介绍](https://developer.chrome.com/docs/extensions/how-to/ui/favicons?hl=zh-cn)

# 其他文件
HTML files。 
- [Popup](https://developer.chrome.com/docs/extensions/mv3/user_interface/#popup)
- [options pages](https://developer.chrome.com/docs/extensions/mv3/options/)
- [other HTML pages](https://developer.chrome.com/docs/extensions/mv3/architecture-overview/#html-files)
所有的页面都可以使用 Chrome APIs

# 常用技能
1. 引入资源
在 content_scripts 中:
```js
const image = chrome.runtime.getURL('image.png');

```
在 css 中：
```
 background-image:url('chrome-extension://__MSG_@@extension_id__/background.png');
```

所有的资源需要现在 manifest.json 中配置，
```json
{
  "web_accessible_resources": [
    {
      "resources": ["image/*.svg"],
      "matches": ["<all_urls>"]
    }
  ]
}

```