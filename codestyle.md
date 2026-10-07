# 前端代码规范 (Frontend Code Style)

> **规范来源**：本项目的 JavaScript / HTML / CSS 代码遵循
> [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)
> 与 [Google HTML/CSS Style Guide](https://google.github.io/styleguide/htmlcssguide.html)，
> 并结合本项目实际情况做了少量取舍。

## 1. 通用原则

- 使用 UTF-8 编码，缩进统一为 **2 个空格**，不使用 Tab。
- 每行不超过 100 个字符。
- 文件末尾保留一个换行符，去除行尾多余空格。
- 避免全局变量污染，模块使用 IIFE 或 `window` 显式挂载。

## 2. JavaScript

### 2.1 变量与声明

- 一律使用 `const`，需要重新赋值时使用 `let`，**禁止使用 `var`**。
- 变量、函数使用小驼峰命名：`loadHistory`、`apiBaseUrl`。
- 常量（不会变化的配置）使用全大写下划线：`API_BASE_URL`。
- 构造函数 / 类使用大驼峰：`CalculatorApi`。

### 2.2 字符串

- 优先使用单引号 `'...'`；包含单引号时使用模板字符串。

### 2.3 函数

- 函数职责单一，命名用动词开头：`renderHistory`、`deleteRecord`。
- 异步函数统一使用 `async / await`，并用 `try / catch` 处理异常。
- 箭头函数用于回调，普通函数用于需要 `this` 的场景。

### 2.4 注释

- 每个文件顶部写文件级注释，说明用途。
- 导出函数使用 JSDoc 注释参数与返回值。

### 2.5 错误处理

- 不允许静默吞掉异常，必须给出用户可见的提示或日志。
- 与后端交互统一由 `api.js` 封装，其他模块只调用其方法。

## 3. HTML

- 使用语义化标签（`header`、`main`、`section`、`aside`、`footer`）。
- 标签、属性使用小写，属性值使用双引号。
- 为交互元素添加 `aria-*` 属性以提升可访问性。
- 缩进 2 个空格，嵌套层级清晰。

## 4. CSS

- 使用 `kebab-case` 类名：`.history-item`、`.key-equals`。
- 使用 CSS 变量管理颜色等主题值（定义在 `:root`）。
- 避免使用 `!important`。
- 选择器尽量简短，避免过深的嵌套。

## 5. 文件命名

- 文件名小写，多个单词用连字符：`style.css`、`config.js`。
