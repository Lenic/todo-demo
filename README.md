# Todo Demo 项目集合

这是一个包含多个前端框架实现的 Todo 应用演示项目集合，展示了不同技术栈在相同业务场景下的实现方式。

## 项目概述

本工作区包含以下四个主要项目，它们都实现了相同的 Todo 应用功能，但使用了不同的前端框架和技术栈：

- **Next.js App** - 基于 Next.js 15 的 React 应用
- **React App** - 基于 Vite 的 React 应用
- **Solid App** - 基于 Solid.js 的应用
- **Vue App** - 基于 Vue 3 的应用

## 共同特性

所有项目都实现了以下核心功能：

### 🎯 核心功能

- Todo 项目的增删改查操作
- 任务分类和状态管理
- 截止日期管理
- 国际化
- 深色/浅色主题 + 多主题色
- 基于 RxJS 的主动推送状态管理

### 🎨 用户界面

- 响应式设计，支持移动端和桌面端
- 深色/浅色/跟随系统
- 多语言支持
- 现代化的 UI 组件库
- 一致的用户体验

### 🛠 技术特性

- TypeScript 支持
- 组件化架构
- 状态管理
- 路由管理
- 样式系统（Tailwind CSS）
- 代码规范和 ESLint 配置

## 项目详情

- `apps/nextjs-app/`: 基于 Next.js 15 的全栈应用，包含服务端渲染、API 路由、认证系统等企业级特性。
- `apps/react-app/`: 使用 Vite 构建的现代 React 应用，专注于客户端渲染和快速开发体验。
- `apps/solid-app/`: 基于 Solid.js 框架的应用，展示了响应式编程模型和虚拟化列表的性能优势。
- `apps/vue-app/`: 使用 Vue 3 Composition API 构建的应用，展示了 Vue 生态系统的现代开发方式。

## 开发环境

### 前置要求

- Node.js 22+
- pnpm 10+

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm run dev:nextjs
pnpm run dev:react
pnpm run dev:solid
pnpm run dev:vue
```

### 构建项目

```bash
pnpm run build:nextjs
pnpm run build:react
pnpm run build:solid
pnpm run build:vue

# 预览必须在构建之后
pnpm run preview:nextjs
pnpm run preview:react
pnpm run preview:solid
pnpm run preview:vue
```

## 项目结构

```
todo-demo/
├── apps/                   # 应用项目
│   ├── nextjs-app/         # Next.js应用
│   ├── react-app/          # React应用
│   ├── solid-app/          # Solid.js应用
│   └── vue-app/            # Vue应用
├── packages/               # 共享包
│   ├── container/          # 依赖注入容器
│   ├── controllers/        # 控制器层
│   ├── indexed-db/         # IndexedDB服务
│   └── interface/          # 接口定义
└── README.md               # 项目说明文档
```

## 技术栈对比

| 特性     | Next.js            | React              | Solid.js       | Vue                    |
| -------- | ------------------ | ------------------ | -------------- | ---------------------- |
| 框架     | Next.js 15         | React 19           | Solid.js 1.9   | Vue 3                  |
| 构建工具 | Turbopack          | Vite               | Vite           | Vite                   |
| 状态管理 | React Hooks + RxJS | React Hooks + RxJS | Signals + RxJS | Composition API + RxJS |
| 样式     | Tailwind CSS       | Tailwind CSS       | Tailwind CSS   | Tailwind CSS           |
| 类型检查 | TypeScript         | TypeScript         | TypeScript     | TypeScript             |
| 路由     | Next.js Router     | React Router       | Solid Router   | Vue Router             |

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个项目集合。

## 许可证

本项目采用 MIT 许可证。
