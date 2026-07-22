// 수기 헬퍼 — 생성된 Tokens.swift가 사용하는 타입/이니셜라이저.
import SwiftUI
import UIKit

extension UIColor {
    /// 라이트/다크 hex 쌍 → trait collection에 따라 동적으로 해석되는 UIColor.
    /// 토큰이 전부 불투명이라 alpha는 1 고정.
    static func hm(light: UInt32, dark: UInt32) -> UIColor {
        UIColor { trait in
            UIColor(hmHex: trait.userInterfaceStyle == .dark ? dark : light)
        }
    }

    convenience init(hmHex hex: UInt32) {
        self.init(
            red: CGFloat((hex >> 16) & 0xFF) / 255,
            green: CGFloat((hex >> 8) & 0xFF) / 255,
            blue: CGFloat(hex & 0xFF) / 255,
            alpha: 1
        )
    }
}

/// 타이포그래피 토큰 원시값.
/// font/uiFont는 시스템 폰트 기준 — Pretendard 번들링은 필요해질 때 추가.
public struct HMTextStyle: Sendable {
    public let size: CGFloat
    /// CSS 스케일 (400/500/600/700/800)
    public let weight: Int
    /// 배수 (1.5 등). Font는 lineHeight를 받지 못하므로 lineSpacing 계산용으로 노출.
    public let lineHeight: CGFloat

    public var font: Font { .system(size: size, weight: Font.Weight(hmCss: weight)) }
    public var uiFont: UIFont { .systemFont(ofSize: size, weight: UIFont.Weight(hmCss: weight)) }
}

extension Font.Weight {
    init(hmCss weight: Int) {
        switch weight {
        case ..<450: self = .regular
        case ..<550: self = .medium
        case ..<650: self = .semibold
        case ..<750: self = .bold
        default: self = .heavy
        }
    }
}

extension UIFont.Weight {
    init(hmCss weight: Int) {
        switch weight {
        case ..<450: self = .regular
        case ..<550: self = .medium
        case ..<650: self = .semibold
        case ..<750: self = .bold
        default: self = .heavy
        }
    }
}
