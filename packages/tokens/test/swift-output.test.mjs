import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const swift = readFileSync('../../Sources/HalfmoonTokens/Tokens.swift', 'utf8');

test('Tokens.swift: 색상은 라이트/다크 쌍 + SwiftUI 래퍼', () => {
  assert.match(swift, /bgDefaultUI: UIColor = \.hm\(light: 0xFFFFFF, dark: 0x020617\)/);
  assert.match(swift, /var bgDefault: Color \{ Color\(uiColor: bgDefaultUI\) \}/);
  // dark에 오버라이드 없는 토큰은 light 값으로 폴백 (border.focus)
  assert.match(swift, /borderFocusUI: UIColor = \.hm\(light: 0x3B82F6, dark: 0x3B82F6\)/);
  // primitive 색상(gray 등)은 노출 금지
  assert.doesNotMatch(swift, /gray/i);
});

test('Tokens.swift: dimension/typography 변환 규칙', () => {
  assert.match(swift, /public static let _4: CGFloat = 16/);          // 숫자 시작 키 -> _ 접두
  assert.match(swift, /public static let md: CGFloat = 8/);           // radius
  assert.match(swift, /public static let _2xl: CGFloat = 24/);        // fontSize
  assert.match(swift, /headingLg = HMTextStyle\(size: 30, weight: 700, lineHeight: 1\.25\)/);
});
