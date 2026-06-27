/**
 * MOON Design Tokens — Typography
 *
 * 中文：思源宋体（Source Han Serif / Noto Serif CJK SC）
 * 西文：Noto Serif（与思源同源，混排不打架）
 * 等宽：JetBrains Mono（frontmatter 字段名、文件路径、ID）
 *
 * 加载策略：通过 globals.css 的 @import / @font-face 引 Google Fonts CDN。
 */

// ─── Font families ────────────────────────────────────────────
export const fontFamily = {
  // 衬线正文（标题、正文）
  serif: `'Lyon-Text', 'Georgia', ui-serif, serif`,
  // 中文优先，宋体回退
  serifCJK: `'Lyon-Text', 'Georgia', ui-serif, 'Source Han Serif SC', 'Source Han Serif CN', 'Noto Serif CJK SC', 'Songti SC', 'STSong', serif`,
  // 等宽（路径、ID、frontmatter key）
  mono: `'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace`,
  // 无衬线（UI 控件、按钮、菜单）—— Notion 用的是 sans-serif UI
  sans: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif`,
} as const;

// ─── Font sizes ───────────────────────────────────────────────
// 8pt 节奏，参考 Notion 的尺寸感
export const fontSize = {
  xs: '11px', // breadcrumb、metadata、tab icon 旁 label
  sm: '12px', // 侧栏文件项
  base: '14px', // UI 默认正文（控件、菜单、属性面板）
  md: '15px', // 属性面板字段名
  lg: '16px', // 段落正文
  xl: '20px', // h4
  '2xl': '24px', // h3
  '3xl': '30px', // h2
  '4xl': '40px', // h1 / 页面标题（Notion 默认 40px）
  '5xl': '48px',
} as const;

// ─── Font weights ─────────────────────────────────────────────
export const fontWeight = {
  regular: 400,
  medium: 500, // UI 强调
  semibold: 600, // 标题
  bold: 700,
} as const;

// ─── Line heights ─────────────────────────────────────────────
export const lineHeight = {
  tight: 1.25, // h1-h3
  snug: 1.4, // h4-h6
  normal: 1.5, // 正文段落
  relaxed: 1.7, // 长正文（Notion 正文）
  loose: 1.8,
} as const;

// ─── Letter spacing ───────────────────────────────────────────
export const letterSpacing = {
  tight: '-0.01em',
  normal: '0',
  wide: '0.02em',
  wider: '0.04em',
} as const;