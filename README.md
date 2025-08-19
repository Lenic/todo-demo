# Todo Demo Project Collection

A comprehensive collection of Todo applications built with different frontend frameworks, demonstrating how various technology stacks implement the same business requirements.

## Project Overview

This workspace contains four main projects, each implementing identical Todo application functionality using different frontend frameworks and technology stacks:

- **Next.js App**: React application built with Next.js 15
- **React App**: React application built with Vite
- **Solid App**: Application built with Solid.js
- **Vue App**: Application built with Vue 3

## Common Features

All projects implement the following core functionality:

### 🎯 Core Features

- Todo item CRUD operations
- Task categorization and state management
- Deadline management
- Internationalization
- Light/Dark theme + multiple theme colors
- RxJS-based reactive state management with push notifications

### 🎨 User Interface

- Responsive design supporting mobile and desktop
- Light/Dark/Match system
- Multi-language support
- Modern UI component library
- Consistent user experience

### 🛠 Technical Features

- TypeScript support
- Component-based architecture
- State management
- Routing
- Styling system (Tailwind CSS)
- Code standards and ESLint configuration

## Project Details

- `apps/nextjs-app/`: Full-stack application built with Next.js 15, featuring server-side rendering, API routes, authentication system, and enterprise-level capabilities.
- `apps/react-app/`: Modern React application built with Vite, focusing on client-side rendering and rapid development experience.
- `apps/solid-app/`: Application built with Solid.js framework, showcasing reactive programming models and virtualized list performance advantages.
- `apps/vue-app/`: Application built with Vue 3 Composition API, demonstrating modern development approaches within the Vue ecosystem.

## Development Environment

### Prerequisites

- Node.js 22+
- pnpm 10+

### Install Dependencies

```bash
pnpm install
```

### Start Development Servers

```bash
pnpm run dev:nextjs
pnpm run dev:react
pnpm run dev:solid
pnpm run dev:vue
```

### Build Projects

```bash
pnpm run build:nextjs
pnpm run build:react
pnpm run build:solid
pnpm run build:vue

# Preview must be run after building
pnpm run preview:nextjs
pnpm run preview:react
pnpm run preview:solid
pnpm run preview:vue
```

## Project Structure

```
todo-demo/
├── apps/                   # Application projects
│   ├── nextjs-app/         # Next.js application
│   ├── react-app/          # React application
│   ├── solid-app/          # Solid.js application
│   └── vue-app/            # Vue application
├── packages/               # Shared packages
│   ├── container/          # Dependency injection container
│   ├── controllers/        # Controller layer
│   ├── indexed-db/         # IndexedDB service
│   └── interface/          # Interface definitions
└── README.md               # Project documentation
```

## Technology Stack Comparison

| Feature    | Next.js            | React              | Solid.js       | Vue                    |
| ---------- | ------------------ | ------------------ | -------------- | ---------------------- |
| Framework  | Next.js 15         | React 19           | Solid.js 1.9   | Vue 3                  |
| Build Tool | Turbopack          | Vite               | Vite           | Vite                   |
| State Mgmt | React Hooks + RxJS | React Hooks + RxJS | Signals + RxJS | Composition API + RxJS |
| Styling    | Tailwind CSS       | Tailwind CSS       | Tailwind CSS   | Tailwind CSS           |
| Type Check | TypeScript         | TypeScript         | TypeScript     | TypeScript             |
| Routing    | Next.js Router     | React Router       | Solid Router   | Vue Router             |

## Contributing

We welcome Issues and Pull Requests to improve this project collection.

## License

This project is licensed under the MIT License.
