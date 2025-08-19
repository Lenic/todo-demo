# Vue 3 Todo Application

A modern Todo application built with Vue 3 Composition API, demonstrating modern development approaches within the Vue ecosystem.

## 🚀 Features

### Core Functionality

- **Complete Todo Management**: Create, edit, delete, complete/uncomplete tasks
- **Task Categorization and State Management**: Support deadline settings and real-time expired status switching
- **Local Storage**: Use IndexedDB for data persistence
- **Virtualized Lists**: High-performance rendering for long lists

### Technical Features

- **Vue 3**: Latest Vue framework supporting Composition API
- **TypeScript**: Complete type safety support
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Modern styling system
- **Composition API**: Better logic reuse and type inference

### User Experience

- **Responsive Design**: Support mobile and desktop
- **Theme Switching**: Light/dark theme support
- **Internationalization**: Multi-language support (Chinese/English/Japanese)
- **Smooth Animations**: Smooth transitions based on Vue Transition

## 🛠 Technology Stack

- **Framework**: Vue 3
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Vue 3 Composition API + RxJS
- **Routing**: Vue Router 4
- **Internationalization**: Vue I18n
- **Code Standards**: ESLint + Prettier
- **Storage**: IndexedDB
- **UI Components**: shadcn/ui (Vue version)

## 📁 Project Structure

```
vue-app/
├── src/                     # Source code
│   ├── assets/              # Static assets
│   │   └── index.css        # Global styles
│   ├── components/          # Reusable components
│   │   └── ui/              # UI base components
│   ├── hooks/               # Custom composable functions
│   ├── i18n/                # Internationalization config
│   ├── lib/                 # Utility functions
│   ├── modules/             # Feature modules
│   │   ├── setting/         # Settings module
│   │   └── todo/            # Todo module
│   ├── App.tsx              # Main application component
│   └── main.ts              # Application entry
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

### UI Component Library (`src/components/ui/`)

- **alert-dialog/**: Alert dialog components
- **button/**: Button components
- **calendar/**: Calendar components
- **checkbox/**: Checkbox components
- **dialog/**: Dialog components
- **dropdown-menu/**: Dropdown menu components
- **form/**: Form components
- **input/**: Input components
- **label/**: Label components
- **popover/**: Popover components
- **tabs/**: Tab components
- **textarea/**: Textarea components
- **toast/**: Toast components
- **tooltip/**: Tooltip components

## 🔧 Development Guide

### Vue 3 Features

- **Composition API**: Better logic reuse and type inference
- **Reactive System**: Proxy-based reactive data
- **Composable Functions**: Reusable logic encapsulation
- **Teleport**: Render components to specified locations
- **Suspense**: Async component loading

### Code Standards

- Use ESLint for code checking
- Follow TypeScript best practices
- Use Composition API and composable functions
- Follow Vue 3 official style guide

### State Management

- Use Vue 3 reactive system, combined with RxJS to avoid proxy complexity for complex objects
- Composable functions for state encapsulation
- Support reactive data updates
- Automatic dependency tracking

### Component Development

- Use shadcn/ui component library
- Support light/dark themes
- Responsive design supporting mobile devices
- Component-based architecture, easy to maintain
- Smooth animations based on Vue Transition

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

### Vue 3 Advantages

- **Reactive System**: Proxy-based, better performance
- **Compile-time Optimization**: Template compilation optimization
- **Tree-shaking**: Better code splitting
- **Composition API**: Better logic reuse

### Application-level Optimization

- **Lazy Loading**: Component and route lazy loading
- **Code Splitting**: Route-level code splitting
- **Caching Strategy**: Reasonable caching configuration
- **Virtual Scrolling**: Performance optimization for long lists

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
- **Vue DevTools**: Vue development debugging tools

## 🆚 Comparison with Other Frameworks

### Vue 3 vs React

- **Learning Curve**: Vue 3 easier to learn
- **Template Syntax**: Vue 3 templates more intuitive
- **Reactivity**: Vue 3 reactive system simpler
- **Ecosystem**: React has richer ecosystem

### Vue 3 vs Solid.js

- **Performance**: Solid.js better performance
- **Reactivity**: Solid.js compile-time reactivity
- **Learning Curve**: Vue 3 easier to get started
- **Ecosystem**: Vue more mature ecosystem

## 🎭 Animations and Transitions

The application uses Vue 3's Transition system:

- **Page Transitions**: Smooth page transitions
- **Component Animations**: Component enter/leave animations
- **State Changes**: Data change transition effects
- **CSS Animations**: CSS-based animation effects

## 🤝 Contributing

We welcome Issues and Pull Requests to improve this project.

## 📄 License

This project is licensed under the MIT License.
