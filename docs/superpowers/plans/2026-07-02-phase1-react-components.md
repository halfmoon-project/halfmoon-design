# Phase 1 — React 컴포넌트 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** pnpm 모노레포로 전환하고 `@halfmoon/tokens`에 Tailwind v4 `@theme` 출력을 추가한 뒤, shadcn 컴포넌트 13개를 halfmoon 토큰 브리지로 테마링한 `@halfmoon/react` 패키지(+Storybook 워크벤치)를 만든다.

**Architecture:** 토큰(DTCG→Style Dictionary)이 단일 소스. react 패키지는 shadcn 변수 계약(`--background` 등)을 `--hm-*` semantic 토큰의 별칭으로 정의하는 브리지 CSS 하나로 테마링하고, 컴포넌트 코드는 CLI copy-in 그대로 무수정 유지. 배포는 git 태그 + pnpm 서브디렉토리 설치, dist/ 커밋.

**Tech Stack:** pnpm workspace, Style Dictionary 5.5.0, Tailwind CSS v4, shadcn CLI (new-york-v4), radix-ui(통합 패키지), tsdown(unbundle), Storybook 10 (react-vite), React 19.

**스펙:** `docs/superpowers/specs/2026-07-02-phase1-react-components-design.md` (승인됨)

## Global Constraints

- **npm/npx 절대 사용 금지** — 모든 명령은 `pnpm` / `pnpm dlx`. lockfile은 `pnpm-lock.yaml`만.
- Node ≥ 22.12 (Storybook 10 하한; 로컬 22.17 확인됨). pnpm ≥ 9 (로컬 10.33.2 확인됨).
- `style-dictionary` 5.5.0 고정 유지. DTCG 소스 무변경, `brokenReferences` 기본값(throw) 유지.
- **dist/는 커밋 대상** (두 패키지 모두) — pnpm 10+가 git 의존성의 lifecycle 스크립트를 차단하므로 설치 시 빌드가 절대 돌지 않는다는 전제.
- 스코프 `@halfmoon/*`은 임시 (이름 확정 시 일괄 치환).
- react 패키지 runtime `dependencies`에 `workspace:*` 금지 (git 서브디렉토리 설치가 깨짐). `@halfmoon/tokens`는 devDependency로만.
- shadcn 컴포넌트 코드(`src/components/ui/*.tsx`)는 **무수정** — 테마는 브리지 CSS가 담당.
- 실제 GitHub 레포: `halfmoon-mind/halfmoon-design`.
- 커밋 메시지는 기존 컨벤션 (`feat:`, `chore:`, `docs:`, `ci:`, 한국어 본문 허용).

---

### Task 1: pnpm 모노레포 전환 + @halfmoon rename + CI

**Files:**
- Move: `src/ build/ dist/ test/ package.json` → `packages/tokens/`
- Create: `pnpm-workspace.yaml`, 새 루트 `package.json`
- Modify: `packages/tokens/package.json` (rename), `.github/workflows/tokens.yml`
- Delete: `package-lock.json`

**Interfaces:**
- Produces: 워크스페이스 패키지 `@halfmoon/tokens` (경로 `packages/tokens`), 루트 `pnpm run check` = `pnpm -r run build && pnpm -r run test`. 이후 모든 태스크는 이 구조를 전제.

- [ ] **Step 1: 파일 이동**

```bash
cd /Users/sanghyeon/projects/halfmoon_design
mkdir -p packages/tokens
git mv src build dist test package.json packages/tokens/
git rm package-lock.json
```

- [ ] **Step 2: 워크스페이스 정의 + 루트 package.json 작성**

`pnpm-workspace.yaml`:

```yaml
packages:
  - packages/*
```

루트 `package.json` (packageManager는 `pnpm --version` 출력에 맞춤):

```json
{
  "name": "halfmoon",
  "private": true,
  "packageManager": "pnpm@10.33.2",
  "scripts": {
    "build": "pnpm -r run build",
    "test": "pnpm -r run test",
    "check": "pnpm -r run build && pnpm -r run test"
  }
}
```

- [ ] **Step 3: tokens 패키지 rename**

`packages/tokens/package.json`에서 `"name": "@playtag/halfmoon-tokens"` → `"name": "@halfmoon/tokens"`. 나머지 필드(버전 0.1.0, exports, scripts, engines, style-dictionary 5.5.0)는 그대로.

- [ ] **Step 4: 설치 및 전체 체크**

```bash
pnpm install
pnpm run check
```

Expected: tokens 빌드 성공(`build done: dist/halfmoon/`) + 테스트 3파일 전부 PASS. `pnpm-lock.yaml` 생성 확인.

- [ ] **Step 5: CI를 pnpm으로 전환**

`.github/workflows/tokens.yml` 전체 교체:

```yaml
name: check
on:
  push:
    branches: [main]
  pull_request:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4   # 버전은 루트 packageManager 필드에서 읽음
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm -r run build
      # dist/는 커밋 대상 — 소스와 어긋나면 실패 (스펙 §7, 미추적 파일 포함)
      - run: test -z "$(git status --porcelain packages/*/dist)"
      - run: pnpm -r run test
```

- [ ] **Step 6: 커밋**

```bash
git add -A
git commit -m "chore: pnpm 모노레포 전환 (packages/tokens) + @halfmoon/tokens rename + CI pnpm화"
```

---

### Task 2: tokens — Tailwind v4 `@theme` 출력 (`tailwind.css`)

**Files:**
- Create: `packages/tokens/test/tailwind-output.test.mjs`
- Modify: `packages/tokens/build/formats.mjs`, `packages/tokens/build/build.mjs`, `packages/tokens/package.json` (exports)

**Interfaces:**
- Consumes: Task 1의 워크스페이스 구조.
- Produces: `dist/halfmoon/tailwind.css` — `@theme inline { --color-<semantic>: var(--hm-…); --spacing-<k>; --radius-<k>; --font-<k>; --font-weight-<k>; --leading-<k>; --text-<k> }`. exports 서브패스 `@halfmoon/tokens/halfmoon/tailwind.css`. Task 3~7이 이 파일을 import.

- [ ] **Step 1: 실패하는 테스트 작성**

`packages/tokens/test/tailwind-output.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = () => readFileSync('dist/halfmoon/tailwind.css', 'utf8');

test('tailwind.css: @theme inline 블록으로 Tailwind 네임스페이스에 매핑', () => {
  assert.match(css(), /@theme inline\s*\{/);
  // 값은 --hm-* var 참조 (모드 자동 추종)
  assert.match(css(), /--color-bg-default:\s*var\(--hm-color-bg-default\);/);
  assert.match(css(), /--color-action-primary-bg:\s*var\(--hm-color-action-primary-bg\);/);
  assert.match(css(), /--spacing-4:\s*var\(--hm-space-4\);/);
  assert.match(css(), /--radius-md:\s*var\(--hm-radius-md\);/);
  assert.match(css(), /--font-sans:\s*var\(--hm-font-family-sans\);/);
  assert.match(css(), /--font-weight-bold:\s*var\(--hm-font-weight-bold\);/);
  assert.match(css(), /--leading-normal:\s*var\(--hm-font-line-height-normal\);/);
  assert.match(css(), /--text-md:\s*var\(--hm-size-font-md\);/);
});

test('tailwind.css: primitive 색상은 유틸리티로 노출하지 않는다', () => {
  assert.doesNotMatch(css(), /--color-blue-600/);
  assert.doesNotMatch(css(), /--color-gray-50\b/);
  assert.doesNotMatch(css(), /\[object Object\]/);
});
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
cd packages/tokens && pnpm test
```

Expected: FAIL — `ENOENT ... dist/halfmoon/tailwind.css` (기존 테스트는 PASS 유지).

- [ ] **Step 3: 포맷 구현**

`packages/tokens/build/formats.mjs`의 `registerFormats()` 안에 추가 (기존 두 포맷 뒤):

```js
// Tailwind v4 @theme 매핑. 값이 var(--hm-*) 참조라 @theme inline 필수 (스펙 §3).
// 색상은 semantic만 — primitive 노출은 "직접 참조 금지" 원칙의 유틸리티 우회가 된다.
StyleDictionary.registerFormat({
  name: 'css/tailwind-theme',
  format: ({ dictionary }) => {
    const lines = [];
    for (const t of dictionary.allTokens) {
      const type = t.$type ?? t.type;
      const path = t.path;
      let name = null;
      if (type === 'color' && t.filePath.includes('/semantic/')) {
        name = `--color-${path.slice(1).join('-')}`;          // color.bg.default -> --color-bg-default
      } else if (path[0] === 'space') {
        name = `--spacing-${path.slice(1).join('-')}`;
      } else if (path[0] === 'radius') {
        name = `--radius-${path.slice(1).join('-')}`;
      } else if (path[0] === 'font' && path[1] === 'family') {
        name = `--font-${path.slice(2).join('-')}`;
      } else if (path[0] === 'font' && path[1] === 'weight') {
        name = `--font-weight-${path.slice(2).join('-')}`;
      } else if (path[0] === 'font' && path[1] === 'lineHeight') {
        name = `--leading-${path.slice(2).join('-')}`;
      } else if (path[0] === 'size' && path[1] === 'font') {
        name = `--text-${path.slice(2).join('-')}`;
      }
      if (name) lines.push(`  ${name}: var(--${t.name});`);   // t.name = css transform 결과 (hm-…)
    }
    return `@theme inline {\n${lines.join('\n')}\n}\n`;
  },
});
```

- [ ] **Step 4: 빌드에 파일 추가**

`packages/tokens/build/build.mjs`의 `light` 인스턴스 `css.files` 배열에 추가 (light 소스 = 전체 토큰이라 여기서 1회 생성; 값이 var 참조라 모드 무관):

```js
{
  destination: 'tailwind.css',
  format: 'css/tailwind-theme',
},
```

- [ ] **Step 5: 빌드 + 테스트 통과 확인**

```bash
cd packages/tokens && pnpm run build && pnpm test
```

Expected: 전부 PASS. `dist/halfmoon/tailwind.css` 내용 눈으로 확인 — `@theme inline` 1블록, semantic 색상 18개 + spacing 11 + radius 5 + font 2 + weight 4 + leading 3 + text 8.

- [ ] **Step 6: exports 서브패스 추가**

`packages/tokens/package.json`의 `exports`에 추가:

```json
"./halfmoon/tailwind.css": "./dist/halfmoon/tailwind.css",
```

- [ ] **Step 7: 커밋 (dist 포함)**

```bash
git add packages/tokens
git commit -m "feat(tokens): Tailwind v4 @theme inline 출력 (dist/halfmoon/tailwind.css)"
```

---

### Task 3: `@halfmoon/react` 패키지 스캐폴드 (브리지 CSS + tsdown 빌드)

**Files:**
- Create: `packages/react/package.json`, `packages/react/tsconfig.json`, `packages/react/tsdown.config.ts`, `packages/react/vite.config.ts`, `packages/react/src/lib/utils.ts`, `packages/react/src/styles/theme.css`, `packages/react/src/styles/globals.css`, `packages/react/src/index.ts`

**Interfaces:**
- Consumes: `@halfmoon/tokens`의 `--hm-*` CSS 변수, `halfmoon/tailwind.css`.
- Produces: 빌드되는 빈 패키지 `@halfmoon/react` — `cn()` (`src/lib/utils.ts`, `ClassValue[] → string`), 브리지 `dist/theme.css`, exports `.`(index)와 `./theme.css`. Task 4가 컴포넌트를 채우고 Task 5가 Storybook을 붙인다.

- [ ] **Step 1: package.json 작성**

`packages/react/package.json` (의존성 버전은 Step 5에서 pnpm이 채움):

```json
{
  "name": "@halfmoon/react",
  "version": "0.0.0",
  "description": "halfmoon design system — React components (shadcn themed by halfmoon tokens)",
  "type": "module",
  "license": "PolyForm-Noncommercial-1.0.0",
  "files": ["dist"],
  "sideEffects": ["**/*.css"],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./theme.css": "./dist/theme.css"
  },
  "scripts": {
    "build": "tsdown",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "engines": { "node": ">=20" },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

주의: `test` 스크립트는 두지 않는다(테스트 없음 — `pnpm -r run test`는 스크립트 없는 패키지를 건너뜀). Storybook 스크립트는 Task 5의 init이 덮어써도 무방.

- [ ] **Step 2: tsconfig.json 작성**

`packages/react/tsconfig.json` (shadcn CLI가 aliases를 이 paths로 해석; tsdown이 같은 paths로 출력의 import를 상대경로로 재작성):

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}
```

- [ ] **Step 3: tsdown + vite 설정 작성**

`packages/react/tsdown.config.ts`:

```ts
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  unbundle: true, // 파일별 출력 — "use client" 보존, tree-shaking은 소비자 번들러 몫 (스펙 §4.3)
  dts: true,
  copy: ['src/styles/theme.css'], // -> dist/theme.css (변환 없이 그대로)
  publint: true,
  attw: { profile: 'esm-only' },
});
```

`packages/react/vite.config.ts` (Storybook이 자동 병합하는 유일한 Tailwind/alias 설정 지점):

```ts
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
});
```

- [ ] **Step 4: cn() + 브리지 CSS + dev 엔트리 + index 작성**

`packages/react/src/lib/utils.ts` (shadcn 표준 그대로 — cn은 npm 패키지가 아니라 각 프로젝트에 생성되는 코드):

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

`packages/react/src/styles/theme.css` (스펙 §4.1 브리지 전문 — shadcn 변수 계약을 hm semantic 토큰 별칭으로. 다크 블록 없음: hm 토큰이 `[data-theme="dark"]`에서 스스로 바뀌므로 별칭이 자동 추종. radius는 정의하지 않음 — tokens의 tailwind.css가 단독 소유):

```css
/* halfmoon → shadcn 변수 브리지. 컴포넌트 코드는 무수정, 테마는 이 파일이 전담. */
@custom-variant dark (&:is([data-theme=dark] *));

:root {
  --background: var(--hm-color-bg-default);
  --foreground: var(--hm-color-fg-default);
  --card: var(--hm-color-bg-default);
  --card-foreground: var(--hm-color-fg-default);
  --popover: var(--hm-color-bg-default);
  --popover-foreground: var(--hm-color-fg-default);
  --primary: var(--hm-color-action-primary-bg);
  --primary-foreground: var(--hm-color-action-primary-fg);
  --secondary: var(--hm-color-bg-muted);
  --secondary-foreground: var(--hm-color-fg-default);
  --muted: var(--hm-color-bg-muted);
  --muted-foreground: var(--hm-color-fg-muted);
  --accent: var(--hm-color-bg-muted);
  --accent-foreground: var(--hm-color-fg-default);
  --destructive: var(--hm-color-status-danger);
  --border: var(--hm-color-border-default);
  --input: var(--hm-color-border-default);
  --ring: var(--hm-color-border-focus);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
}
```

`packages/react/src/styles/globals.css` (dev 전용 Tailwind 엔트리 — Storybook·shadcn CLI의 v4 감지용, dist에 안 들어감):

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "@halfmoon/tokens/halfmoon/tokens.css";
@import "@halfmoon/tokens/halfmoon/tailwind.css";
@import "./theme.css";
```

`packages/react/src/index.ts` (Task 4가 export를 채움):

```ts
// components/ui의 공개 export — Task 4에서 채워짐
export { cn } from '@/lib/utils';
```

- [ ] **Step 5: 의존성 설치**

```bash
cd packages/react
pnpm add --save-exact class-variance-authority clsx tailwind-merge lucide-react
pnpm add -D typescript tsdown publint @arethetypeswrong/core react react-dom @types/react @types/react-dom vite @vitejs/plugin-react tailwindcss @tailwindcss/vite tw-animate-css
pnpm add -D @halfmoon/tokens@workspace:*
```

주의: runtime deps만 `--save-exact` (레포 컨벤션). `radix-ui`는 Task 4에서 shadcn CLI가 자동 설치.

- [ ] **Step 6: 빌드 통과 확인 (publint + attw 포함)**

```bash
cd packages/react && pnpm run build
```

Expected: `dist/index.js`, `dist/index.d.ts`, `dist/lib/utils.js`, `dist/theme.css` 생성, publint/attw 통과 (에러 0). 루트에서 `pnpm run check`도 여전히 녹색.

- [ ] **Step 7: 커밋 (dist 포함)**

```bash
git add packages/react pnpm-lock.yaml
git commit -m "feat(react): @halfmoon/react 스캐폴드 — 테마 브리지(theme.css) + tsdown unbundle 빌드"
```

---

### Task 4: shadcn 컴포넌트 13개 copy-in

**Files:**
- Create: `packages/react/components.json`, `packages/react/src/components/ui/*.tsx` (13개 — CLI 생성)
- Modify: `packages/react/src/index.ts`, `packages/react/package.json` (CLI가 radix-ui 추가)

**Interfaces:**
- Consumes: Task 3의 tsconfig paths(`@/*`), `src/lib/utils.ts`의 `cn`, `globals.css`(v4 감지).
- Produces: `@halfmoon/react`가 export하는 컴포넌트 — `Button, buttonVariants, Badge, badgeVariants, Card(+Header/Title/Description/Action/Content/Footer), Input, Label, Textarea, Select(+계열), Checkbox, Switch, Dialog(+계열), DropdownMenu(+계열), Tabs(+TabsList/TabsTrigger/TabsContent), Tooltip(+TooltipTrigger/TooltipContent/TooltipProvider)`. Task 5 스토리가 이 이름들을 import.

- [ ] **Step 1: components.json 작성**

`packages/react/components.json` (검증된 최소형 — Tailwind v4라 CLI가 new-york-v4 레지스트리를 강제하므로 style 값은 사실상 형식적; `iconLibrary`는 생략 시 radix로 잘못 기본되므로 명시):

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

- [ ] **Step 2: 13개 컴포넌트 add**

```bash
cd packages/react
pnpm dlx shadcn@latest add --yes button badge card input label textarea select checkbox switch dialog dropdown-menu tabs tooltip
```

Expected: `src/components/ui/`에 13개 `.tsx` 생성, `radix-ui`가 dependencies에 자동 추가(pnpm으로). init은 안 했으므로 테마 CSS 주입 없음 — 의도된 것(브리지가 담당).

- [ ] **Step 3: 생성물 검증**

```bash
grep -rl 'from "radix-ui"' src/components/ui | wc -l   # 통합 radix-ui import 확인 (card/input/textarea 제외 10개 안팎)
grep -rn '@radix-ui/react-' src/components/ui           # 없어야 함 (개별 패키지 혼입 = v3 레지스트리 오염)
grep -rn 'from "@/lib/utils"' src/components/ui | head -3
git status --porcelain src/styles/globals.css src/lib/utils.ts  # CLI가 손대지 않았는지 (무변경이어야 함)
```

radix-ui의 dependencies 버전을 exact로 고정:

```bash
pnpm add --save-exact radix-ui
```

- [ ] **Step 4: index.ts 공개 export 작성**

`packages/react/src/index.ts` 전체 교체:

```ts
export { cn } from '@/lib/utils';
export * from '@/components/ui/button';
export * from '@/components/ui/badge';
export * from '@/components/ui/card';
export * from '@/components/ui/input';
export * from '@/components/ui/label';
export * from '@/components/ui/textarea';
export * from '@/components/ui/select';
export * from '@/components/ui/checkbox';
export * from '@/components/ui/switch';
export * from '@/components/ui/dialog';
export * from '@/components/ui/dropdown-menu';
export * from '@/components/ui/tabs';
export * from '@/components/ui/tooltip';
```

- [ ] **Step 5: 빌드 + alias 재작성 검증**

```bash
cd packages/react && pnpm run build
grep -rn '@/lib' dist/ && echo "ALIAS LEAK" || echo "OK: alias 전부 상대경로로 재작성됨"
grep -c 'components/ui' dist/index.js   # 13개 re-export 확인
```

Expected: 빌드/publint/attw 통과, `OK: alias 전부 상대경로로 재작성됨`, dist에 컴포넌트별 파일 생성.

- [ ] **Step 6: 커밋 (dist 포함)**

```bash
git add packages/react pnpm-lock.yaml
git commit -m "feat(react): shadcn 13개 컴포넌트 copy-in (new-york-v4, 무수정) + 공개 export"
```

---

### Task 5: Storybook 10 워크벤치 + 13개 스토리

**Files:**
- Create: `packages/react/.storybook/main.ts`, `packages/react/.storybook/preview.ts`, `packages/react/src/components/ui/*.stories.tsx` (13개)
- Modify: `packages/react/package.json` (init이 devDeps/scripts 추가)
- Delete: init이 만든 예제 스토리 (`src/stories/`)

**Interfaces:**
- Consumes: Task 4의 컴포넌트 export 이름들, Task 3의 `globals.css`·vite.config(자동 병합).
- Produces: `pnpm storybook`(포트 6006) — 13개 컴포넌트가 halfmoon light/dark로 렌더, 툴바 `data-theme` 토글. 완료 기준 (c)의 검증 수단.

- [ ] **Step 1: Storybook init (비대화형)**

```bash
cd packages/react
pnpm create storybook@latest --yes --package-manager pnpm --type react-vite --no-dev --disable-telemetry --features docs
pnpm add -D @storybook/addon-themes
rm -rf src/stories
```

주의: pnpm 엄격 node_modules로 모듈 해석 에러가 나면 레포 루트 `.npmrc`에 `public-hoist-pattern[]=*storybook*` 추가 후 `pnpm install` 재시도.

- [ ] **Step 2: main.ts / preview.ts 작성**

`.storybook/main.ts` 전체 교체 (init 생성물 기준 — addons에 themes 추가, stories glob을 컴포넌트 옆 배치로):

```ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-themes'],
};
export default config;
```

`.storybook/preview.ts` 전체 교체:

```ts
import type { Preview, Renderer } from '@storybook/react-vite';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import '../src/styles/globals.css';

const preview: Preview = {
  decorators: [
    withThemeByDataAttribute<Renderer>({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
  ],
};
export default preview;
```

- [ ] **Step 3: 스토리 13개 작성**

각 파일은 `packages/react/src/components/ui/<name>.stories.tsx`. 공통 패턴: 타입은 `@storybook/react-vite`에서 import (Storybook 10 — `@storybook/react` 금지).

`button.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';

const meta = { component: Button } satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button disabled>Disabled</Button>
    </div>
  ),
};
```

`badge.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '@/components/ui/badge';

const meta = { component: Badge } satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};
```

`card.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from '@/components/ui/card';

const meta = { component: Card } satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>카드 제목</CardTitle>
        <CardDescription>semantic 토큰으로 테마링된 카드.</CardDescription>
      </CardHeader>
      <CardContent>본문 내용이 들어간다.</CardContent>
      <CardFooter>
        <Button>확인</Button>
      </CardFooter>
    </Card>
  ),
};
```

`input.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '@/components/ui/input';

const meta = { component: Input } satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-4">
      <Input placeholder="이메일 입력" />
      <Input placeholder="비활성" disabled />
    </div>
  ),
};
```

`label.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const meta = { component: Label } satisfies Meta<typeof Label>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithInput: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="email">이메일</Label>
      <Input id="email" placeholder="you@example.com" />
    </div>
  ),
};
```

`textarea.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from '@/components/ui/textarea';

const meta = { component: Textarea } satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Textarea className="w-72" placeholder="내용을 입력하세요" />,
};
```

`select.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

const meta = { component: Select } satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="테마 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem>
      </SelectContent>
    </Select>
  ),
};
```

`checkbox.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const meta = { component: Checkbox } satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">약관에 동의합니다</Label>
    </div>
  ),
};
```

`switch.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const meta = { component: Switch } satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="alarm" />
      <Label htmlFor="alarm">알림 켜기</Label>
    </div>
  ),
};
```

`dialog.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';

const meta = { component: Dialog } satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">다이얼로그 열기</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>정말 삭제할까요?</DialogTitle>
          <DialogDescription>이 동작은 되돌릴 수 없습니다.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive">삭제</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
```

`dropdown-menu.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const meta = { component: DropdownMenu } satisfies Meta<typeof DropdownMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">메뉴</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>내 계정</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>프로필</DropdownMenuItem>
        <DropdownMenuItem>설정</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">로그아웃</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
```

`tabs.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const meta = { component: Tabs } satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tokens" className="w-80">
      <TabsList>
        <TabsTrigger value="tokens">토큰</TabsTrigger>
        <TabsTrigger value="components">컴포넌트</TabsTrigger>
      </TabsList>
      <TabsContent value="tokens">DTCG 토큰이 단일 소스.</TabsContent>
      <TabsContent value="components">shadcn을 브리지로 테마링.</TabsContent>
    </Tabs>
  ),
};
```

`tooltip.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const meta = { component: Tooltip } satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">호버하세요</Button>
      </TooltipTrigger>
      <TooltipContent>halfmoon 토큰으로 테마링된 툴팁</TooltipContent>
    </Tooltip>
  ),
};
```

- [ ] **Step 4: Storybook 정적 빌드로 컴파일 검증**

```bash
cd packages/react && pnpm run build-storybook
```

Expected: 빌드 성공 (스토리 13개 전부 컴파일, Tailwind 유틸리티 생성). 실패 시 원인 파악 — 특히 `rounded-*` 미정의(= hm radius 스케일 갭)와 alias 미해석.

- [ ] **Step 5: 수동 확인 — 완료 기준 (c)**

```bash
pnpm storybook
```

브라우저에서: 13개 스토리 렌더 확인, 툴바 테마 토글 → light/dark 전환 확인 (배경·전경·프라이머리 색이 hm 다크 값으로 바뀌는지), Dialog/Select/Tooltip 애니메이션 동작(tw-animate-css) 확인. 문제 있으면 여기서 고치고 넘어간다 (컴포넌트 코드 무수정 원칙 유지 — 고칠 곳은 브리지·토큰·스토리·설정뿐).

- [ ] **Step 6: 커밋**

```bash
git add packages/react pnpm-lock.yaml
git commit -m "feat(react): Storybook 10 워크벤치 + 13개 스토리 (data-theme 토글)"
```

---

### Task 6: 문서 개정 (소비 레시피 · README · 스펙 오기)

**Files:**
- Modify: `docs/consuming-web.md`, `README.md`, `docs/superpowers/specs/2026-07-02-phase1-react-components-design.md` (레포명 오기)

**Interfaces:**
- Consumes: Task 2·4의 exports 경로, Task 7의 태그 이름 규칙 (`tokens-v0.2.0`, `react-v0.1.0`).
- Produces: 완료 기준 (d)의 E2E가 그대로 따라 할 소비 레시피.

- [ ] **Step 1: consuming-web.md 개정**

전체 교체:

````markdown
# 웹에서 halfmoon 사용하기 (10분)

토큰은 CSS 변수·TS 객체라 프레임워크를 가리지 않는다. React 컴포넌트는 Tailwind v4 프로젝트에서 사용한다.

> 요구사항: **pnpm ≥ 11.7** (git 서브디렉토리 설치의 lockfile 버그가 11.7에서 수정됨). npm/yarn은 지원하지 않는다.

## A. 토큰만 쓰기 (모든 웹 프레임워크)

### 1. 설치 (1분)

```bash
pnpm add "github:halfmoon-mind/halfmoon-design#tokens-v0.2.0&path:packages/tokens"
```

> `&`는 셸 메타문자 — 반드시 따옴표로 감싼다. dist가 커밋되어 있어 설치 후 빌드가 없다.

### 2. 토큰 CSS 로드 (1분)

앱 진입점(예: `src/main.tsx`)에서:

```ts
import '@halfmoon/tokens/halfmoon/tokens.css';
```

### 3. 스타일에 사용 (5분)

CSS 어디서나 `--hm-` 변수를 쓴다. **semantic 역할만 사용할 것** (`naming.md` 참조):

```css
.card {
  background: var(--hm-color-bg-default);
  color: var(--hm-color-fg-default);
  border: 1px solid var(--hm-color-border-default);
  border-radius: var(--hm-radius-lg);
  padding: var(--hm-space-6);
}
```

### 4. 다크 모드 (1분)

`<html>`에 `data-theme="dark"`를 붙이면 전체가 다크로 전환된다:

```ts
document.documentElement.dataset.theme = 'dark';   // 켜기
delete document.documentElement.dataset.theme;      // 라이트로
```

### 5. TS에서 값이 필요할 때 (선택)

```ts
import { tokens } from '@halfmoon/tokens/halfmoon';

tokens.color.action.primary.bg; // '#2563eb' (light 값 고정)
tokens.space['4'];              // 16 (숫자, px 없음)
```

## B. React 컴포넌트 쓰기 (Vite + React 19 + Tailwind v4)

### 1. 설치 (2분)

```bash
pnpm add tailwindcss @tailwindcss/vite tw-animate-css
pnpm add "github:halfmoon-mind/halfmoon-design#tokens-v0.2.0&path:packages/tokens"
pnpm add "github:halfmoon-mind/halfmoon-design#react-v0.1.0&path:packages/react"
```

`vite.config.ts`에 Tailwind 플러그인:

```ts
import tailwindcss from '@tailwindcss/vite';
// plugins: [react(), tailwindcss()]
```

### 2. CSS 엔트리 구성 (2분)

`src/index.css` 전체를 다음으로 교체:

```css
@import "tailwindcss";
@import "tw-animate-css";                         /* 컴포넌트 애니메이션 */
@import "@halfmoon/tokens/halfmoon/tokens.css";   /* --hm-* 변수 (light/dark) */
@import "@halfmoon/tokens/halfmoon/tailwind.css"; /* Tailwind @theme 매핑 */
@import "@halfmoon/react/theme.css";              /* shadcn 변수 브리지 */
@source "../node_modules/@halfmoon/react";
```

> **`@source` 줄을 빼먹으면 컴포넌트가 스타일 없이 렌더된다** — Tailwind v4는 node_modules를 자동 스캔하지 않는다.

### 3. 사용 (3분)

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle } from '@halfmoon/react';

export default function App() {
  return (
    <Card className="m-8 w-96">
      <CardHeader><CardTitle>halfmoon</CardTitle></CardHeader>
      <CardContent><Button>시작하기</Button></CardContent>
    </Card>
  );
}
```

다크 모드는 토큰과 동일 — `data-theme="dark"` 하나로 컴포넌트까지 전부 전환된다.
````

- [ ] **Step 2: README 개정**

`README.md` 전체 교체:

```markdown
# halfmoon

공통 디자인 시스템 모노레포. 단일 소스는 DTCG 토큰(`packages/tokens/src/`)이며,
빌드가 CSS 변수·타입된 JS 객체·Tailwind v4 `@theme` 매핑을 생성한다.
React 컴포넌트(`packages/react`)는 shadcn을 halfmoon 토큰 브리지로 테마링한다.
dist/는 커밋된다 (git 설치 시 빌드 불필요).

- 설계 스펙: `docs/superpowers/specs/`
- 사용법: `docs/consuming-web.md`
- 토큰 규칙: `docs/naming.md`

## 개발

```bash
pnpm install
pnpm run check       # 전 패키지 build + test
pnpm --filter @halfmoon/react storybook   # 컴포넌트 워크벤치
```

## 릴리스 (패키지별)

```bash
pnpm run check
git add packages/*/dist && git commit -m "chore: rebuild dist"   # dist 변경 시
# packages/<pkg>/package.json의 version 수동 인상 후:
git commit -am "chore(tokens): v0.2.0" && git tag tokens-v0.2.0   # react는 react-v*
```

## 라이센스

[PolyForm Noncommercial 1.0.0](./LICENSE) — 개인·비상업 사용은 자유롭고,
**상업적 사용은 별도 허락이 필요합니다** (GitHub 이슈로 문의).
```

- [ ] **Step 3: 스펙 오기 수정**

`docs/superpowers/specs/2026-07-02-phase1-react-components-design.md` §7의 설치 예시에서 `halfmoon_design` → `halfmoon-design` (2곳).

- [ ] **Step 4: 커밋**

```bash
git add docs README.md
git commit -m "docs: 소비 레시피 v2 (pnpm 서브디렉토리 설치 + React 컴포넌트) + README 모노레포 갱신"
```

---

### Task 7: 릴리스 태그 + E2E 검증 (완료 기준 d)

**Files:**
- Modify: `packages/tokens/package.json` (0.1.0→0.2.0), `packages/react/package.json` (0.0.0→0.1.0)
- 스크래치: `<scratchpad>/hm-e2e/` (Vite 앱 — 레포 밖, 커밋 안 함)

**Interfaces:**
- Consumes: 전 태스크 결과, `docs/consuming-web.md` 레시피.
- Produces: 태그 `tokens-v0.2.0`, `react-v0.1.0` (push됨), E2E 통과 기록.

- [ ] **Step 1: 최종 체크 + 버전 인상**

```bash
cd /Users/sanghyeon/projects/halfmoon_design && pnpm run check
```

`packages/tokens/package.json` version → `0.2.0`, `packages/react/package.json` version → `0.1.0`.

```bash
git commit -am "chore: release tokens 0.2.0, react 0.1.0"
git tag tokens-v0.2.0
git tag react-v0.1.0
```

- [ ] **Step 2: push (사용자 확인 후)**

원격 push는 외부 공개 동작 — 실행 시점에 사용자에게 확인받고 진행:

```bash
git push origin main --tags
```

- [ ] **Step 3: E2E — 레시피 그대로 소비 (완료 기준 d)**

스크래치 디렉토리에서 (레포 밖):

```bash
pnpm create vite@latest hm-e2e --template react-ts
cd hm-e2e && pnpm install
pnpm add tailwindcss @tailwindcss/vite tw-animate-css
pnpm add "github:halfmoon-mind/halfmoon-design#tokens-v0.2.0&path:packages/tokens"
pnpm add "github:halfmoon-mind/halfmoon-design#react-v0.1.0&path:packages/react"
```

`vite.config.ts`에 `tailwindcss()` 플러그인 추가, `src/index.css`를 레시피 §B.2의 6줄로 교체, `src/App.tsx`를 레시피 §B.3 코드로 교체 (+ 다크 토글 버튼 하나):

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle } from '@halfmoon/react';

export default function App() {
  const toggle = () =>
    document.documentElement.dataset.theme =
      document.documentElement.dataset.theme === 'dark' ? '' : 'dark';
  return (
    <Card className="m-8 w-96">
      <CardHeader><CardTitle>halfmoon E2E</CardTitle></CardHeader>
      <CardContent className="flex gap-2">
        <Button>시작하기</Button>
        <Button variant="outline" onClick={toggle}>다크 토글</Button>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: 검증**

```bash
pnpm run build
grep -l 'hm-color-bg-default' dist/assets/*.css   # 토큰 변수 도달
grep -o 'bg-primary' dist/assets/*.css | head -1  # 컴포넌트 유틸리티 생성 (= @source 동작)
pnpm dev   # 브라우저: 카드+버튼이 halfmoon 색으로 렌더, 다크 토글 동작
```

Expected: 빌드 성공, 두 grep 모두 매치, 브라우저에서 blue-600 프라이머리 버튼 + `data-theme` 토글로 다크 전환. **10분 레시피를 벗어난 수동 개입이 있었다면 레시피를 고치고 재검증.**

- [ ] **Step 5: E2E 결과 기록 커밋 (레시피 수정이 있었을 때만)**

```bash
git add docs/consuming-web.md && git commit -m "docs: E2E 검증 중 발견된 레시피 보정"
git push origin main
```

---

## 완료 기준 대조 (스펙 §9)

- (a) 토큰 게이트 + dist freshness → Task 1 Step 5 (CI, `packages/*/dist`)
- (b) `@theme` 출력 스모크 → Task 2 Step 1 테스트
- (c) Storybook 13개 + 다크 토글 → Task 5 Step 4·5
- (d) 새 Vite 앱 10분 레시피 → Task 7 Step 3·4
