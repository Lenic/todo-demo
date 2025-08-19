# Vue 3 Todo 应用

使用 Vue 3 Composition API 构建的现代 Todo 应用，展示了 Vue 生态系统的现代开发方式。

## 🚀 特性

### 核心功能

- **完整的 Todo 管理**: 创建、编辑、删除、完成/取消完成任务
- **任务分类和状态管理**: 支持截止日期设置和实时切换过期状态
- **本地存储**: 使用IndexedDB进行数据持久化
- **虚拟化列表**: 高性能的长列表渲染

### 技术特性

- **Vue 3**: 最新的 Vue 框架，支持 Composition API
- **TypeScript**: 完整的类型安全支持
- **Vite**: 快速的构建工具和开发服务器
- **Tailwind CSS**: 现代化的样式系统
- **Composition API**: 更好的逻辑复用和类型推导

### 用户体验

- **响应式设计**: 支持移动端和桌面端
- **主题切换**: 深色/浅色主题支持
- **国际化**: 多语言支持（中文/英文/日文）
- **流畅动画**: 基于 Vue Transition 的平滑过渡

## 🛠 技术栈

- **框架**: Vue 3
- **语言**: TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **状态管理**: Vue 3 Composition API + RxJS
- **路由**: Vue Router 4
- **国际化**: Vue I18n
- **代码规范**: ESLint + Prettier
- **存储**: IndexedDB
- **UI 组件**: shadcn/ui (Vue 版本)

## 📁 项目结构

```
vue-app/
├── src/                     # 源代码
│   ├── assets/              # 静态资源
│   │   └── index.css        # 全局样式
│   ├── components/          # 可复用组件
│   │   └── ui/              # UI 基础组件
│   ├── hooks/               # 自定义组合式函数
│   ├── i18n/                # 国际化配置
│   ├── lib/                 # 工具函数
│   ├── modules/             # 功能模块
│   │   ├── setting/         # 设置模块
│   │   └── todo/            # Todo 模块
│   ├── App.tsx              # 主应用组件
│   └── main.ts              # 应用入口
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

### UI组件库 (`src/components/ui/`)

- **alert-dialog/**: 警告对话框组件
- **button/**: 按钮组件
- **calendar/**: 日历组件
- **checkbox/**: 复选框组件
- **dialog/**: 对话框组件
- **dropdown-menu/**: 下拉菜单组件
- **form/**: 表单组件
- **input/**: 输入框组件
- **label/**: 标签组件
- **popover/**: 弹出框组件
- **tabs/**: 标签页组件
- **textarea/**: 文本域组件
- **toast/**: 提示组件
- **tooltip/**: 工具提示组件

## 🔧 开发指南

### Vue 3 特性

- **Composition API**: 更好的逻辑复用和类型推导
- **响应式系统**: 基于 Proxy 的响应式数据
- **组合式函数**: 可复用的逻辑封装
- **Teleport**: 组件渲染到指定位置
- **Suspense**: 异步组件加载

### 代码规范

- 使用 ESLint 进行代码检查
- 遵循 TypeScript 最佳实践
- 使用 Composition API 和组合式函数
- 遵循 Vue 3 官方风格指南

### 状态管理

- 使用 Vue 3 的响应式系统，配合 RxJS 避免代理复杂对象
- 组合式函数进行状态封装
- 支持响应式数据更新
- 自动依赖追踪

### 组件开发

- 使用 shadcn/ui 组件库
- 支持深色/浅色主题
- 响应式设计，支持移动端
- 组件化架构，易于维护
- 基于 Vue Transition 的动画效果

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

### Vue 3 优势

- **响应式系统**: 基于 Proxy，性能更优
- **编译时优化**: 模板编译优化
- **Tree-shaking**: 更好的代码分割
- **组合式API**: 更好的逻辑复用

### 应用级优化

- **懒加载**: 组件和路由的懒加载
- **代码分割**: 路由级别的代码分割
- **缓存策略**: 合理的缓存配置
- **虚拟滚动**: 长列表的性能优化

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
- **Vue DevTools**: Vue开发调试工具

## 🆚 与其他框架对比

### Vue 3 vs React

- **学习曲线**: Vue 3 更易学习
- **模板语法**: Vue 3 的模板更直观
- **响应式**: Vue 3 的响应式系统更简单
- **生态**: React 生态更丰富

### Vue 3 vs Solid.js

- **性能**: Solid.js 性能更优
- **响应式**: Solid.js 编译时响应式
- **学习曲线**: Vue 3 更易上手
- **生态**: Vue 生态更成熟

## 🎭 动画和过渡

应用使用 Vue 3 的 Transition 系统：

- **页面切换**: 平滑的页面过渡
- **组件动画**: 组件的进入/离开动画
- **状态变化**: 数据变化的过渡效果
- **CSS 动画**: 基于 CSS 的动画效果

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 📄 许可证

本项目采用 MIT 许可证。
