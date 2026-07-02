import StyleDictionary from 'style-dictionary';
import { writeFileSync } from 'node:fs';

const THEME = 'halfmoon';
const PRIMITIVES = 'src/primitive/*.tokens.json';
const LIGHT = `src/semantic/${THEME}/light.tokens.json`;
const DARK = `src/semantic/${THEME}/dark.tokens.json`;
const OUT = `dist/${THEME}/`;

// css transformGroup이 DTCG 객체를 전부 처리한다 (검증됨: dimension -> "16px",
// fontFamily 배열 -> 콤마 조인, typography composite -> font 쇼트핸드 문자열).
const light = new StyleDictionary({
  source: [PRIMITIVES, LIGHT],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'hm',
      buildPath: OUT,
      files: [{
        destination: 'light.css',
        format: 'css/variables',
        options: { selector: ':root' },
      }],
    },
  },
});

const dark = new StyleDictionary({
  // light 위에 dark를 덮어써 같은 이름을 재정의한다 — 충돌 경고는 의도된 것이라 침묵.
  // brokenReferences 등 에러 동작은 기본값 유지 (Global Constraints).
  source: [PRIMITIVES, LIGHT, DARK],
  log: { warnings: 'disabled' },
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'hm',
      buildPath: OUT,
      files: [{
        destination: 'dark.css',
        format: 'css/variables',
        options: { selector: '[data-theme="dark"]' },
        filter: (token) => token.filePath.endsWith('dark.tokens.json'),
      }],
    },
  },
});

await light.buildAllPlatforms();
await dark.buildAllPlatforms();
writeFileSync(`${OUT}tokens.css`, "@import './light.css';\n@import './dark.css';\n");
console.log('build done:', OUT);
