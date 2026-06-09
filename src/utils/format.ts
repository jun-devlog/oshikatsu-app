/**
 * 金額を「¥1,000」形式にフォーマットする
 */
export function formatAmount(amount: number): string {
  return `¥${amount.toLocaleString('ja-JP')}`;
}

/**
 * 日付文字列を「2025年7月12日」形式にフォーマットする
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
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
