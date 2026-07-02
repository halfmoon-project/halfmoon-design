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
}
