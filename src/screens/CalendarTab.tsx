import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Oshi, OshiLog } from '../types/oshi';
import { formatDateShort, formatAmount } from '../utils/format';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';

type Props = {
  logs: OshiLog[];
  oshis: Oshi[];
};

type DateGroup = {
  date: string;
  logs: OshiLog[];
};

// カテゴリ左ボーダーカラー
const BORDER_COLORS: Record<string, string> = {
  配信: '#4A8FD9',
  ライブ: '#E991A8',
  グッズ: '#D98C49',
  イベント: '#9B8EC4',
  聖地巡礼: '#49D98C',
  感想: '#C9A200',
  支出: '#D94949',
  その他: '#AFA0C8',
};

const CAT_ICONS: Record<string, string> = {
  配信: '📺', ライブ: '🎤', グッズ: '🛍️',
  イベント: '🎪', 聖地巡礼: '🗺️', 感想: '💭',
  支出: '💸', その他: '📌',
};

function groupByDate(logs: OshiLog[]): DateGroup[] {
  // 日付の降順でソート
  const sorted = [...logs].sort((a, b) => {
    if (b.date < a.date) return -1;
    if (b.date > a.date) return 1;
    return 0;
  });
  const groups: DateGroup[] = [];
  for (const log of sorted) {
    const last = groups[groups.length - 1];
    if (last && last.date === log.date) {
      last.logs.push(log);
    } else {
      groups.push({ date: log.date, logs: [log] });
    }
  }
  return groups;
}

export default function CalendarTab({ logs, oshis }: Props) {
  const getOshiName = (oshiId: string) =>
    oshis.find((o) => o.id === oshiId)?.name ?? '不明';

  const groups = groupByDate(logs);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ページヘッダー */}
      <View style={styles.pageHeader}>
        <View style={styles.pageHeaderDeco} />
        <Text style={styles.pageTitle}>📅 イベントカレンダー</Text>
        <Text style={styles.pageSub}>推し活の記録を日付順で確認できます</Text>
      </View>

      <View style={styles.body}>
        {groups.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={styles.emptyTitle}>ログがまだありません</Text>
            <Text style={styles.emptyDesc}>
              ホームタブからログを記録すると{'\n'}ここに表示されます
            </Text>
          </View>
        ) : (
          groups.map((group) => (
            <View key={group.date} style={styles.group}>
              {/* 日付ヘッダー */}
              <View style={styles.dateHeader}>
                <View style={styles.dateDot} />
                <Text style={styles.dateText}>{formatDateShort(group.date)}</Text>
                <View style={styles.dateLine} />
              </View>

              {/* イベント一覧 */}
              {group.logs.map((log) => {
                const borderColor =
                  BORDER_COLORS[log.category] ?? BORDER_COLORS['その他'];
                const catColor =
                  COLORS.cat[log.category] ?? COLORS.cat['その他'];
                return (
                  <View
                    key={log.id}
                    style={[styles.eventCard, { borderLeftColor: borderColor }]}
                  >
                    {/* カテゴリバッジ */}
                    <View style={styles.eventTop}>
                      <View
                        style={[
                          styles.catBadge,
                          {
                            backgroundColor: catColor.bg,
                            borderColor: catColor.border,
                          },
                        ]}
                      >
                        <Text style={styles.catIcon}>
                          {CAT_ICONS[log.category] ?? '📌'}
                        </Text>
                        <Text style={[styles.catText, { color: catColor.text }]}>
                          {log.category}
                        </Text>
                      </View>
                      {log.amount != null && (
                        <Text style={styles.amount}>
                          -{formatAmount(log.amount)}
                        </Text>
                      )}
                    </View>

                    {/* タイトル */}
                    <Text style={styles.eventTitle}>{log.title}</Text>

                    {/* 推し名 */}
                    <Text style={styles.oshiName}>
                      💕 {getOshiName(log.oshiId)}
                    </Text>

                    {/* メモ */}
                    {log.memo ? (
                      <Text style={styles.memo} numberOfLines={2}>
                        {log.memo}
                      </Text>
                    ) : null}
                  </View>
                );
              })}
            </View>
          ))
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ログはホームタブから記録できます 📝
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 32 },

  // ページヘッダー
  pageHeader: {
    backgroundColor: COLORS.headerBg,
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    marginBottom: 8,
    ...SHADOW.card,
  },
  pageHeaderDeco: {
    position: 'absolute', top: -30, right: -30,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: COLORS.accentBg, opacity: 0.7,
  },
  pageTitle: {
    fontSize: 20, fontWeight: '800',
    color: COLORS.accentDark, letterSpacing: 0.3, marginBottom: 6,
  },
  pageSub: {
    fontSize: 13, color: COLORS.textSecondary, lineHeight: 18,
  },

  body: { paddingHorizontal: 16, paddingTop: 4 },

  // 日付グループ
  group: { marginBottom: 20 },

  dateHeader: {
    flexDirection: 'row', alignItems: 'center',
    gap: 8, marginBottom: 10,
  },
  dateDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  dateText: {
    fontSize: 14, fontWeight: '700',
    color: COLORS.accentDark, letterSpacing: 0.3,
  },
  dateLine: {
    flex: 1, height: 1, backgroundColor: COLORS.border,
  },

  // イベントカード（LP「イベント一覧」スタイル）
  eventCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.cardSm,
    padding: 14,
    marginBottom: 8,
    borderLeftWidth: 4,
    ...SHADOW.card,
  },
  eventTop: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 6,
  },
  catBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 9, paddingVertical: 3,
    borderRadius: RADIUS.chip, borderWidth: 1,
  },
  catIcon: { fontSize: 11 },
  catText: { fontSize: 11, fontWeight: '700' },
  amount: {
    fontSize: 14, fontWeight: '700', color: '#D94949',
  },
  eventTitle: {
    fontSize: 15, fontWeight: '700',
    color: COLORS.text, marginBottom: 4,
  },
  oshiName: {
    fontSize: 12, fontWeight: '600',
    color: COLORS.primary, marginBottom: 2,
  },
  memo: {
    fontSize: 12, color: COLORS.textSecondary,
    lineHeight: 18, marginTop: 2,
  },

  // 空状態
  empty: {
    alignItems: 'center', paddingVertical: 60,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 14 },
  emptyTitle: {
    fontSize: 16, fontWeight: '700',
    color: COLORS.accentDark, marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 13, color: COLORS.textTertiary,
    textAlign: 'center', lineHeight: 20,
  },

  footer: { alignItems: 'center', paddingTop: 16, paddingBottom: 8 },
  footerText: { fontSize: 12, color: COLORS.textTertiary },
});
