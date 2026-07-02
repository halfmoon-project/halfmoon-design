import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (f) => readFileSync(`dist/halfmoon/${f}`, 'utf8');

test('light.css: :root 아래 접두사 변수, primitive+semantic 모두 포함', () => {
  const css = read('light.css');
  assert.match(css, /:root\s*\{/);
  assert.match(css, /--hm-color-bg-default:/);          // semantic
  assert.match(css, /--hm-color-blue-600:/);            // primitive
  assert.match(css, /--hm-space-4:\s*16px/);            // dimension 객체 -> px
  assert.match(css, /--hm-font-weight-bold:\s*700/);
  assert.match(css, /--hm-typography-body-md:\s*400 16px\/1\.5/); // composite -> font 쇼트핸드
  assert.doesNotMatch(css, /\[object Object\]/);        // transform 누락 탐지
});

test('dark.css: [data-theme="dark"] 아래, dark 파일 토큰만', () => {
  const css = read('dark.css');
  assert.match(css, /\[data-theme="dark"\]\s*\{/);
  assert.match(css, /--hm-color-bg-default:/);
  assert.doesNotMatch(css, /--hm-color-blue-600:/);     // primitive 미포함
  assert.doesNotMatch(css, /--hm-color-border-focus:/); // 안 바뀌는 semantic 미포함
});

test('tokens.css: 인덱스가 두 파일을 @import', () => {
  const css = read('tokens.css');
  assert.match(css, /@import '\.\/light\.css';/);
  assert.match(css, /@import '\.\/dark\.css';/);
});
