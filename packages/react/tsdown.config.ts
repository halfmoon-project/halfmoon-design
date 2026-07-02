import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  unbundle: true, // 파일별 출력 — "use client" 보존, tree-shaking은 소비자 번들러 몫 (스펙 §4.3)
  dts: true,
  fixedExtension: false, // .js/.d.ts 출력 (type:module) — exports 계약과 일치. node 플랫폼 기본값은 .mjs
  copy: ['src/styles/theme.css'], // -> dist/theme.css (변환 없이 그대로)
  publint: true,
  attw: { profile: 'esm-only' },
});
