# Project Setup Design

## Overview
Initial foundation for the Node.js Express API project, configured for modern TypeScript development with rapid iteration, standard testing, and high-performance linting/formatting.

## 1. Dependencies & Tooling
*   **Runtime Dependency**: `express`
*   **Dev Dependencies**: `typescript`, `tsx` (for fast execution and hot-reloading), `@types/node`, `@types/express`.
*   **Testing**: `jest`, `ts-jest`, `@types/jest` for comprehensive unit tests.
*   **Code Quality**: `@biomejs/biome` for incredibly fast linting and formatting.

## 2. Configuration & Scripts
*   **TypeScript (`tsconfig.json`)**: Configured for modern Node.js using NodeNext/ESNext.
*   **Biome (`biome.json`)**: Configured with standard formatting and recommended linting rules. 
*   **Editor (`.vscode/settings.json`)**: Configured to use Biome as the default formatter and run "format on save" and "fix on save".
*   **Package scripts**:
    *   `dev`: `tsx watch src/index.ts`
    *   `build`: `tsc`
    *   `start`: `node dist/index.js`
    *   `test`: `jest`
    *   `lint`: `biome check --write src`

## 3. Initial Folder Structure
```text
/
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── biome.json
├── .vscode/
│   └── settings.json
├── src/
│   ├── index.ts (Express server setup)
│   └── routes/
│       └── base.ts (A sample route to test the structure)
└── tests/
    └── base.test.ts (A sample jest test to ensure tests work)
```
