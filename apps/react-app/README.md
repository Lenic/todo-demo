# React Todo 应用

基于Vite构建的现代React Todo应用，专注于客户端渲染和快速开发体验。

## 🚀 特性

### 核心功能

- **完整的 Todo 管理**: 创建、编辑、删除、完成/取消完成任务
- **任务分类和状态管理**: 支持截止日期设置和实时切换过期状态
- **本地存储**: 使用 IndexedDB 进行数据持久化
- **虚拟化列表**: 高性能的长列表渲染

### 技术特性

- **React 19**: 最新的 React 特性和 Hooks
- **TypeScript**: 完整的类型安全支持
- **Vite**: 快速的构建工具和开发服务器
- **Tailwind CSS**: 现代化的样式系统
- **响应式状态**: 基于 Hooks + RxJS 主动推送的状态管理

### 用户体验

- **响应式设计**: 支持移动端和桌面端
- **主题切换**: 浅色/深色/跟随系统 + 多种主题色
- **国际化**: 多语言支持（中文/英文/日文）

## 🛠 技术栈

- **框架**: React 19
- **语言**: TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **状态管理**: React Hooks + RxJS
- **路由**: React Router
- **国际化**: i18next
- **代码规范**: ESLint + Prettier
- **存储**: IndexedDB

## 📁 项目结构

```
react-app/
├── src/                     # 源代码
│   ├── components/          # 可复用组件
│   │   └── ui/              # UI基础组件
│   ├── hooks/               # 自定义 Hooks
│   ├── i18n/                # 国际化配置
│   ├── lib/                 # 工具函数
│   ├── modules/             # 功能模块
│   │   ├── setting/         # 设置模块
│   │   └── todo/            # Todo 模块
│   ├── App.tsx              # 主应用组件
│   ├── index.css            # 全局样式
│   └── main.tsx             # 应用入口
├── public/                  # 静态资源
└── package.json             # 项目配置
```

## 🚀 快速开始

### 环境要求

- Node.js 22+
- pnpm 10+

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看应用。

### 构建生产版本

```bash
pnpm build
```

### 预览构建结果

```bash
pnpm preview
```

## 📚 主要模块

### Todo 模块 (`src/modules/todo/`)

- **create-new.tsx**: 创建新任务组件
- **editor.tsx**: 任务编辑组件
- **index.tsx**: 主Todo页面
- **components/**: Todo相关子组件
  - **auto-tooltip.tsx**: 自动提示组件
  - **date-picker.tsx**: 日期选择器
  - **loading-sketch.tsx**: 加载骨架屏

### 设置模块 (`src/modules/setting/`)

- **language-toggle.tsx**: 语言切换组件
- **theme-toggle.tsx**: 主题切换组件
- **theme-color-toggle.tsx**: 主题色切换组件

### 核心组件 (`src/components/`)

- **ui/**: 基于 shadcn/ui 的UI组件库
- 响应式设计，支持深色/浅色主题

## 🔧 开发指南

### 代码规范

- 使用 ESLint 进行代码检查
- 遵循 TypeScript 最佳实践
- 组件使用函数式组件和 Hooks

### 状态管理

- 使用 DI + RxJS 进行全局状态管理
- 本地状态使用 useState
- 支持响应式数据更新

### 组件开发

- 使用 shadcn/ui 组件库
- 支持深色/浅色主题
- 响应式设计，支持移动端
- 组件化架构，易于维护

### 样式系统

- 使用 Tailwind CSS 进行样式开发
- 支持 CSS 变量和主题切换
- 响应式设计，支持多种屏幕尺寸

## 🌐 国际化

应用支持多语言，当前支持：

- 中文 (zh-CN)
- 英文 (en-US)
- 日文 (ja-JP)

语言文件位于 `src/i18n/locales/` 目录下。

## 🎨 主题系统

### 主题模式

- **浅色主题**: 明亮清晰的界面
- **深色主题**: 护眼的暗色界面

### 主题色

支持多种主题色选择，包括：

- 蓝色
- 绿色
- 灰色 (默认)
- 黄色

## 📱 响应式设计

应用采用移动优先的响应式设计：

- **移动端**: 320px - 768px
- **桌面端**: 768px+

## 🚀 性能优化

- **代码分割**: 路由级别的代码分割
- **懒加载**: 组件和路由的懒加载
- **虚拟化**: 长列表的虚拟化渲染
- **缓存策略**: 合理的缓存配置

## 📦 构建和部署

### 开发环境

```bash
pnpm dev
```

### 生产构建

```bash
pnpm build
```

### 预览构建结果

```bash
pnpm preview
```

### 部署

构建后的文件位于 `dist/` 目录，可以部署到任何静态文件服务器。

## 🔍 开发工具

- **Vite**: 快速的开发服务器和构建工具
- **ESLint**: 代码质量检查
- **TypeScript**: 类型检查和智能提示
- **Tailwind CSS**: 原子化 CSS 框架

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 📄 许可证

本项目采用 MIT 许可证。
