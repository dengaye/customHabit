## 开发中需要使用的 `mainfest.json` 中配置项

### 开发中使用 `import`

```

```

### 读取浏览器书签数据
  
在 `mainfest.json` 中声明 `bookmarks` 权限
  
```
{
  "permissions": ["bookmarks"]
}
```

### 打开新 `Tab` 后，展示页面

`mainfest.json` 中添加 `chrome_url_overrides` 

```
{
  "chrome_url_overrides": {
    "nnewtab": "bookmarks.html"
  }
}

```

### 点击插件的图标后展示弹窗，需要自定义此弹窗

配置 `action.default_popup`

```
{
  "action": {
    "default_popup": "app/pop/popup.html"
  }
}
```

## 样式
