# 计算器前端 (Calculator Frontend)

前后端分离计算器系统的**前端**，使用原生 HTML / CSS / JavaScript 实现，无需任何构建工具。

## 功能

- 计算器键盘：数字、四则运算（`+ - × ÷`）、括号、小数点
- 支持键盘输入：数字键、`+ - * / ( )`、`Enter` 计算、`Esc` 清空
- 表达式发送到后端计算，结果由后端返回（前端不做核心计算）
- 展示后端数据库中的计算历史，可删除单条记录、清空全部记录
- 后端服务连接状态指示

## 技术栈

- HTML5 / CSS3 / 原生 JavaScript (ES2017+)
- 使用 `fetch` 调用后端 REST API

## 目录结构

```
calculator_frontend/
├── src/
│   ├── index.html        # 页面结构
│   ├── css/
│   │   └── style.css     # 样式
│   └── js/
│       ├── config.js     # 后端地址等配置
│       ├── api.js        # API 请求封装
│       └── app.js        # 页面逻辑
├── README.md
└── codestyle.md
```

## 运行方式

1. 先启动后端服务（见 `calculator_backend` 的 README）。
2. 用任意静态服务器托管 `src` 目录，例如：

   ```bash
   # Python 自带
   cd src
   python -m http.server 8080
   ```

   或直接双击 `src/index.html` 用浏览器打开。

3. 浏览器访问 `http://localhost:8080`。

## 配置后端地址

默认后端地址为 `http://127.0.0.1:5000`，在 `src/js/config.js` 中修改：

```js
const APP_CONFIG = {
  API_BASE_URL: window.CALC_API_BASE_URL || 'http://127.0.0.1:5000',
  ...
};
```

也可以在 `index.html` 加载脚本前注入：

```html
<script>window.CALC_API_BASE_URL = 'https://your-backend.example.com';</script>
```

## API 依赖

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/api/calculate` | 提交表达式并返回结果 |
| GET | `/api/history` | 获取历史记录 |
| DELETE | `/api/history/{id}` | 删除单条记录 |
| DELETE | `/api/history` | 清空全部记录 |
| GET | `/api/health` | 后端健康检查 |
