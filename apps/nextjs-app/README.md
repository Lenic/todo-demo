# Next.js Todo Application

A full-stack Todo application built with Next.js 15, showcasing modern React development best practices.

## 🚀 Features

### Core Functionality

- **Complete Todo Management**: Create, edit, delete, complete/uncomplete tasks
- **Task Categorization and State Management**: Support deadline settings and real-time expired status switching
- **Data Persistence**: Store data using PostgreSQL database (Supabase)
- **Virtualized Lists**: High-performance rendering for long lists

### Technical Features

- **Next.js 15**: Latest App Router and React Server Components
- **TypeScript**: Complete type safety support
- **Tailwind CSS**: Modern styling system
- **Drizzle ORM**: Type-safe database operations
- **NextAuth.js**: Complete authentication system
- **Reactive State**: Hooks + RxJS-based reactive state management with push notifications
- **Internationalization**: Multi-language support (Chinese/English/Japanese)
- **Theme Styling**: Light/dark/system following + multiple theme colors

### Architectural Features

- **Server-Side Rendering**: Better SEO and first-screen loading performance
- **API Routes**: RESTful API design
- **Middleware**: Request interception and authentication checks
- **Dependency Injection**: Modular service architecture

## 🛠 Technology Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: NextAuth.js
- **State Management**: React Hooks + RxJS
- **Internationalization**: next-intl
- **Build Tool**: Turbopack
- **Code Standards**: ESLint + Prettier

## 📁 Project Structure

```
nextjs-app/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── server/             # Server-side logic
│   └── todo/               # Todo page
├── components/             # Reusable components
│   ├── monitor/            # Monitoring components
│   └── ui/                 # UI base components
├── hooks/                  # Custom Hooks
├── i18n/                   # Internationalization config
├── lib/                    # Utility functions
├── modules/                # Feature modules
│   ├── todo/               # Todo module
│   └── toolbar/            # Toolbar module
├── services/               # Service layer
└── public/                 # Static assets
```

## 🚀 Quick Start

### Requirements

- Node.js 22+
- PostgreSQL 14+
- pnpm 10+

### Install Dependencies

```bash
pnpm install
```

### Environment Configuration

Create a `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/todo_db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Other configurations...
```

### Database Setup

```bash
# Run database migrations
pnpm db:migrate

# Generate database types
pnpm db:generate
```

### Start Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## 📚 Main Modules

### Todo Module (`modules/todo/`)

- **create-new.tsx**: Create new task component
- **editor.tsx**: Task editor component
- **index.tsx**: Main Todo page
- **components/**: Todo-related sub-components

### Toolbar Module (`modules/toolbar/`)

- **language-toggle.tsx**: Language switching
- **theme-toggle.tsx**: Theme switching
- **theme-color-toggle.tsx**: Theme color switching

### Service Layer (`services/`)

- **database-service**: Database operation services
- **dictionary-service**: Dictionary services
- **theme-service**: Theme management services

## 🔧 Development Guide

### Code Standards

- Use ESLint for code checking
- Follow TypeScript best practices
- Use functional components and Hooks

### Component Development

- Use shadcn/ui component library
- Support light/dark themes and multiple theme colors
- Responsive design supporting mobile devices

### State Management

- Use React Hooks + RxJS for global state management
- Server-side state through Server Actions

## 🚀 Deployment

### Build Production Version

```bash
pnpm build
```

### Preview Build Results

```bash
pnpm preview
```

### Environment Variables

Ensure correct environment variables in production:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## 🤝 Contributing

We welcome Issues and Pull Requests to improve this project.

## 📄 License

This project is licensed under the MIT License.
