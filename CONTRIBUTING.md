# Contributing Guide

We welcome contributions to TDesign Pro Components! This guide will help you get started.

## Development Setup

### Prerequisites

- Node.js >= 16
- pnpm >= 8

### Setup

1. Fork and clone the repository

```bash
git clone https://github.com/your-username/tdesign-pro-components.git
cd tdesign-next-pro-components
```

2. Install dependencies

```bash
pnpm install
```

3. Start development

```bash
# Start playground for component development
pnpm dev

# Start documentation server
pnpm dev:docs
```

## Project Structure

```
tdesign-pro-components/
├── src/                    # Source code
│   ├── components/         # Component source files
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── index.ts           # Main entry point
├── playground/            # Development playground
├── docs/                  # Documentation source
├── .changeset/           # Changeset configuration
└── .vscode/              # VS Code configuration
```

## Component Development

### Creating a New Component

1. Create a new directory under `src/components/`
2. Follow the naming convention: `ComponentName/`
3. Include these files:
   - `index.ts` - Component export
   - `ComponentName.vue` - Main component file
   - `ComponentName.types.ts` - TypeScript definitions
   - `ComponentName.less` - Component styles (if needed)

### Component Guidelines

- Use Vue 3 Composition API with `<script setup>`
- Support both template syntax and JSX
- Follow TDesign naming conventions
- Ensure full TypeScript support
- Include comprehensive prop validation
- Follow accessibility best practices

### Example Component Structure

```typescript
// src/components/ExampleComponent/index.ts
import ExampleComponent from "./ExampleComponent.vue";

export { ExampleComponent };
export default ExampleComponent;
export * from "./ExampleComponent.types";
```

## Code Style

### ESLint

We use ESLint with Vue and TypeScript rules. Run linting:

```bash
pnpm lint
```

### TypeScript

All code must be written in TypeScript with strict type checking enabled.

```bash
pnpm type-check
```

### Commit Convention

We follow [Conventional Commits](https://conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions or changes
- `chore:` - Build process or auxiliary tool changes

## Documentation

### Component Documentation

Each component should have:

1. Usage examples in the playground
2. Documentation page in `docs/components/`
3. API documentation with props, events, and slots
4. Live examples with code snippets

### Writing Documentation

Use VitePress for documentation. Create a new markdown file in `docs/components/` for each component.

## Testing

### Running Tests

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint
```

### Writing Tests

- Write unit tests for all components
- Include edge cases and error scenarios
- Test accessibility features
- Ensure TypeScript types are correct

## Release Process

We use [Changesets](https://github.com/changesets/changesets) for version management:

1. Create a changeset for your changes:

```bash
pnpm changeset
```

2. Commit the changeset with your changes
3. The changeset will be included in the next release

## Pull Request Guidelines

1. Fork the repository and create a feature branch
2. Make your changes following the guidelines above
3. Ensure all tests pass and code follows style guidelines
4. Create a changeset describing your changes
5. Submit a pull request with a clear description

### PR Checklist

- [ ] Code follows project conventions
- [ ] TypeScript types are properly defined
- [ ] ESLint passes without errors
- [ ] Documentation is updated (if applicable)
- [ ] Changeset is created (for user-facing changes)
- [ ] All existing tests pass
- [ ] New tests added (if applicable)

## Getting Help

- Check existing [GitHub Issues](https://github.com/wehuss/tdesign-pro-components/issues)
- Join [GitHub Discussions](https://github.com/wehuss/tdesign-pro-components/discussions)
- Read the [TDesign Vue Next documentation](https://tdesign.tencent.com/vue-next/overview)

## Code of Conduct

This project follows the [Code of Conduct](./CODE_OF_CONDUCT.md). Please be respectful and inclusive in all interactions.

## License

By contributing to TDesign Pro Components, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
