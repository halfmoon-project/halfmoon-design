// 수기 헬퍼 — 생성된 Tokens.kt가 사용하는 타입/함수.
package halfmoon.tokens

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

/**
 * 라이트/다크 RGB hex 쌍 → 시스템 다크 모드에 따라 해석되는 Color.
 * 토큰이 전부 불투명이라 alpha는 FF 고정.
 */
@Composable
@ReadOnlyComposable
internal fun hm(light: Long, dark: Long): Color =
    Color(0xFF000000 or (if (isSystemInDarkTheme()) dark else light))

/**
 * 타이포그래피 토큰 원시값.
 * textStyle은 시스템 폰트 기준 — Pretendard 번들링은 필요해질 때 추가.
 */
class HmTextStyle(val size: Float, val weight: Int, val lineHeight: Float) {
    /** lineHeight는 배수(1.5 등) → fontSize에 곱해 sp로 적용. */
    val textStyle: TextStyle = TextStyle(
        fontSize = size.sp,
        fontWeight = FontWeight(weight),
        lineHeight = (size * lineHeight).sp,
    )
}
