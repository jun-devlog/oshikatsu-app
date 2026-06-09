/**
 * 推しログ デザインテーマ
 * LPカラー: #E991A8 (ピンク), 紫系グラデーション
 */
export const COLORS = {
  // ブランドカラー
  primary: '#D4638A',         // ピンクローズ（LP #E991A8 より少し深め）
  primaryLight: '#E991A8',    // LP メインピンク
  accent: '#9B6EC8',          // 紫アクセント
  accentLight: '#C4A3E8',     // 薄紫

  // 背景
  background: '#FDF8FF',      // 極薄紫がかった白
  cardBg: '#FFFFFF',
  inputBg: '#FAFAFD',
  headerBg: '#FFFFFF',

  // テキスト
  text: '#2D2040',            // ダーク紫がかったテキスト
  textSecondary: '#7A6A8A',   // セカンダリ
  placeholder: '#C0B0D0',

  // ボーダー・シャドウ
  border: '#E8DEF4',
  shadow: '#7A5A9A',
  divider: '#F0E8FA',

  // グラデーション（参考値）
  gradientStart: '#F8E8FF',
  gradientEnd: '#FFE8F4',
};

export const RADIUS = {
  card: 18,
  input: 12,
  button: 14,
  badge: 20,
};

export const FONTS = {
  heading: {
    fontSize: 24,
    fontWeight: '800' as const,
    letterSpacing: 0.5,
  },
  subheading: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
};
