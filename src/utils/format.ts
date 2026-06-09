/**
 * 金額を「¥1,000」形式にフォーマットする
 */
export function formatAmount(amount: number): string {
  return `¥${amount.toLocaleString('ja-JP')}`;
}

/**
 * 日付文字列を「2025年7月12日」形式にフォーマットする
 * タイムゾーン問題を避けるため文字列を直接パース
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return dateStr;
  return `${year}年${month}月${day}日`;
}

/**
 * 日付文字列を「7月12日（金）」形式にフォーマットする（カレンダー用）
 * タイムゾーン問題を避けるため文字列を直接パース
 */
export function formatDateShort(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return dateStr;
  const d = new Date(year, month - 1, day);
  if (isNaN(d.getTime())) return dateStr;
  const dow = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
  return `${month}月${day}日（${dow}）`;
}

/**
 * 今日の日付をYYYY-MM-DD形式で返す
 */
export function todayString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * 簡易ユニークID生成
 */
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
