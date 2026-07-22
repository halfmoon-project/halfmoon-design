# iOS에서 halfmoon 사용하기 (5분)

토큰만 제공한다 (SwiftUI 컴포넌트 없음). 생성된 Swift가 커밋되어 있어 설치 후 빌드가 없다.

> 요구사항: **iOS 15+, Xcode 15+** (`Package.swift`에 선언됨 — 미달이면 Xcode가 추가 시점에 에러).

## 1. 설치

Xcode → File → Add Package Dependencies → `https://github.com/halfmoon-project/halfmoon-design.git`

> ⚠️ 기존 태그(`tokens-v*`)는 SPM 버전 규칙에 안 잡힌다. **Dependency Rule을 Branch(`main`) 또는 Commit으로** 지정한다. 버전 핀이 필요해지면 bare semver 태그(예: `0.4.0`)를 별도로 푸시한다.

## 2. 사용

```swift
import HalfmoonTokens

// 색상 — 라이트/다크 자동 전환 (trait collection)
Text("hello").foregroundStyle(HM.color.fgDefault)      // SwiftUI
view.backgroundColor = HM.color.bgDefaultUI            // UIKit

// 스페이싱/라디우스
.padding(HM.space._4)                                  // 16
.clipShape(RoundedRectangle(cornerRadius: HM.radius.md))

// 타이포그래피 — 시스템 폰트 기준 (Pretendard 번들 없음)
Text("제목").font(HM.typography.headingLg.font)
label.font = HM.typography.bodyMd.uiFont
```

## 이름 규칙

CSS 변수 `--hm-color-bg-default` ↔ Swift `HM.color.bgDefault`. 숫자로 시작하는 키는 `_` 접두: `space.4` → `HM.space._4`, `2xl` → `._2xl`. 색상은 semantic만 노출한다 (primitive 직접 참조 금지 원칙).
