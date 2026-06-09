import React, { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { OshiLog, Oshi, OshiGoods } from '../types/oshi';
import { formatAmount, formatDateShort } from '../utils/format';
import { getTodayString } from '../utils/date';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';

import OshiSelectorTabs from '../components/OshiFilterToggle';
import { useOshiContext } from '../contexts/OshiContext';

const CAT_ICONS: Record<string, string> = {
  // ログカテゴリ
  配信: '📺', ライブ: '🎤', グッズ: '🛍️',
  イベント: '🎪', 聖地巡礼: '🗺️', 感想: '💭',
  支出: '💸', その他: '📌',
  // グッズカテゴリ
  アクスタ: '🧍', 缶バッジ: '📛', ぬい: '🧸',
  写真: '📸', 'CD/DVD': '💿', 本: '📚',
  衣類: '👕',
};

type ExpenseItem = {
  id: string;
  type: 'log' | 'goods';
  date: string;
  title: string;
  category: string;
  oshiId: string;
  amount: number;
  createdAt: string;
};

export default function BudgetTab() {
  const { logs, oshis, goods = [], selectedOshi, selectedOshiId, selectOshi } = useOshiContext();
  // 1. 支出データを統合
  const expenses = useMemo(() => {
    const items: ExpenseItem[] = [];

    // ログ由来の支出
    logs.forEach((log) => {
      if (selectedOshiId && log.oshiId !== selectedOshiId) return;
      if (log.amount != null && log.amount > 0) {
        items.push({
          id: `log_${log.id}`,
          type: 'log',
          date: log.date,
          title: log.title,
          category: log.category,
          oshiId: log.oshiId,
          amount: log.amount,
          createdAt: log.createdAt,
        });
      }
    });

    // グッズ由来の支出
    goods.forEach((g) => {
      if (selectedOshiId && g.oshiId !== selectedOshiId) return;
      if (g.price != null && g.price > 0) {
        items.push({
          id: `goods_${g.id}`,
          type: 'goods',
          date: g.purchaseDate,
          title: g.name,
          category: g.category,
          oshiId: g.oshiId,
          amount: g.price,
          createdAt: g.createdAt,
        });
      }
    });

    return items;
  }, [logs, goods, selectedOshiId]);

  // 2. 集計
  const thisMonthPrefix = getTodayString().substring(0, 7); // YYYY-MM
  
  let totalAmount = 0;
  let thisMonthAmount = 0;
  let logTotal = 0;
  let goodsTotal = 0;
  const breakdown: Record<string, number> = {};

  expenses.forEach((item) => {
    totalAmount += item.amount;
    
    if (item.date.startsWith(thisMonthPrefix)) {
      thisMonthAmount += item.amount;
    }

    if (item.type === 'log') {
      logTotal += item.amount;
    } else {
      goodsTotal += item.amount;
    }

    breakdown[item.category] = (breakdown[item.category] ?? 0) + item.amount;
  });

  const breakdownEntries = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);

  // 3. リスト表示用（新しい順、最大10件）
  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => {
        if (a.date < b.date) return 1;
        if (a.date > b.date) return -1;
        // 日付が同じなら登録順
        if (a.createdAt < b.createdAt) return 1;
        if (a.createdAt > b.createdAt) return -1;
        return 0;
      })
      .slice(0, 10);
  }, [expenses]);

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
        <View style={{ marginBottom: 16 }}>
          <OshiSelectorTabs
            oshis={oshis}
            selectedOshiId={selectedOshiId}
            onSelect={selectOshi}
          />
        </View>

            {/* ── 1. サマリーカード ── */}
        <View style={styles.summaryGrid}>
          {/* 今月の支出 */}
          <View style={[styles.summaryCard, styles.summaryCardMain]}>
            <Text style={styles.summaryLabelMain}>今月の支出</Text>
            <Text style={styles.summaryAmountMain}>{formatAmount(thisMonthAmount)}</Text>
          </View>
          
          {/* 全期間の支出 */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>全期間の支出</Text>
            <Text style={styles.summaryAmount}>{formatAmount(totalAmount)}</Text>
          </View>

          <View style={styles.summaryRow}>
            {/* ログ支出 */}
            <View style={[styles.summaryCard, styles.summaryCardHalf]}>
              <Text style={styles.summaryLabel}>推し活ログ</Text>
              <Text style={styles.summaryAmountSmall}>{formatAmount(logTotal)}</Text>
            </View>
            
            {/* グッズ支出 */}
            <View style={[styles.summaryCard, styles.summaryCardHalf]}>
              <Text style={styles.summaryLabel}>グッズ</Text>
              <Text style={styles.summaryAmountSmall}>{formatAmount(goodsTotal)}</Text>
            </View>
          </View>
        </View>

        {expenses.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>💸</Text>
            <Text style={styles.emptyTitle}>まだ支出記録がありません</Text>
            <Text style={styles.emptyDesc}>
              推し活ログやグッズを登録すると、{'\n'}ここに集計されます。
            </Text>
          </View>
        ) : (
          <>
            {/* ── 2. カテゴリ別支出 ── */}
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
                      <View style={[styles.breakdownDot, { backgroundColor: catStyle.text || COLORS.primary }]} />
                      <Text style={styles.breakdownIcon}>{CAT_ICONS[cat] ?? '📌'}</Text>
                      <Text style={styles.breakdownCat}>{cat}</Text>
                    </View>
                    <View style={styles.breakdownRight}>
                      <Text style={styles.breakdownRatio}>{Math.round(ratio * 100)}%</Text>
                      <Text style={styles.breakdownAmount}>{formatAmount(amount)}</Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* ── 3. 最近の支出一覧 ── */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionEmoji}>📋</Text>
              <Text style={styles.sectionTitle}>最近の支出</Text>
            </View>
            {recentExpenses.map((item) => {
              const catStyle = COLORS.cat[item.category] ?? COLORS.cat['その他'];
              return (
                <View key={item.id} style={styles.logRow}>
                  <View style={styles.logLeft}>
                    <Text style={styles.logDate}>{formatDateShort(item.date)}</Text>
                    <Text style={styles.logTitle} numberOfLines={1}>{item.title}</Text>
                    <View style={styles.logMeta}>
                      <Text style={styles.logOshi} numberOfLines={1}>💕 {getOshiName(item.oshiId)}</Text>
                      <View
                        style={[
                          styles.logCatBadge,
                          {
                            backgroundColor: catStyle.bg || COLORS.primaryLight,
                            borderColor: catStyle.border || COLORS.primary,
                          },
                        ]}
                      >
                        <Text style={[styles.logCatText, { color: catStyle.text || COLORS.primaryDark }]}>
                          {CAT_ICONS[item.category]}{item.category}
                        </Text>
                      </View>
                      <View style={styles.typeBadge}>
                        <Text style={styles.typeText}>{item.type === 'log' ? 'ログ' : 'グッズ'}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.logAmount}>-{formatAmount(item.amount)}</Text>
                </View>
              );
            })}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },

  // ページヘッダー
  pageHeader: {
    backgroundColor: COLORS.headerBg,
    paddingTop: 24, paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    overflow: 'hidden', marginBottom: 16,
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

  body: { paddingHorizontal: 16 },

  // ── サマリーカード ──
  summaryGrid: {
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    padding: 16,
    ...SHADOW.card,
    justifyContent: 'center',
  },
  summaryCardMain: {
    paddingVertical: 24,
    alignItems: 'center',
    borderTopWidth: 4,
    borderTopColor: COLORS.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCardHalf: {
    flex: 1,
  },
  summaryLabelMain: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  summaryAmountMain: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.primaryDark,
    letterSpacing: -1,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.accentDark,
  },
  summaryAmountSmall: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },

  // ── セクションヘッダー ──
  sectionHeaderRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 6, marginBottom: 12, marginTop: 8,
  },
  sectionEmoji: { fontSize: 16 },
  sectionTitle: {
    fontSize: 15, fontWeight: '800',
    color: COLORS.accentDark, flex: 1,
  },

  // ── カテゴリ別内訳カード ──
  breakdownCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    paddingHorizontal: 16, marginBottom: 24,
    ...SHADOW.card,
  },
  breakdownRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
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
    fontSize: 15, fontWeight: '700', color: COLORS.text,
    minWidth: 70, textAlign: 'right',
  },

  // ── 支出リスト ──
  logRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.cardSm,
    paddingVertical: 14, paddingHorizontal: 16,
    marginBottom: 10, ...SHADOW.card,
  },
  logLeft: { flex: 1, marginRight: 12 },
  logDate: {
    fontSize: 11, color: COLORS.textTertiary,
    fontWeight: '600', marginBottom: 4,
  },
  logTitle: {
    fontSize: 15, fontWeight: '700',
    color: COLORS.text, marginBottom: 6,
  },
  logMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logOshi: { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
  logCatBadge: {
    paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: RADIUS.chip, borderWidth: 1,
  },
  logCatText: { fontSize: 10, fontWeight: '600' },
  typeBadge: {
    backgroundColor: COLORS.inputBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.chip,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  logAmount: {
    fontSize: 16, fontWeight: '800', color: '#D94949',
  },

  // ── 空状態 ──
  empty: {
    backgroundColor: COLORS.cardBg, borderRadius: RADIUS.card,
    paddingVertical: 40, alignItems: 'center', ...SHADOW.card,
    borderWidth: 1.5, borderColor: COLORS.border, borderStyle: 'dashed',
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
