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
