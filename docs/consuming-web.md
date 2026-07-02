# 웹에서 halfmoon 토큰 사용하기 (10분)

React/Vue/Astro 공통 — 토큰은 CSS 변수와 TS 객체라 프레임워크를 가리지 않는다.

## 1. 설치 (1분)

```bash
npm install github:playtag/halfmoon#v0.1.0
```

> org/레포명·태그는 실제 호스팅 위치를 따른다. dist가 커밋되어 있어 설치 후 빌드가 필요 없다.

## 2. 토큰 CSS 로드 (1분)

앱 진입점(예: `src/main.tsx`)에서:

```ts
import '@playtag/halfmoon-tokens/halfmoon/tokens.css';
```

라이트+다크 변수가 모두 로드된다.

## 3. 스타일에 사용 (5분)

CSS 어디서나 `--hm-` 변수를 쓴다. **semantic 역할만 사용할 것** (`naming.md` 참조):

```css
.card {
  background: var(--hm-color-bg-default);
  color: var(--hm-color-fg-default);
  border: 1px solid var(--hm-color-border-default);
  border-radius: var(--hm-radius-lg);
  padding: var(--hm-space-6);
}
.card button {
  background: var(--hm-color-action-primary-bg);
  color: var(--hm-color-action-primary-fg);
}
.card button:hover {
  background: var(--hm-color-action-primary-hover);
}
```

## 4. 다크 모드 (1분)

`<html>`에 `data-theme="dark"`를 붙이면 전체가 다크로 전환된다:

```ts
document.documentElement.dataset.theme = 'dark';   // 켜기
delete document.documentElement.dataset.theme;      // 라이트로
```

## 5. TS에서 값이 필요할 때 (선택)

CSS 변수를 못 쓰는 곳(캔버스, 차트 라이브러리 설정 등)에서만:

```ts
import { tokens } from '@playtag/halfmoon-tokens/halfmoon';

tokens.color.action.primary.bg; // '#2563eb' (light 값)
tokens.space['4'];              // 16 (숫자, px 단위 없음)
```

주의: TS 객체는 light 값 고정이다. 모드를 따라가야 하면 CSS 변수를 쓴다.
