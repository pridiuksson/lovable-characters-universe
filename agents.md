# Agent Instructions for `vite_react_shadcn_ts` Repository

This document provides guidance for AI agents working with this codebase.

## 1. Project Overview

This is a React application built with Vite, TypeScript, and Tailwind CSS. It utilizes Shadcn UI for many of its core UI components and includes custom components for displaying character information and interactions. State management for server data is handled by `@tanstack/react-query`.

## 2. Coding Conventions

*   **TypeScript:**
    *   Strive for strong typing. While some existing `tsconfig.json` settings are relaxed (e.g., `noImplicitAny: false`), new code should aim for explicit types wherever possible.
    *   Use interfaces or types for props and state.
    *   Prefer `ESM` imports/exports.
*   **React:**
    *   Use functional components with hooks.
    *   Component file names should be PascalCase (e.g., `MyComponent.tsx`).
    *   Hooks should be prefixed with `use` (e.g., `useCustomHook.tsx`).
*   **Tailwind CSS:**
    *   Utilize utility classes directly in the JSX.
    *   Use the `cn` utility function (from `src/lib/utils.ts`) for conditionally applying or merging Tailwind classes.
    *   Keep class strings readable. For very long lists of classes, consider breaking them onto multiple lines or abstracting parts into local variables if it improves clarity.
*   **File Structure:**
    *   Components are organized under `src/components/`. UI primitives (likely from Shadcn) are in `src/components/ui/`.
    *   Pages (top-level route components) are in `src/pages/`.
    *   Reusable utility functions are in `src/lib/`.
    *   Custom hooks are in `src/hooks/`.
    *   Type definitions are in `src/types/`.
*   **Imports:**
    *   Use absolute imports with the `@/` alias for paths relative to the `src` directory (e.g., `import MyComponent from '@/components/MyComponent';`).
*   **Linting:**
    *   The project uses ESLint. Ensure code adheres to the configured linting rules (`npm run lint` can be used to check).

## 3. Key Libraries and Tools

*   **Vite:** Build tool and dev server. Configuration is in `vite.config.ts`.
*   **React:** Core UI library.
*   **TypeScript:** For static typing. Configuration in `tsconfig.json` and `tsconfig.app.json`.
*   **Tailwind CSS:** Utility-first CSS framework. Configuration in `tailwind.config.ts`.
*   **Shadcn UI:** (Inferred) Provides a set of pre-built, customizable UI components. These are typically found in `src/components/ui/`.
*   **`@tanstack/react-query`:** For server state management (data fetching, caching, synchronization).
*   **`react-router-dom`:** For client-side routing. Routes are defined in `src/App.tsx`.
*   **`lucide-react`:** For icons.
*   **`clsx` & `tailwind-merge` (via `cn` utility):** For managing CSS class strings.

## 4. Development Workflow

*   **Running the dev server:** `npm run dev`
*   **Building for production:** `npm run build`
*   **Linting:** `npm run lint`

## 5. Working with Components

*   **Shadcn UI Components:** These are found in `src/components/ui/`. They are designed to be highly customizable. Refer to Shadcn UI documentation if modifications are needed.
*   **Custom Components:**
    *   `CharacterCard.tsx`: A complex component for displaying individual characters. It includes interactive elements and a chat interface. Pay attention to its state management and event handlers.
    *   `CharacterCarousel.tsx`: Displays multiple `CharacterCard`s.
*   When creating new components, follow the existing structure and conventions.

## 6. State Management

*   For server state (data fetched from APIs), use `@tanstack/react-query`.
*   For local component state, use React's built-in hooks (`useState`, `useReducer`).
*   For complex client-side state that needs to be shared across many components, consider if a more robust client-side state management solution (like Zustand or Jotai, if not already present for other reasons) might be needed, but prefer prop drilling or context for simpler cases.

## 7. Testing
    *   This project uses Vitest for running tests and React Testing Library for component testing.
    *   Test files are located alongside the code they test (e.g., `utils.test.ts` for `utils.ts`) or in a `__tests__` subdirectory.
    *   Run tests using `npm test`.
    *   Run tests with a UI using `npm run test:ui`.
    *   Ensure new features and bug fixes are accompanied by relevant tests.

## 8. API Interaction

*   (Assumption) API interactions are likely handled through functions that use `fetch` or a library like `axios`, integrated with `@tanstack/react-query`'s `useQuery` or `useMutation` hooks.
*   The `vite.config.ts` has a `define` block that mentions handling `/api/` routes by serving static JSON files, which might be relevant for development or mock data.

## 9. Agent-Specific Instructions

*   **Code Generation:** When generating new components or modifying existing ones, ensure the code is well-formatted and adheres to the established TypeScript and React patterns.
*   **Dependency Management:** If new dependencies are needed, add them using `npm install <package-name>` (for runtime dependencies) or `npm install --save-dev <package-name>` (for development dependencies). Update `package.json` accordingly.
*   **Clarity:** Prioritize clear and maintainable code. Add comments where necessary to explain complex logic.
*   **Error Handling:** Implement robust error handling, especially for API calls and asynchronous operations.
*   **Performance:** Be mindful of performance implications, especially in list rendering or complex UI interactions. Utilize React's optimization features (e.g., `useMemo`, `useCallback`) where appropriate, as seen in `CharacterCard.tsx`.

By following these guidelines, AI agents can contribute effectively to this project.
