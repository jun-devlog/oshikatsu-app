/**
 * 推しログ デザインテーマ v2
 * LP カラー: ピンク #E991A8 / 紫 #9B8EC4 / 白〜薄ラベンダー背景
 */
export const COLORS = {
  // ── ブランドカラー ──
  primary: '#E991A8',        // LP メインピンク
  primaryDark: '#D06A8A',    // 濃いピンク（ボタン押下・強調）
  primaryLight: '#FAD5E3',   // 薄ピンク（バナー背景・バッジ）
  primaryBg: '#FEF0F5',      // 極薄ピンク（カード背景ハイライト）

  accent: '#9B8EC4',         // 紫アクセント
  accentDark: '#7B5EA7',     // 濃い紫（見出し）
  accentLight: '#D8D0F0',    // 薄紫（バッジ・タグ）
  accentBg: '#F3EFFF',       // 極薄紫（セクション背景）

  // ── 背景 ──
  background: '#F9F6FF',     // 全体背景（薄ラベンダー）
  cardBg: '#FFFFFF',
  headerBg: '#FFFFFF',
  inputBg: '#FAF8FF',

  // ── テキスト ──
  text: '#2A1F40',           // メインテキスト（深い紫がかった黒）
  textSecondary: '#7E6EA0',  // サブテキスト
  textTertiary: '#AFA0C8',   // 補足テキスト
  placeholder: '#C4B8D8',

  // ── UI要素 ──
  border: '#EDE5F8',
  borderActive: '#C4A3E8',
  shadow: '#8B7AB0',
  divider: '#F2EEF9',

  // ── カテゴリカラー（LP収支管理画面参考） ──
  cat: {
    配信:   { bg: '#E6F3FF', text: '#4A8FD9', border: '#BDDAF5' },
    ライブ: { bg: '#FFE6F2', text: '#D9498A', border: '#F5BDDA' },
    グッズ: { bg: '#FFF3E6', text: '#D98C49', border: '#F5D9BD' },
    イベント: { bg: '#F0E6FF', text: '#8C49D9', border: '#D8BDF5' },
    聖地巡礼: { bg: '#E6FFF3', text: '#49D98C', border: '#BDF5D8' },
    感想:   { bg: '#FFFCE6', text: '#C9A200', border: '#F5EAB0' },
    支出:   { bg: '#FFE6E6', text: '#D94949', border: '#F5BDBD' },
    その他: { bg: '#F4F2F8', text: '#8C82A0', border: '#DDD8EC' },
  } as Record<string, { bg: string; text: string; border: string }>,

  // ── 底部ナビ ──
  navBg: '#FFFFFF',
  navBorder: '#EDE5F8',
  navActive: '#E991A8',
  navInactive: '#BDB0D0',
};

export const RADIUS = {
  card: 20,
  cardSm: 14,
  input: 12,
  button: 14,
  chip: 20,
  badge: 10,
  circle: 999,
};

export const SHADOW = {
  card: {
    shadowColor: '#8B7AB0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardStrong: {
    shadowColor: '#8B7AB0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 5,
  },
};
