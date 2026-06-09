import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Oshi, OshiLog } from '../types/oshi';
import { formatDateShort, formatAmount } from '../utils/format';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';

type Props = {
  logs: OshiLog[];
  oshis: Oshi[];
};

export default function GoodsTab({ logs, oshis }: Props) {
  const goodsLogs = logs.filter((l) => l.category === 'グッズ');
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
        <Text style={styles.pageTitle}>🎁 グッズ管理</Text>
        <Text style={styles.pageSub}>グッズの購入・所持を記録しよう</Text>
      </View>

      <View style={styles.body}>
        {/* Coming Soon カード */}
        <View style={styles.comingSoonCard}>
          <Text style={styles.comingSoonEmoji}>🛍️</Text>
          <Text style={styles.comingSoonTitle}>グッズ管理機能を準備中</Text>
          <Text style={styles.comingSoonDesc}>
            グッズ購入や所持グッズを記録できる機能を{'\n'}追加予定です。お楽しみに！
          </Text>
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonBadgeText}>Coming Soon</Text>
          </View>
        </View>

        {/* グッズカテゴリのログがある場合 */}
        {goodsLogs.length > 0 ? (
          <>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionEmoji}>🛍️</Text>
              <Text style={styles.sectionTitle}>グッズ購入記録</Text>
              <Text style={styles.sectionHint}>{goodsLogs.length}件</Text>
            </View>
            {goodsLogs.map((log) => (
              <View key={log.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardDate}>{formatDateShort(log.date)}</Text>
                  <Text style={styles.cardOshi}>💕 {getOshiName(log.oshiId)}</Text>
                </View>
                <Text style={styles.cardTitle}>{log.title}</Text>
                {log.memo ? (
                  <Text style={styles.cardMemo} numberOfLines={2}>
                    {log.memo}
                  </Text>
                ) : null}
                {log.amount != null && (
                  <View style={styles.amountRow}>
                    <Text style={styles.amountLabel}>購入金額</Text>
                    <Text style={styles.amountValue}>-{formatAmount(log.amount)}</Text>
                  </View>
                )}
              </View>
            ))}
          </>
        ) : (
          <View style={styles.noGoodsCard}>
            <Text style={styles.noGoodsIcon}>🎀</Text>
            <Text style={styles.noGoodsText}>
              グッズカテゴリのログがまだありません{'\n'}
              ホームタブから「グッズ」カテゴリで記録しよう！
            </Text>
          </View>
        )}

        {/* ヒントカード */}
        <View style={styles.hintCard}>
          <Text style={styles.hintIcon}>💡</Text>
          <Text style={styles.hintText}>
            ホームタブでカテゴリを「グッズ」にしてログを記録すると、ここに表示されます。
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
    paddingTop: 24, paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    overflow: 'hidden', marginBottom: 8,
    ...SHADOW.card,
  },
  pageHeaderDeco: {
    position: 'absolute', top: -30, right: -30,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#FFF3E8', opacity: 0.8,
  },
  pageTitle: {
    fontSize: 20, fontWeight: '800',
    color: COLORS.accentDark, letterSpacing: 0.3, marginBottom: 6,
  },
  pageSub: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },

  body: { paddingHorizontal: 16, paddingTop: 8 },

  // Coming Soon カード
  comingSoonCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    padding: 24, alignItems: 'center',
    marginBottom: 20, borderWidth: 2,
    borderColor: COLORS.border, borderStyle: 'dashed',
    ...SHADOW.card,
  },
  comingSoonEmoji: { fontSize: 48, marginBottom: 12 },
  comingSoonTitle: {
    fontSize: 16, fontWeight: '700',
    color: COLORS.accentDark, marginBottom: 8,
  },
  comingSoonDesc: {
    fontSize: 13, color: COLORS.textSecondary,
    textAlign: 'center', lineHeight: 20, marginBottom: 14,
  },
  comingSoonBadge: {
    backgroundColor: COLORS.accentBg,
    borderRadius: RADIUS.chip,
    paddingHorizontal: 16, paddingVertical: 6,
  },
  comingSoonBadgeText: {
    fontSize: 12, fontWeight: '700',
    color: COLORS.accentDark, letterSpacing: 0.5,
  },

  // グッズログ一覧
  sectionHeaderRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 6, marginBottom: 10,
  },
  sectionEmoji: { fontSize: 16 },
  sectionTitle: {
    fontSize: 16, fontWeight: '700',
    color: COLORS.accentDark, flex: 1,
  },
  sectionHint: { fontSize: 12, color: COLORS.textTertiary },

  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.cardSm,
    padding: 14, marginBottom: 10,
    borderLeftWidth: 4, borderLeftColor: '#D98C49',
    ...SHADOW.card,
  },
  cardTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 6,
  },
  cardDate: { fontSize: 11, color: COLORS.textTertiary, fontWeight: '600' },
  cardOshi: { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
  cardTitle: {
    fontSize: 15, fontWeight: '700',
    color: COLORS.text, marginBottom: 4,
  },
  cardMemo: {
    fontSize: 12, color: COLORS.textSecondary,
    lineHeight: 18, marginBottom: 4,
  },
  amountRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingTop: 8,
    borderTopWidth: 1, borderTopColor: COLORS.divider,
    marginTop: 4,
  },
  amountLabel: { fontSize: 12, color: COLORS.textTertiary },
  amountValue: { fontSize: 14, fontWeight: '700', color: '#D94949' },

  // グッズログなし
  noGoodsCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    padding: 24, alignItems: 'center', marginBottom: 14,
    ...SHADOW.card,
  },
  noGoodsIcon: { fontSize: 36, marginBottom: 10 },
  noGoodsText: {
    fontSize: 13, color: COLORS.textSecondary,
    textAlign: 'center', lineHeight: 20,
  },

  // ヒントカード
  hintCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: 8, backgroundColor: COLORS.accentBg,
    borderRadius: RADIUS.cardSm, padding: 12,
    borderWidth: 1, borderColor: COLORS.accentLight,
  },
  hintIcon: { fontSize: 16 },
  hintText: {
    fontSize: 12, color: COLORS.textSecondary,
    lineHeight: 18, flex: 1,
  },
});
