# 再弹一条 · Fish Break

霓虹深海风格的轻肉鸽弹珠小游戏。手机拖动瞄准、松手发射；电脑支持鼠标和键盘。

**在线试玩：<https://stevenyang723.github.io/fish-break/>**

## 玩法

- 普通气泡 10 分，金色气泡 25 分；落入鱼缸后按倍率结算。
- 每关初始 3 条鱼，达标即可过关。
- 五关逐步解锁弹簧、旋转珊瑚和传送门。
- 过关后三选一升级；分裂鱼、连锁闪电、额外小鱼等 10 种能力可组合。
- 完成五关后可以继续无尽加时。
- 切换页面自动暂停，进度与最高分保存在当前浏览器。

## 本地运行

使用支持 `node:test` 的现代 Node.js，无须安装第三方依赖：

```bash
npm start
```

浏览器打开 <http://127.0.0.1:4317>。请通过 HTTP 服务访问，避免直接打开 ES 模块文件造成浏览器限制。

```bash
npm test
```

测试覆盖计分、鱼缸倍率、分裂、连锁、升级上限、关卡结束与存档恢复。

## GitHub Pages 部署

本项目无需构建。将仓库 **Settings → Pages → Build and deployment** 设置为：

- Source：**Deploy from a branch**
- Branch：**main**
- Folder：**/ (root)**

保存后，GitHub 自动发布网站。后续推送到 `main` 的提交会自动更新在线版本。

所有游戏资源使用相对路径，可部署在仓库子路径下。`.nojekyll` 表示直接发布静态文件。

## 源码

| 文件 | 用途 |
| --- | --- |
| `index.html` | 页面结构 |
| `style.css` | 响应式布局 |
| `arcade.css` | 霓虹街机皮肤 |
| `engine.js` | 物理与肉鸽玩法 |
| `renderer.js` | Canvas 场景与光效 |
| `game.js` | 输入、音效、UI 和存档 |
| `icon.svg` | 游戏图标 |
| `engine.test.mjs` | 游戏逻辑测试 |
| `server.mjs` | 本地静态预览服务 |

无服务端、无外部字体、无广告或追踪请求。音效默认关闭，可在右上角开启。
