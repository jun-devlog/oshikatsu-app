import React, { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Oshi, OshiLog, OshiGoods } from '../types/oshi';
import OshiForm from '../components/OshiForm';
import OshiList from '../components/OshiList';
import OshiLogForm from '../components/OshiLogForm';
import OshiLogList from '../components/OshiLogList';
import SectionHeader from '../components/SectionHeader';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';
import { formatAmount } from '../utils/format';

type Props = {
  oshis: Oshi[];
  logs: OshiLog[];
  goods?: OshiGoods[];
  selectedOshi: Oshi | null;
  selectedOshiId: string | null;
  onAddOshi: (oshi: Oshi) => void;
  onDeleteOshi: (id: string) => void;
  onSelectOshi: (id: string) => void;
  onAddLog: (log: OshiLog) => void;
  onDeleteLog: (id: string) => void;
};

// ランダムグリーティング（マウント時に1度だけ決定）
const GREETINGS = [
  '今日も推しに会えて幸せ！',
  '推し活の記録、続けてえらい！',
  '思い出を残すと、もっと楽しくなる 🌸',
  '推しの魅力を日記に刻もう',
  'あなたの推し活を応援しています！',
];
const GREETING_MSG = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];

export default function HomeTab({
  oshis,
  logs,
  goods = [],
  selectedOshi,
  selectedOshiId,
  onAddOshi,
  onDeleteOshi,
  onSelectOshi,
  onAddLog,
  onDeleteLog,
}: Props) {
  const goodsList = goods ?? [];

  // フィルタ適用（選択中の推しがいれば絞り込む）
  const filteredLogs = useMemo(() => {
    if (selectedOshiId) {
      return logs.filter((l) => l.oshiId === selectedOshiId);
    }
    return logs;
  }, [logs, selectedOshiId]);

  const filteredGoods = useMemo(() => {
    if (selectedOshiId) {
      return goodsList.filter((g) => g.oshiId === selectedOshiId);
    }
    return goodsList;
  }, [goodsList, selectedOshiId]);

  const logTotal = filteredLogs
    .filter((l) => l.amount != null && l.amount > 0)
    .reduce((sum, l) => sum + (l.amount ?? 0), 0);
  const goodsTotal = filteredGoods
    .filter((g) => g.price != null && g.price > 0)
    .reduce((sum, g) => sum + (g.price ?? 0), 0);
  const totalAmount = logTotal + goodsTotal;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* ── ヘッダー ── */}
      <View style={styles.header}>
        <View style={styles.decoTopRight} />
        <View style={styles.decoBottomLeft} />

        {/* アプリ名 */}
        <View style={styles.headerTopRow}>
          <View>
            <Text style={styles.appName}>推しログ</Text>
            <Text style={styles.appNameSub}>Oshi Katsu Diary</Text>
          </View>
          <View style={styles.heartBadge}>
            <Text style={styles.heartBadgeText}>💕</Text>
          </View>
        </View>

        {/* グリーティングカード */}
        <View style={styles.greetCard}>
          <View style={styles.greetDeco} />
          <Text style={styles.greetText}>✨ {GREETING_MSG}</Text>
          <Text style={styles.greetSub}>推し活の思い出・イベント・支出を記録しよう</Text>
        </View>

        {/* 今月のサマリー */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryVal}>{oshis.length}<Text style={styles.summaryUnit}>人</Text></Text>
            <Text style={styles.summaryLabel}>推し</Text>
          </View>
          <View style={styles.summaryDiv} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryVal}>{filteredLogs.length}<Text style={styles.summaryUnit}>件</Text></Text>
            <Text style={styles.summaryLabel}>推し活記録</Text>
          </View>
          <View style={styles.summaryDiv} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryVal, styles.summaryValAmount]} numberOfLines={1}>
              {formatAmount(totalAmount)}
            </Text>
            <Text style={styles.summaryLabel}>累計支出</Text>
          </View>
        </View>
      </View>

      {/* ── ボディ ── */}
      <View style={styles.body}>
        <SectionHeader emoji="✨" title="推しを登録する" />
        <OshiForm onAdd={onAddOshi} />

        <SectionHeader
          emoji="🌸"
          title="推し一覧"
          hint={oshis.length > 0 ? 'タップして選択' : undefined}
        />
        <OshiList
          oshis={oshis}
          selectedOshiId={selectedOshiId}
          onSelect={onSelectOshi}
          onDelete={onDeleteOshi}
        />

        <SectionHeader emoji="📝" title="推し活を記録する" />
        <OshiLogForm selectedOshi={selectedOshi} onAdd={onAddLog} />

        <SectionHeader
          emoji="📖"
          title="推し活ログ"
          hint={filteredLogs.length > 0 ? `${filteredLogs.length}件` : undefined}
        />

        <OshiLogList logs={filteredLogs} oshis={oshis} onDelete={onDeleteLog} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>推しログ — 推し活をもっと楽しく 💫</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },

  // ヘッダー
  header: {
    backgroundColor: COLORS.headerBg,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    marginBottom: 4,
    ...SHADOW.cardStrong,
  },
  decoTopRight: {
    position: 'absolute', top: -40, right: -40,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: COLORS.primaryBg, opacity: 0.9,
  },
  decoBottomLeft: {
    position: 'absolute', bottom: -30, left: -30,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: COLORS.accentBg, opacity: 0.8,
  },
  headerTopRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 14,
  },
  appName: {
    fontSize: 24, fontWeight: '800',
    color: COLORS.accentDark, letterSpacing: 0.5,
  },
  appNameSub: {
    fontSize: 11, color: COLORS.textTertiary,
    letterSpacing: 0.8, marginTop: 2,
  },
  heartBadge: {
    width: 38, height: 38, borderRadius: RADIUS.circle,
    backgroundColor: COLORS.primaryBg, alignItems: 'center',
    justifyContent: 'center', borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
  },
  heartBadgeText: { fontSize: 18 },

  // グリーティング
  greetCard: {
    backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.cardSm,
    padding: 14, marginBottom: 12, borderWidth: 1,
    borderColor: COLORS.primaryLight, overflow: 'hidden',
  },
  greetDeco: {
    position: 'absolute', top: -20, right: -20,
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.primaryLight, opacity: 0.5,
  },
  greetText: {
    fontSize: 15, fontWeight: '700',
    color: COLORS.primaryDark, marginBottom: 4,
  },
  greetSub: {
    fontSize: 12, color: COLORS.textSecondary, lineHeight: 18,
  },

  // サマリー
  summaryRow: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderRadius: RADIUS.cardSm, paddingVertical: 12,
    paddingHorizontal: 14, borderWidth: 1, borderColor: COLORS.border,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryVal: {
    fontSize: 18, fontWeight: '800',
    color: COLORS.accentDark, letterSpacing: -0.3,
  },
  summaryValAmount: { fontSize: 14, color: COLORS.primaryDark },
  summaryUnit: { fontSize: 11, fontWeight: '600' },
  summaryLabel: {
    fontSize: 10, color: COLORS.textTertiary,
    fontWeight: '500', marginTop: 3,
  },
  summaryDiv: {
    width: 1, height: 32, backgroundColor: COLORS.border, alignSelf: 'center',
  },

  // ボディ
  body: { paddingHorizontal: 16, paddingTop: 4 },

  // フィルタ
  filterWrap: { marginBottom: 12 },
  filterHint: {
    alignItems: 'center', paddingVertical: 30,
    backgroundColor: COLORS.cardBg, borderRadius: RADIUS.card,
    borderWidth: 1.5, borderColor: COLORS.border, borderStyle: 'dashed',
  },
  filterHintEmoji: { fontSize: 32, marginBottom: 8 },
  filterHintText: {
    fontSize: 13, color: COLORS.textTertiary, textAlign: 'center', lineHeight: 20,
  },

  footer: { alignItems: 'center', paddingVertical: 24 },
  footerText: {
    fontSize: 11, color: COLORS.textTertiary,
    textAlign: 'center', letterSpacing: 0.2,
  },
});
