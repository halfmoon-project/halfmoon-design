import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('tokens.js: light 값, 타입별 변환 규칙', async () => {
  const { tokens } = await import('../dist/halfmoon/tokens.js');
  assert.equal(tokens.color.bg.default, '#ffffff');            // color -> hex 문자열
  assert.equal(tokens.color.action.primary.bg, '#2563eb');     // 별칭 해석됨
  assert.equal(tokens.space['4'], 16);                         // dimension -> 단위 없는 숫자
  assert.equal(tokens.radius.md, 8);
  assert.equal(tokens.typography.body.md.fontSize, 16);        // composite 내부도 숫자
  assert.equal(tokens.typography.heading.lg.fontWeight, 700);
  assert.equal(tokens.typography.body.md.lineHeight, 1.5);
  assert.ok(Array.isArray(tokens.font.family.sans));           // fontFamily -> 배열
});

test('tokens.d.ts: 리터럴 타입 선언', () => {
  const dts = readFileSync('dist/halfmoon/tokens.d.ts', 'utf8');
  assert.match(dts, /export declare const tokens:/);
  assert.match(dts, /"default": "#ffffff"/);
  assert.match(dts, /"4": 16/);
});
