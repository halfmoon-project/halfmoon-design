import StyleDictionary from 'style-dictionary';

// DTCG 값 -> JS 값. dimension은 단위를 버리고 숫자만 (스펙 §5).
function toJsValue(token) {
  const v = token.$value ?? token.value;
  const t = token.$type ?? token.type;
  switch (t) {
    case 'color':
      return typeof v === 'string' ? v : v.hex;
    case 'dimension':
      return typeof v === 'object' ? v.value : parseFloat(v);
    case 'typography':
      return {
        fontFamily: v.fontFamily,
        fontSize: typeof v.fontSize === 'object' ? v.fontSize.value : parseFloat(v.fontSize),
        fontWeight: v.fontWeight,
        lineHeight: v.lineHeight,
      };
    default:
      return v;
  }
}

function buildTree(allTokens) {
  const root = {};
  for (const token of allTokens) {
    let node = root;
    const path = token.path;
    for (let i = 0; i < path.length - 1; i++) node = node[path[i]] ??= {};
    node[path.at(-1)] = toJsValue(token);
  }
  return root;
}

// JSON.stringify 출력은 리터럴 값이자 유효한 TS 리터럴 타입 표기라 두 포맷이 빌더를 공유한다.
export function registerFormats() {
  StyleDictionary.registerFormat({
    name: 'javascript/literal',
    format: ({ dictionary }) =>
      `export const tokens = ${JSON.stringify(buildTree(dictionary.allTokens), null, 2)};\n`,
  });
  StyleDictionary.registerFormat({
    name: 'typescript/literal-declarations',
    format: ({ dictionary }) =>
      `export declare const tokens: ${JSON.stringify(buildTree(dictionary.allTokens), null, 2)};\n`,
  });
  // Tailwind v4 @theme 매핑. 값이 var(--hm-*) 참조라 @theme inline 필수 (스펙 §3).
  // 색상은 semantic만 — primitive 노출은 "직접 참조 금지" 원칙의 유틸리티 우회가 된다.
  StyleDictionary.registerFormat({
    name: 'css/tailwind-theme',
    format: ({ dictionary }) => {
      const lines = [];
      for (const t of dictionary.allTokens) {
        const type = t.$type ?? t.type;
        const path = t.path;
        let name = null;
        if (type === 'color' && t.filePath.includes('/semantic/')) {
          name = `--color-${path.slice(1).join('-')}`;          // color.bg.default -> --color-bg-default
        } else if (path[0] === 'space') {
          name = `--spacing-${path.slice(1).join('-')}`;
        } else if (path[0] === 'radius') {
          name = `--radius-${path.slice(1).join('-')}`;
        } else if (path[0] === 'font' && path[1] === 'family') {
          name = `--font-${path.slice(2).join('-')}`;
        } else if (path[0] === 'font' && path[1] === 'weight') {
          name = `--font-weight-${path.slice(2).join('-')}`;
        } else if (path[0] === 'font' && path[1] === 'lineHeight') {
          name = `--leading-${path.slice(2).join('-')}`;
        } else if (path[0] === 'size' && path[1] === 'font') {
          name = `--text-${path.slice(2).join('-')}`;
        }
        if (name) lines.push(`  ${name}: var(--${t.name});`);   // t.name = css transform 결과 (hm-…)
      }
      return `@theme inline {\n${lines.join('\n')}\n}\n`;
    },
  });
}
