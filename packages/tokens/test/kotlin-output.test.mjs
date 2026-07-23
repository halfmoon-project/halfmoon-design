import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const kt = readFileSync('../../android/src/main/kotlin/halfmoon/tokens/Tokens.kt', 'utf8');

test('Tokens.kt: 색상은 라이트/다크 쌍 composable getter', () => {
  assert.match(kt, /val bgDefault: Color @Composable @ReadOnlyComposable get\(\) = hm\(light = 0xFFFFFF, dark = 0x020617\)/);
  // dark에 오버라이드 없는 토큰은 light 값으로 폴백 (border.focus)
  assert.match(kt, /val borderFocus: Color .* = hm\(light = 0x3B82F6, dark = 0x3B82F6\)/);
  // primitive 색상(gray 등)은 노출 금지
  assert.doesNotMatch(kt, /gray/i);
});

test('Tokens.kt: dimension/typography 변환 규칙', () => {
  assert.match(kt, /val _4: Dp = 16\.dp/);                 // 숫자 시작 키 -> _ 접두
  assert.match(kt, /val md: Dp = 8\.dp/);                  // radius
  assert.match(kt, /val _2xl: TextUnit = 24\.sp/);         // fontSize
  assert.match(kt, /val bold: FontWeight = FontWeight\(700\)/);
  assert.match(kt, /val headingLg = HmTextStyle\(size = 30f, weight = 700, lineHeight = 1\.25f\)/);
});
