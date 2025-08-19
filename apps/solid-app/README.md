# Solid.js Todo Application

A modern Todo application built with the Solid.js framework, showcasing reactive programming models and virtualized list performance advantages.

## 🚀 Features

### Core Functionality

- **Complete Todo Management**: Create, edit, delete, complete/uncomplete tasks
- **Task Categorization and State Management**: Support deadline settings and real-time expired status switching
- **Local Storage**: Use IndexedDB for data persistence
- **Virtualized Lists**: High-performance rendering for long lists

### Technical Features

- **Solid.js**: True reactive framework with no virtual DOM
- **TypeScript**: Complete type safety support
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Modern styling system
- **Signals**: RxJS and Signal-based fine-grained reactive state management

### Performance Advantages

- **No Virtual DOM**: Direct manipulation of real DOM for better performance
- **Fine-grained Updates**: Only changed parts are re-rendered
- **Compile-time Optimization**: Generates optimal update code at compile time
- **Memory Friendly**: Lower memory usage and garbage collection

## 🛠 Technology Stack

- **Framework**: Solid.js 1.9
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Solid.js Signals + RxJS
- **Routing**: Solid Router
- **Internationalization**: i18next
- **Code Standards**: ESLint + Prettier
- **Storage**: IndexedDB
- **Virtualized Lists**: Custom virtualized components

## 📁 Project Structure

```
solid-app/
├── src/                       # Source code
│   ├── components/            # Reusable components
│   │   ├── content-loader.tsx # Content loader
│   │   ├── ui/                # UI base components
│   │   └── virtualized/       # Virtualized list components
│   ├── hooks/                 # Custom Hooks
│   ├── i18n/                  # Internationalization config
│   ├── libs/                  # Utility libraries
│   ├── modules/               # Feature modules
│   │   ├── setting/           # Settings module
│   │   └── todo/              # Todo module
│   ├── App.tsx                # Main application component
│   ├── index.css              # Global styles
│   └── index.tsx              # Application entry
├── public/                    # Static assets
└── package.json               # Project configuration
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

### Virtualized Components (`src/components/virtualized/`)

- **index.ts**: Virtualized component entry
- **range.tsx**: Range selector
- **README.md**: Virtualized component documentation

### Core Components (`src/components/`)

- **content-loader.tsx**: Content loader
- **ui/**: UI component library based on shadcn/ui

## 🔧 Development Guide

### Solid.js Features

- **Components**: Use functional components, executed only once
- **Signals**: Reactive state management
- **Effects**: Side effect management
- **Memo**: Computed value caching

### Code Standards

- Use ESLint for code checking
- Follow TypeScript best practices
- Use functional components
- Fully leverage Solid.js reactive features

### State Management

- Use Solid.js Signals for state management
- Support fine-grained reactive updates
- Automatic dependency tracking and updates

### Component Development

- Use shadcn/ui component library
- Support light/dark themes
- Responsive design supporting mobile devices
- Component-based architecture, easy to maintain

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

### Solid.js Advantages

- **No Virtual DOM**: Direct manipulation of real DOM
- **Compile-time Optimization**: Generates optimal update code
- **Fine-grained Updates**: Only changed parts are re-rendered
- **Memory Friendly**: Lower memory usage

### Application-level Optimization

- **Virtualized Lists**: Performance optimization for long lists
- **Lazy Loading**: Component and route lazy loading
- **Code Splitting**: Route-level code splitting
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
- **Solid.js DevTools**: Development debugging tools

## 🆚 Comparison with Other Frameworks

### Solid.js vs React

- **Performance**: Solid.js has no virtual DOM, better performance
- **Update Granularity**: Solid.js fine-grained updates, React component-level updates
- **Memory**: Solid.js lower memory usage
- **Learning Curve**: React has richer ecosystem, Solid.js simpler concepts

### Solid.js vs Vue

- **Reactivity**: Solid.js compile-time reactivity, Vue runtime reactivity
- **Performance**: Solid.js better performance
- **Ecosystem**: Vue more mature ecosystem

## 🤝 Contributing

We welcome Issues and Pull Requests to improve this project.

## 📄 License

This project is licensed under the MIT License.
