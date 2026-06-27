/**
 * MOON Design Tokens — Colors
 *
 * 灵感来自 Notion 的克制中性色：
 * - 浅色：warm white 底 + 中性灰文字 + 蓝灰强调
 * - 深色：深灰底 + 偏暖文字 + 蓝紫强调
 *
 * 命名遵循语义（bg/fg/accent/border/muted/danger）而非字面（gray-100/200），
 * 主题切换只换 semantic value，组件代码不感知 light/dark。
 */

// ─── Palette (raw) ────────────────────────────────────────────
// Notion-style warm neutrals. 命名为 palette 中的具体灰阶，
// 仅在 colors.ts 内部引用，组件用 semantic tokens。

const slate = {
  0: '#FFFFFF',
  50: '#FAFAF7', // warm white — 默认 app bg
  100: '#F1F1EF', // sidebar bg
  150: '#E9E9E6', // hover bg
  200: '#DEDEDA', // border subtle
  300: '#C7C7C2', // border strong
  400: '#9B9A95', // fg muted
  500: '#787773', // fg secondary
  600: '#4F4E4A', // fg primary（次级）
  700: '#37352F', // fg primary（默认 Notion 文字）
  800: '#28261F',
  900: '#1F1E1A',
  950: '#15151A', // dark mode bg
  1000: '#0D0D11',
} as const;

const accent = {
  light: '#438B64', // Retro light green
  dark: '#82C49F',
  'light-hover': '#336E4D',
  'dark-hover': '#A0D9B9',
} as const;

// OKF 契约绿（属性面板中 OKF 字段用）
const contract = {
  light: '#438B64',
  dark: '#82C49F',
} as const;

// Notion 来源灰（属性面板中 Notion 私有字段用）
const source = {
  light: '#9B9A95',
  dark: '#787773',
} as const;

// 状态色
const status = {
  danger: { light: '#E03E3E', dark: '#FF6B6B' },
  warning: { light: '#D9730D', dark: '#FFA344' },
  success: { light: '#0F7B6C', dark: '#4EC9B0' },
} as const;

// ─── Semantic tokens (resolved by theme) ──────────────────────

export interface SemanticColors {
  // app surface
  appBg: string;
  sidebarBg: string;
  sidebarHoverBg: string;
  sidebarActiveBg: string;
  paneBg: string;

  // text
  fg: string;
  fgSecondary: string;
  fgMuted: string;
  fgInverse: string;

  // border
  borderSubtle: string;
  borderStrong: string;

  // accent
  accent: string;
  accentHover: string;
  accentMuted: string; // 半透明 / 浅底，用于 active 背景

  // property categories
  contract: string; // OKF 字段
  source: string; // Notion 私有字段

  // status
  danger: string;
  warning: string;
  success: string;

  // shadow base (用于 box-shadow)
  shadowColor: string;
}

export const lightColors: SemanticColors = {
  appBg: slate[50],
  sidebarBg: slate[100],
  sidebarHoverBg: slate[150],
  sidebarActiveBg: slate[200],
  paneBg: slate[50],

  fg: slate[700],
  fgSecondary: slate[600],
  fgMuted: slate[400],
  fgInverse: slate[0],

  borderSubtle: slate[200],
  borderStrong: slate[300],

  accent: accent.light,
  accentHover: accent['light-hover'],
  accentMuted: 'rgba(67, 139, 100, 0.12)',

  contract: contract.light,
  source: source.light,

  danger: status.danger.light,
  warning: status.warning.light,
  success: status.success.light,

  shadowColor: 'rgba(15, 15, 15, 0.08)',
};

export const darkColors: SemanticColors = {
  appBg: slate[950],
  sidebarBg: slate[900],
  sidebarHoverBg: slate[800],
  sidebarActiveBg: slate[700],
  paneBg: slate[950],

  fg: slate[100],
  fgSecondary: slate[200],
  fgMuted: slate[400],
  fgInverse: slate[900],

  borderSubtle: slate[800],
  borderStrong: slate[700],

  accent: accent.dark,
  accentHover: accent['dark-hover'],
  accentMuted: 'rgba(130, 196, 159, 0.16)',

  contract: contract.dark,
  source: source.dark,

  danger: status.danger.dark,
  warning: status.warning.dark,
  success: status.success.dark,

  shadowColor: 'rgba(0, 0, 0, 0.4)',
};