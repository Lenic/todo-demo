# React Todo Application

A modern React Todo application built with Vite, focusing on client-side rendering and rapid development experience.

## 🚀 Features

### Core Functionality

- **Complete Todo Management**: Create, edit, delete, complete/uncomplete tasks
- **Task Categorization and State Management**: Support deadline settings and real-time expired status switching
- **Local Storage**: Use IndexedDB for data persistence
- **Virtualized Lists**: High-performance rendering for long lists

### Technical Features

- **React 19**: Latest React features and Hooks
- **TypeScript**: Complete type safety support
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Modern styling system
- **Reactive State**: Hooks + RxJS-based reactive state management with push notifications

### User Experience

- **Responsive Design**: Support mobile and desktop
- **Theme Switching**: Light/dark/system following + multiple theme colors
- **Internationalization**: Multi-language support (Chinese/English/Japanese)

## 🛠 Technology Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks + RxJS
- **Routing**: React Router
- **Internationalization**: i18next
- **Code Standards**: ESLint + Prettier
- **Storage**: IndexedDB

## 📁 Project Structure

```
react-app/
├── src/                     # Source code
│   ├── components/          # Reusable components
│   │   └── ui/              # UI base components
│   ├── hooks/               # Custom Hooks
│   ├── i18n/                # Internationalization config
│   ├── lib/                 # Utility functions
│   ├── modules/             # Feature modules
│   │   ├── setting/         # Settings module
│   │   └── todo/            # Todo module
│   ├── App.tsx              # Main application component
│   ├── index.css            # Global styles
│   └── main.tsx             # Application entry
├── public/                  # Static assets
└── package.json             # Project configuration
```

## 🚀 Quick Start

### Requirements

- Node.js 22+
- pnpm 10+

### Install Dependencies

```bash
pnpm install
```

### Start Development Server

```bash
pnpm dev
```

Visit [http://localhost:5173](http://localhost:5173) to view the application.

### Build Production Version

```bash
pnpm build
```

### Preview Build Results

```bash
pnpm preview
```

## 📚 Main Modules

### Todo Module (`src/modules/todo/`)

- **create-new.tsx**: Create new task component
- **editor.tsx**: Task editor component
- **index.tsx**: Main Todo page
- **components/**: Todo-related sub-components
  - **auto-tooltip.tsx**: Auto-tooltip component
  - **date-picker.tsx**: Date picker component
  - **loading-sketch.tsx**: Loading skeleton component

### Settings Module (`src/modules/setting/`)

- **language-toggle.tsx**: Language switching component
- **theme-toggle.tsx**: Theme switching component
- **theme-color-toggle.tsx**: Theme color switching component

### Core Components (`src/components/`)

- **ui/**: UI component library based on shadcn/ui
- Responsive design supporting light/dark themes

## 🔧 Development Guide

### Code Standards

- Use ESLint for code checking
- Follow TypeScript best practices
- Use functional components and Hooks

### State Management

- Use DI + RxJS for global state management
- Local state using useState
- Support reactive data updates

### Component Development

- Use shadcn/ui component library
- Support light/dark themes
- Responsive design supporting mobile devices
- Component-based architecture, easy to maintain

### Styling System

- Use Tailwind CSS for styling development
- Support CSS variables and theme switching
- Responsive design supporting multiple screen sizes

## 🌐 Internationalization

The application supports multiple languages, currently supporting:

- Chinese (zh-CN)
- English (en-US)
- Japanese (ja-JP)

Language files are located in the `src/i18n/locales/` directory.

## 🎨 Theme System

### Theme Modes

- **Light Theme**: Bright and clear interface
- **Dark Theme**: Eye-friendly dark interface

### Theme Colors

Support multiple theme color choices, including:

- Blue
- Green
- Gray (default)
- Yellow

## 📱 Responsive Design

The application adopts a mobile-first responsive design:

- **Mobile**: 320px - 768px
- **Desktop**: 768px+

## 🚀 Performance Optimization

- **Code Splitting**: Route-level code splitting
- **Lazy Loading**: Component and route lazy loading
- **Virtualization**: Long list virtualization rendering
- **Caching Strategy**: Reasonable caching configuration

## 📦 Build and Deployment

### Development Environment

```bash
pnpm dev
```

### Production Build

```bash
pnpm build
```

### Preview Build Results

```bash
pnpm preview
```

### Deployment

Built files are located in the `dist/` directory and can be deployed to any static file server.

## 🔍 Development Tools

- **Vite**: Fast development server and build tool
- **ESLint**: Code quality checking
- **TypeScript**: Type checking and intelligent suggestions
- **Tailwind CSS**: Atomic CSS framework

## 🤝 Contributing

We welcome Issues and Pull Requests to improve this project.

## 📄 License

This project is licensed under the MIT License.
