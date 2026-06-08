<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# Agent Guidelines for ReactArchitecture2026

## Workspace Overview

- **Type**: Nx React monorepo
- **Apps**: `app-a`, `app-b` (Vite, React 19, React Router, Tailwind)
- **Shared Libs**: `@react-architecture-2026/shared-ui`, `@react-architecture-2026/shared-util`
- **Package Manager**: pnpm (with workspace protocol `workspace:*`)
- **Nx Version**: 22.7.5

## Project Organization

### Dependency Flow

```
apps/app-a  ┐
apps/app-b  ├→ shared-ui, shared-util (no cross-app dependencies)
            └
shared-ui, shared-util → (leaf dependencies only)
```

**Key Rules**:

- Shared libraries use **workspace protocol** (`workspace:*`) for interdependencies
- Apps can depend on shared; shared cannot depend on apps
- Direct TypeScript imports work—no build step needed
- ESLint enforces architectural boundaries via `@nx/eslint-plugin`

### Library Exports

- Entry point: `src/index.ts` (barrel export)
- Types: `package.json#types` points to `src/index.ts`
- Main: `package.json#main` points to `src/index.ts`

## Nx Command Patterns

### Running Tasks

Always use `pnpm nx` (avoid global Nx CLI):

```bash
pnpm nx serve app-a                    # Dev server (port 4200)
pnpm nx build app-a                    # Production build
pnpm nx test <project>                 # Unit tests (watch mode)
pnpm nx test-ci <project>              # CI tests (no watch)
pnpm nx lint <project>                 # ESLint check
pnpm nx typecheck <project>            # TypeScript check
pnpm nx graph                          # View dependency graph
pnpm nx show projects                  # List all projects
```

### Key Considerations

- For navigating/exploring the workspace, use the `nx-workspace` skill first
- Always prefer `nx` commands over underlying tools (e.g., `pnpm nx build` not `vite build`)
- Check `nx --help` or `nx_docs` for unfamiliar flags—never guess
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md` (if available)

## Scaffolding & Code Generation

**Always invoke the `nx-generate` skill FIRST** for scaffolding tasks:

- Creating new apps or libraries
- Adding components or utilities
- Setting up new project structure
- The skill handles generator discovery internally

Common generators:

```bash
pnpm nx g @nx/react:app my-app --directory=apps
pnpm nx g @nx/react:lib my-lib --directory=packages/shared
pnpm nx g @nx/react:component Button --project=shared-ui --style=tailwind
```

## Styling & UI Components

### Tailwind Configuration

- Default generator: `@nx/react:component` → `style: "tailwind"`
- Config: `tailwind.config.js` in each app auto-includes shared library patterns
- PostCSS 8.4.38 + Autoprefixer 10.4.13
- Shared UI components automatically scanned by app Tailwind configs

### Creating Shared Components

- Place in `packages/shared/ui/src/lib/`
- Export from `packages/shared/ui/src/index.ts`
- Import in apps as: `import { Button } from '@react-architecture-2026/shared-ui'`

## Module Boundary Rules (ESLint)

Nx enforces architectural constraints via `eslint.config.mjs`:

| Source             | Can Depend On                              |
| ------------------ | ------------------------------------------ |
| `scope:app-a`      | `scope:app-a`, `scope:shared`              |
| `scope:app-b`      | `scope:app-b`, `scope:shared`              |
| `scope:shared`     | `scope:shared` only                        |
| `type:feature`     | `type:ui`, `type:util`, `type:data-access` |
| `type:data-access` | `type:util`, `type:data-access`            |

**Violations appear as ESLint errors**—respect these boundaries to maintain modularity.

## Build & Test Configuration

### Vite Setup

- Dev server: `localhost:4200`
- Preview: `localhost:4300`
- Output: `dist/` (emptied on build)
- Test environment: jsdom
- Coverage provider: v8 → `test-output/vitest/coverage`

### TypeScript Strict Mode

- `strict: true` enabled globally
- Custom condition: `@react-architecture-2026/source` for workspace imports
- Module target: ES2022 + esnext
- No unused locals, no emit on error

### Testing Patterns

- Pattern: `{src,tests}/**/*.{test,spec}.{js,ts,jsx,tsx}`
- Framework: Vitest 4.1 (via `vitest.workspace.ts`)
- Libraries: @testing-library/react, @testing-library/dom
- CI mode: `test-ci` runs without watch flag

## Development Workflow Tips

1. **Starting an app**: `pnpm nx serve app-a` then open `localhost:4200`
2. **Adding dependencies to apps**: Use `pnpm add` (pnpm resolves workspace packages automatically)
3. **Creating shared utilities**: Place in `packages/shared/util/src/`, export from `index.ts`
4. **Checking project dependencies**: `pnpm nx show project app-a --web` or `pnpm nx graph`
5. **Debugging build issues**: Check `tsconfig.json` hierarchy and `project.json` inferred targets

## When to use nx_docs

- USE for: advanced config, migration guides, Nx plugin deep dives, performance tuning
- DON'T USE for: basic generator syntax, standard build/test commands, things already documented here

<!-- nx configuration end-->
