# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Context

This is a Vue 3 component library project that provides enhanced components based on TDesign Vue Next. The project is designed to offer production-ready components with additional features and customizations on top of the TDesign ecosystem.

The library includes multiple pro components such as:

- ProTable: Enhanced table component with advanced features
- ProForm: Enhanced form component with validation and layout
- ProSelect: Enhanced select component with search and filtering
- And more pro components for enterprise applications

## Tech Stack

- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: JSX for templates, Less for styling
- **Base UI Library**: TDesign Vue Next
- **Documentation**: VitePress
- **Package Manager**: pnpm

## Development Guidelines

1. **Component Development**:
   - Use Vue 3 Composition API with JSX syntax
   - All components should be written in TSX format (.tsx files)
   - Follow component-based development with defineComponent
   - Ensure all components are TypeScript-first with proper type definitions
   - Each component must have an install method for Vue plugin registration

2. **Code Style**:
   - Use ESLint with Vue and TypeScript recommended rules
   - Follow Vue.js style guide conventions
   - Prefer composition over options API
   - Use JSX syntax instead of template syntax
   - Use proper prop validation and TypeScript interfaces

3. **Component Structure**:
   - Each component should be in its own directory under `src/components/`
   - Use kebab-case for directory names (e.g., `pro-table/`, `pro-form/`)
   - Main component file should be named `index.tsx`
   - Include proper documentation with examples
   - Provide comprehensive type definitions
   - Follow atomic design principles where applicable

4. **Testing & Quality**:
   - Write unit tests for all components
   - Ensure accessibility standards compliance
   - Follow semantic versioning for releases
   - Maintain backward compatibility when possible

5. **Documentation**:
   - Use VitePress for documentation generation
   - Provide live examples and code snippets
   - Include API documentation with proper TypeScript types
   - Follow TDesign documentation patterns

## File Naming Conventions

- Components: kebab-case directory with index.tsx (e.g., `pro-table/index.tsx`)
- Component directories: kebab-case (e.g., `pro-table/`, `pro-form/`, `pro-select/`)
- Utilities: camelCase (e.g., `formatData.ts`)
- Types: PascalCase with type suffix (e.g., `ProTableType.ts`)
- Constants: SCREAMING_SNAKE_CASE (e.g., `DEFAULT_PAGE_SIZE`)

## Component Example Structure

```tsx
// src/components/component-name/index.tsx
import { defineComponent } from 'vue'
import type { App } from 'vue'

const ComponentName = defineComponent({
  name: 'TComponentName', // TDesign prefix for global registration
  setup() {
    return () => <div>Component JSX content</div>
  },
})

// Add install method for Vue plugin registration
ComponentName.install = (app: App) => {
  app.component(ComponentName.name!, ComponentName)
}

export default ComponentName
```
