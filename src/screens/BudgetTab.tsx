import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { OshiLog, Oshi } from '../types/oshi';
import { formatAmount, formatDateShort } from '../utils/format';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';

type Props = {
  logs: OshiLog[];
  oshis: Oshi[];
};

const CAT_ICONS: Record<string, string> = {
  配信: '📺', ライブ: '🎤', グッズ: '🛍️',
  イベント: '🎪', 聖地巡礼: '🗺️', 感想: '💭',
  支出: '💸', その他: '📌',
};

export default function BudgetTab({ logs, oshis }: Props) {
  const logsWithAmount = logs.filter((l) => l.amount != null && l.amount > 0);
  const totalAmount = logsWithAmount.reduce((sum, l) => sum + (l.amount ?? 0), 0);

  // カテゴリ別合計
  const breakdown = logsWithAmount.reduce<Record<string, number>>((acc, l) => {
    acc[l.category] = (acc[l.category] ?? 0) + (l.amount ?? 0);
    return acc;
  }, {});
  const breakdownEntries = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);

  const getOshiName = (oshiId: string) =>
    oshis.find((o) => o.id === oshiId)?.name ?? '不明';

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ページヘッダー */}
      <View style={styles.pageHeader}>
        <View style={styles.pageHeaderDeco} />
        <Text style={styles.pageTitle}>💰 収支管理</Text>
        <Text style={styles.pageSub}>推し活の支出をまとめて確認できます</Text>
      </View>

      <View style={styles.body}>
        {/* 合計支出カード（LP「収支管理」画面参考） */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>合計支出</Text>
          <Text style={styles.totalAmount}>{formatAmount(totalAmount)}</Text>
          <View style={styles.totalRow}>
            <View style={styles.totalSub}>
              <Text style={styles.totalSubLabel}>記録件数</Text>
              <Text style={styles.totalSubVal}>{logsWithAmount.length}件</Text>
            </View>
            <View style={styles.totalSubDivider} />
            <View style={styles.totalSub}>
              <Text style={styles.totalSubLabel}>記録カテゴリ</Text>
              <Text style={styles.totalSubVal}>{breakdownEntries.length}種</Text>
            </View>
          </View>
        </View>

        {/* カテゴリ別内訳 */}
        {breakdownEntries.length > 0 && (
          <>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionEmoji}>📊</Text>
              <Text style={styles.sectionTitle}>カテゴリ別</Text>
            </View>
            <View style={styles.breakdownCard}>
              {breakdownEntries.map(([cat, amount], idx) => {
                const catStyle = COLORS.cat[cat] ?? COLORS.cat['その他'];
                const ratio = totalAmount > 0 ? amount / totalAmount : 0;
                return (
                  <View
                    key={cat}
                    style={[
                      styles.breakdownRow,
                      idx < breakdownEntries.length - 1 && styles.breakdownRowBorder,
                    ]}
                  >
                    <View style={styles.breakdownLeft}>
                      <View
                        style={[
                          styles.breakdownDot,
                          { backgroundColor: catStyle.text },
                        ]}
                      />
                      <Text style={styles.breakdownIcon}>{CAT_ICONS[cat] ?? '📌'}</Text>
                      <Text style={styles.breakdownCat}>{cat}</Text>
                    </View>
                    <View style={styles.breakdownRight}>
                      <Text style={styles.breakdownRatio}>
                        {Math.round(ratio * 100)}%
                      </Text>
                      <Text style={styles.breakdownAmount}>
                        -{formatAmount(amount)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* 支出ログ一覧 */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionEmoji}>📋</Text>
          <Text style={styles.sectionTitle}>支出一覧</Text>
          {logsWithAmount.length > 0 && (
            <Text style={styles.sectionHint}>{logsWithAmount.length}件</Text>
          )}
        </View>

        {logsWithAmount.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>💸</Text>
            <Text style={styles.emptyTitle}>支出記録がまだありません</Text>
            <Text style={styles.emptyDesc}>
              ホームタブで金額を入力してログを記録すると{'\n'}ここに表示されます
            </Text>
          </View>
        ) : (
          logsWithAmount.map((log) => {
            const catStyle = COLORS.cat[log.category] ?? COLORS.cat['その他'];
            return (
              <View key={log.id} style={styles.logRow}>
                <View style={styles.logLeft}>
                  <Text style={styles.logDate}>{formatDateShort(log.date)}</Text>
                  <Text style={styles.logTitle}>{log.title}</Text>
                  <View style={styles.logMeta}>
                    <Text style={styles.logOshi}>💕 {getOshiName(log.oshiId)}</Text>
                    <View
                      style={[
                        styles.logCatBadge,
                        {
                          backgroundColor: catStyle.bg,
                          borderColor: catStyle.border,
                        },
                      ]}
                    >
                      <Text style={[styles.logCatText, { color: catStyle.text }]}>
                        {CAT_ICONS[log.category]}{log.category}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.logAmount}>-{formatAmount(log.amount!)}</Text>
              </View>
            );
          })
        )}
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
    paddingTop: 24, paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    overflow: 'hidden', marginBottom: 8,
    ...SHADOW.card,
  },
  pageHeaderDeco: {
    position: 'absolute', top: -30, right: -30,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: COLORS.primaryBg, opacity: 0.7,
  },
  pageTitle: {
    fontSize: 20, fontWeight: '800',
    color: COLORS.accentDark, letterSpacing: 0.3, marginBottom: 6,
  },
  pageSub: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },

  body: { paddingHorizontal: 16, paddingTop: 4 },

  // 合計支出カード（LP 収支管理画面風）
  totalCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    padding: 20, marginBottom: 20,
    alignItems: 'center',
    ...SHADOW.cardStrong,
    borderTopWidth: 4, borderTopColor: COLORS.primary,
  },
  totalLabel: {
    fontSize: 13, color: COLORS.textSecondary,
    fontWeight: '600', marginBottom: 6,
  },
  totalAmount: {
    fontSize: 36, fontWeight: '800',
    color: COLORS.primaryDark, letterSpacing: -1, marginBottom: 16,
  },
  totalRow: {
    flexDirection: 'row', width: '100%',
    backgroundColor: COLORS.background, borderRadius: RADIUS.cardSm,
    paddingVertical: 10, paddingHorizontal: 16,
  },
  totalSub: { flex: 1, alignItems: 'center' },
  totalSubLabel: { fontSize: 11, color: COLORS.textTertiary, marginBottom: 2 },
  totalSubVal: { fontSize: 16, fontWeight: '700', color: COLORS.accentDark },
  totalSubDivider: {
    width: 1, backgroundColor: COLORS.border, marginHorizontal: 12,
  },

  // セクションヘッダー
  sectionHeaderRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 6, marginBottom: 10, marginTop: 4,
  },
  sectionEmoji: { fontSize: 16 },
  sectionTitle: {
    fontSize: 16, fontWeight: '700',
    color: COLORS.accentDark, flex: 1,
  },
  sectionHint: { fontSize: 12, color: COLORS.textTertiary },

  // カテゴリ別内訳カード
  breakdownCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    paddingHorizontal: 16, marginBottom: 20,
    ...SHADOW.card,
  },
  breakdownRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  breakdownRowBorder: {
    borderBottomWidth: 1, borderBottomColor: COLORS.divider,
  },
  breakdownLeft: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  breakdownDot: {
    width: 8, height: 8, borderRadius: 4,
  },
  breakdownIcon: { fontSize: 14 },
  breakdownCat: {
    fontSize: 14, fontWeight: '600', color: COLORS.text,
  },
  breakdownRight: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  breakdownRatio: {
    fontSize: 12, color: COLORS.textTertiary,
    fontWeight: '600',
  },
  breakdownAmount: {
    fontSize: 15, fontWeight: '700', color: '#D94949',
    minWidth: 80, textAlign: 'right',
  },

  // 支出ログ行（LP の収支管理リストスタイル）
  logRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.cardSm,
    paddingVertical: 12, paddingHorizontal: 14,
    marginBottom: 8, ...SHADOW.card,
  },
  logLeft: { flex: 1, marginRight: 12 },
  logDate: {
    fontSize: 11, color: COLORS.textTertiary,
    fontWeight: '600', marginBottom: 3,
  },
  logTitle: {
    fontSize: 14, fontWeight: '700',
    color: COLORS.text, marginBottom: 4,
  },
  logMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logOshi: { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
  logCatBadge: {
    paddingHorizontal: 7, paddingVertical: 2,
    borderRadius: RADIUS.chip, borderWidth: 1,
  },
  logCatText: { fontSize: 10, fontWeight: '600' },
  logAmount: {
    fontSize: 15, fontWeight: '700', color: '#D94949',
  },

  // 空状態
  empty: {
    backgroundColor: COLORS.cardBg, borderRadius: RADIUS.card,
    paddingVertical: 40, alignItems: 'center', ...SHADOW.card,
  },
  emptyEmoji: { fontSize: 44, marginBottom: 12 },
  emptyTitle: {
    fontSize: 15, fontWeight: '700',
    color: COLORS.accentDark, marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 13, color: COLORS.textTertiary,
    textAlign: 'center', lineHeight: 20,
  },
});
