# Next.js Todo 应用

基于 Next.js 15 构建的全栈 Todo 应用，展示了现代 React 开发的最佳实践。

## 🚀 特性

### 核心功能

- **完整的 Todo 管理**: 创建、编辑、删除、完成/取消完成任务
- **任务分类和状态管理**: 支持截止日期设置和实时切换过期状态
- **数据持久化**: 使用 PostgreSQL 数据库存储数据（Supabase）
- **虚拟化列表**: 高性能的长列表渲染

### 技术特性

- **Next.js 15**: 最新的 App Router 和 React Server Components
- **TypeScript**: 完整的类型安全支持
- **Tailwind CSS**: 现代化的样式系统
- **Drizzle ORM**: 类型安全的数据库操作
- **NextAuth.js**: 完整的认证系统
- **响应式状态**: 基于 Hooks + RxJS 主动推送的状态管理
- **国际化**: 多语言支持（中文/英文/日文）
- **主题样式**: 浅色/深色/跟随系统 + 多种主题色

### 架构特性

- **服务端渲染**: 更好的 SEO 和首屏加载性能
- **API 路由**: RESTful API 设计
- **中间件**: 请求拦截和认证检查
- **依赖注入**: 模块化的服务架构

## 🛠 技术栈

- **框架**: Next.js 15
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据库**: PostgreSQL + Drizzle ORM
- **认证**: NextAuth.js
- **状态管理**: React Hooks + RxJS
- **国际化**: next-intl
- **构建工具**: Turbopack
- **代码规范**: ESLint + Prettier

## 📁 项目结构

```
nextjs-app/
├── app/                    # Next.js App Router
│   ├── api/                # API路由
│   ├── globals.css         # 全局样式
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首页
│   ├── server/             # 服务端逻辑
│   └── todo/               # Todo页面
├── components/             # 可复用组件
│   ├── monitor/            # 监控组件
│   └── ui/                 # UI基础组件
├── hooks/                  # 自定义Hooks
├── i18n/                   # 国际化配置
├── lib/                    # 工具函数
├── modules/                # 功能模块
│   ├── todo/               # Todo模块
│   └── toolbar/            # 工具栏模块
├── services/               # 服务层
└── public/                 # 静态资源
```

## 🚀 快速开始

### 环境要求

- Node.js 22+
- PostgreSQL 14+
- pnpm 10+

### 安装依赖

```bash
pnpm install
```

### 环境配置

创建 `.env.local` 文件：

```env
# 数据库
DATABASE_URL="postgresql://username:password@localhost:5432/todo_db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# 其他配置...
```

### 数据库设置

```bash
# 运行数据库迁移
pnpm db:migrate

# 生成数据库类型
pnpm db:generate
```

### 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📚 主要模块

### Todo 模块 (`modules/todo/`)

- **create-new.tsx**: 创建新任务组件
- **editor.tsx**: 任务编辑组件
- **index.tsx**: 主 Todo 页面
- **components/**: Todo 相关子组件

### 工具栏模块 (`modules/toolbar/`)

- **language-toggle.tsx**: 语言切换
- **theme-toggle.tsx**: 主题切换
- **theme-color-toggle.tsx**: 主题色切换

### 服务层 (`services/`)

- **database-service**: 数据库操作服务
- **dictionary-service**: 字典服务
- **theme-service**: 主题管理服务

## 🔧 开发指南

### 代码规范

- 使用 ESLint 进行代码检查
- 遵循 TypeScript 最佳实践
- 组件使用函数式组件和 Hooks

### 组件开发

- 使用 shadcn/ui 组件库
- 支持深色/浅色主题，以及多种主题色
- 响应式设计，支持移动端

### 状态管理

- 使用 React Hooks + RxJS 进行全局状态管理
- 服务端状态通过 Server Actions 获取

## 🚀 部署

### 构建生产版本

```bash
pnpm build
```

### 预览构建结果

```bash
pnpm preview
```

### 环境变量

确保生产环境配置正确的环境变量：

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 📄 许可证

本项目采用 MIT 许可证。
