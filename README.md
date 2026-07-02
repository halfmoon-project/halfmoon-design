# halfmoon

playtag 프로젝트들의 공통 디자인 시스템. 단일 소스는 DTCG 토큰(`src/`)이며,
빌드가 웹용 CSS 변수와 타입된 JS 객체를 생성한다(`dist/`, 커밋됨).

- 설계 스펙: `docs/superpowers/specs/2026-07-02-halfmoon-design-system-design.md`
- 사용법: `docs/consuming-web.md`
- 토큰 규칙: `docs/naming.md`

## 개발

```bash
npm ci
npm run check   # build + test
```

## 릴리스

```bash
npm run check
git add dist && git commit -m "chore: rebuild dist"   # dist 변경이 있을 때
npm version 0.1.0                                      # 커밋 + v0.1.0 태그 생성
```

## 라이센스

[PolyForm Noncommercial 1.0.0](./LICENSE) — 개인·비상업 사용은 자유롭고,
**상업적 사용은 별도 허락이 필요합니다** (GitHub 이슈로 문의).
