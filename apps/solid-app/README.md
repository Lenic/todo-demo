# Solid.js Todo 应用

基于 Solid.js 框架构建的现代 Todo 应用，展示了响应式编程模型和虚拟化列表的性能优势。

## 🚀 特性

### 核心功能

- **完整的 Todo 管理**: 创建、编辑、删除、完成/取消完成任务
- **任务分类和状态管理**: 支持截止日期设置和实时切换过期状态
- **本地存储**: 使用IndexedDB进行数据持久化
- **虚拟化列表**: 高性能的长列表渲染

### 技术特性

- **Solid.js**: 真正的响应式框架，无虚拟 DOM
- **TypeScript**: 完整的类型安全支持
- **Vite**: 快速的构建工具和开发服务器
- **Tailwind CSS**: 现代化的样式系统
- **Signals**: 基于 RxJS 和 Signal 细粒度的响应式状态管理

### 性能优势

- **无虚拟 DOM**: 直接操作真实 DOM，性能更优
- **细粒度更新**: 只有变化的部分会重新渲染
- **编译时优化**: 编译时生成最优的更新代码
- **内存友好**: 更少的内存占用和垃圾回收

## 🛠 技术栈

- **框架**: Solid.js 1.9
- **语言**: TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **状态管理**: Solid.js Signals + RxJS
- **路由**: Solid Router
- **国际化**: i18next
- **代码规范**: ESLint + Prettier
- **存储**: IndexedDB
- **虚拟化列表**: 自定义虚拟化组件

## 📁 项目结构

```
solid-app/
├── src/                       # 源代码
│   ├── components/            # 可复用组件
│   │   ├── content-loader.tsx # 内容加载器
│   │   ├── ui/                # UI基础组件
│   │   └── virtualized/       # 虚拟化列表组件
│   ├── hooks/                 # 自定义 Hooks
│   ├── i18n/                  # 国际化配置
│   ├── libs/                  # 工具库
│   ├── modules/               # 功能模块
│   │   ├── setting/           # 设置模块
│   │   └── todo/              # Todo 模块
│   ├── App.tsx                # 主应用组件
│   ├── index.css              # 全局样式
│   └── index.tsx              # 应用入口
├── public/                    # 静态资源
└── package.json               # 项目配置
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

### 虚拟化组件 (`src/components/virtualized/`)

- **index.ts**: 虚拟化组件入口
- **range.tsx**: 范围选择器
- **README.md**: 虚拟化组件说明

### 核心组件 (`src/components/`)

- **content-loader.tsx**: 内容加载器
- **ui/**: 基于 shadcn/ui 的 UI 组件库

## 🔧 开发指南

### Solid.js 特性

- **组件**: 使用函数式组件，只执行一次
- **Signals**: 响应式状态管理
- **Effects**: 副作用管理
- **Memo**: 计算值缓存

### 代码规范

- 使用 ESLint 进行代码检查
- 遵循 TypeScript 最佳实践
- 组件使用函数式组件
- 充分利用 Solid.js 的响应式特性

### 状态管理

- 使用 Solid.js Signals 进行状态管理
- 支持细粒度的响应式更新
- 自动依赖追踪和更新

### 组件开发

- 使用 shadcn/ui 组件库
- 支持深色/浅色主题
- 响应式设计，支持移动端
- 组件化架构，易于维护

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

### Solid.js 优势

- **无虚拟 DOM**: 直接操作真实 DOM
- **编译时优化**: 生成最优的更新代码
- **细粒度更新**: 只有变化的部分重新渲染
- **内存友好**: 更少的内存占用

### 应用级优化

- **虚拟化列表**: 长列表的性能优化
- **懒加载**: 组件和路由的懒加载
- **代码分割**: 路由级别的代码分割
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
- **Solid.js DevTools**: 开发调试工具

## 🆚 与其他框架对比

### Solid.js vs React

- **性能**: Solid.js 无虚拟 DOM，性能更优
- **更新粒度**: Solid.js 细粒度更新，React 组件级更新
- **内存**: Solid.js 内存占用更少
- **学习曲线**: React 生态更丰富，Solid.js 概念更简单

### Solid.js vs Vue

- **响应式**: Solid.js 编译时响应式，Vue 运行时响应式
- **性能**: Solid.js 性能更优
- **生态**: Vue 生态更成熟

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 📄 许可证

本项目采用 MIT 许可证。
