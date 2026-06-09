/**
 * 日付ユーティリティ関数
 * - タイムゾーン問題を回避するため、日付文字列を直接パースする
 */

/**
 * Dateオブジェクトを YYYY-MM-DD 形式の文字列に変換
 */
export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * YYYY-MM-DD を YYYY/MM/DD 表示形式に変換（フォーム表示用）
 */
export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  // YYYY-MM-DD → YYYY/MM/DD
  return dateStr.replace(/-/g, '/');
}

/**
 * YYYY-MM-DD 文字列をパースして Date を返す（タイムゾーン安全）
 * パース失敗時は null を返す
 */
export function parseDateString(dateStr: string): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  const date = new Date(y, m - 1, d);
  // 月をオーバーすると自動補正されるため比較チェック
  if (date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return date;
}

/**
 * 文字列が有効な YYYY-MM-DD 日付かどうか判定
 */
export function isValidDateString(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  return parseDateString(dateStr) !== null;
}

/**
 * 今日の日付を YYYY-MM-DD 形式で取得
 */
export function getTodayString(): string {
  return toDateString(new Date());
}

/**
 * 指定した年月の日数を返す
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * 指定した年月1日の曜日を返す（0=日, 1=月, ..., 6=土）
 */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/**
 * カレンダーグリッド用の週配列を生成
 * 各週は7要素（日~土）で、空きは null
 */
export function generateCalendarWeeks(
  year: number,
  month: number
): (number | null)[][] {
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInMonth = getDaysInMonth(year, month);

  // 先頭の空白 + 日付 + 末尾の空白でグリッド埋め
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // 7の倍数になるまでパディング
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}
