# Project Setup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Set up a Node.js Express API project with TypeScript, tsx, Jest, and Biome.

**Architecture:** A simple Express app with a modular folder structure (`src/ routes/`) and a separate `tests/` directory for Jest tests.

**Tech Stack:** Express, TypeScript, tsx, Jest, Biome, pnpm.

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install runtime dependencies**
Run: `pnpm add express`
Expected: PASS

**Step 2: Install dev dependencies**
Run: `pnpm add -D typescript tsx @types/node @types/express jest ts-jest @types/jest @biomejs/biome`
Expected: PASS

**Step 3: Commit**
```bash
git add package.json pnpm-lock.yaml
git commit -m "build: install dependencies"
```

### Task 2: Configure TypeScript

**Files:**
- Create: `tsconfig.json`

**Step 1: Write configuration**
Create `tsconfig.json` with the following content:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*", "tests/**/*"]
}
```

**Step 2: Commit**
```bash
git add tsconfig.json
git commit -m "build: configure typescript"
```

### Task 3: Configure VS Code Settings

**Files:**
- Create: `.vscode/settings.json`

**Step 1: Write VS Code settings**
Create `.vscode/settings.json` with following content to enable Biome format on save:
```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  }
}
```

**Step 2: Commit**
```bash
git add .vscode/settings.json
git commit -m "build: configure editor settings for biome"
```

### Task 4: Configure Biome

**Files:**
- Create: `biome.json`

**Step 1: Initialize Biome**
Run: `pnpm dlx @biomejs/biome init`
Expected: Creates `biome.json` successfully.

**Step 2: Commit**
```bash
git add biome.json
git commit -m "build: configure biome"
```

### Task 5: Setup Scripts in package.json

**Files:**
- Modify: `package.json`

**Step 1: Add scripts**
Update the `"scripts"` section in `package.json` to include:
```json
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "lint": "biome check src tests"
  }
```

**Step 2: Commit**
```bash
git add package.json
git commit -m "build: add pnpm scripts"
```

### Task 6: Set up Jest Configuration

**Files:**
- Create: `jest.config.js`

**Step 1: Initialize Jest for TypeScript**
Run: `pnpm dlx ts-jest config:init`
Expected: Creates `jest.config.js`

**Step 2: Commit**
```bash
git add jest.config.js
git commit -m "build: configure jest"
```

### Task 7: Create App Structure and Test

**Files:**
- Create: `src/index.ts`
- Create: `src/routes/base.ts`
- Create: `tests/base.test.ts`

**Step 1: Write the failing test**
Create `tests/base.test.ts`:
```typescript
import { app } from '../src/index';

describe('Base route', () => {
  it('should be true', () => {
    expect(true).toBe(true);
  });
});
```

**Step 2: Run test to verify it fails (missing index.ts)**
Run: `pnpm test`
Expected: FAIL since src/index.ts doesn't exist

**Step 3: Write minimal implementation**
Create `src/routes/base.ts`:
```typescript
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('Hello World!');
});

export default router;
```

Create `src/index.ts`:
```typescript
import express from 'express';
import baseRouter from './routes/base';

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/', baseRouter);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
```

**Step 4: Run test to verify it passes**
Run: `pnpm test`
Expected: PASS

**Step 5: Commit**
```bash
git add src tests
git commit -m "feat: initial express app and test setup"
```
