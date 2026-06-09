import React, { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { Oshi, OshiLog, OshiGoods } from '../types/oshi';
import { formatAmount } from '../utils/format';
import { getTodayString } from '../utils/date';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';

import { useOshiContext } from '../contexts/OshiContext';

export default function MyPageTab() {
  const { oshis, logs, goods = [] } = useOshiContext();
  const oshiCount = oshis.length;
  const logCount = logs.length;
  const goodsCount = goods.length;

  const { totalAmount, thisMonthAmount } = useMemo(() => {
    const thisMonthPrefix = getTodayString().substring(0, 7);
    let total = 0;
    let thisMonth = 0;

    logs.forEach((l) => {
      if (l.amount && l.amount > 0) {
        total += l.amount;
        if (l.date.startsWith(thisMonthPrefix)) {
          thisMonth += l.amount;
        }
      }
    });

    goods.forEach((g) => {
      if (g.price && g.price > 0) {
        total += g.price;
        if (g.purchaseDate.startsWith(thisMonthPrefix)) {
          thisMonth += g.price;
        }
      }
    });

    return { totalAmount: total, thisMonthAmount: thisMonth };
  }, [logs, goods]);

  const topOshiName = useMemo(() => {
    if (oshis.length === 0) return '推し未登録';
    const counts: Record<string, number> = {};
    
    // ログとグッズの数を推しごとにカウント
    logs.forEach((l) => {
      counts[l.oshiId] = (counts[l.oshiId] || 0) + 1;
    });
    goods.forEach((g) => {
      counts[g.oshiId] = (counts[g.oshiId] || 0) + 1;
    });

    let maxId = '';
    let maxCount = -1;
    Object.entries(counts).forEach(([id, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxId = id;
      }
    });

    // まだ記録がない場合は最初に登録した推しを表示
    if (maxCount === -1 || !maxId) {
       return oshis[0]?.name ?? 'データなし';
    }

    const oshi = oshis.find((o) => o.id === maxId);
    return oshi ? oshi.name : 'データ不明';
  }, [oshis, logs, goods]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ページヘッダー */}
      <View style={styles.pageHeader}>
        <View style={styles.pageHeaderDeco} />
        <Text style={styles.pageTitle}>👤 マイページ</Text>
        <Text style={styles.pageSub}>推し活の各種データやアプリ情報を確認できます</Text>
      </View>

      <View style={styles.body}>
        {/* ── 1. 推し活サマリー ── */}
        <Text style={styles.sectionTitle}>📊 あなたの推し活データ</Text>
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>登録推し数</Text>
              <Text style={styles.statValue}>{oshiCount}<Text style={styles.statUnit}>人</Text></Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>ログ数</Text>
              <Text style={styles.statValue}>{logCount}<Text style={styles.statUnit}>件</Text></Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>グッズ数</Text>
              <Text style={styles.statValue}>{goodsCount}<Text style={styles.statUnit}>個</Text></Text>
            </View>
          </View>

          <View style={styles.statsDividerHorizontal} />

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>今月の支出</Text>
              <Text style={styles.statValueMoney}>{formatAmount(thisMonthAmount)}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>合計支出</Text>
              <Text style={styles.statValueMoney}>{formatAmount(totalAmount)}</Text>
            </View>
          </View>

          <View style={styles.statsDividerHorizontal} />

          <View style={styles.topOshiWrap}>
            <Text style={styles.topOshiLabel}>🏆 一番記録している推し</Text>
            <Text style={styles.topOshiName}>{topOshiName}</Text>
          </View>
        </View>

        {/* ── 2. データ保存についての説明 ── */}
        <Text style={styles.sectionTitle}>💾 データ保存について</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            このアプリのデータ（推しの情報、カレンダーの記録、グッズ情報、画像など）は、<Text style={styles.highlight}>すべてお使いのスマートフォン端末内にのみ保存</Text>されます。
          </Text>
          <Text style={styles.infoText}>
            外部のサーバーには送信されないため、安心してご利用いただけます。
          </Text>
          <Text style={styles.infoAlert}>
            ※ アプリを削除（アンインストール）すると、記録したデータもすべて消去されますのでご注意ください。機種変更時の引き継ぎ機能は現在準備中です。
          </Text>
        </View>

        {/* ── 3. アプリ情報 ── */}
        <Text style={styles.sectionTitle}>📱 アプリ情報</Text>
        <View style={styles.appCard}>
          <View style={styles.appRow}>
            <Text style={styles.appLabel}>アプリ名</Text>
            <Text style={styles.appValue}>推しログ / Oshikatsu</Text>
          </View>
          <View style={styles.appDivider} />
          <View style={styles.appRow}>
            <Text style={styles.appLabel}>バージョン</Text>
            <Text style={styles.appValue}>1.0.0</Text>
          </View>
          <View style={styles.appDivider} />
          <View style={styles.appRow}>
            <Text style={styles.appLabel}>開発</Text>
            <Text style={styles.appValue}>推し活応援プロジェクト</Text>
          </View>
        </View>

        {/* サポートボタンなど（プレースホルダー） */}
        <TouchableOpacity
          style={styles.supportButton}
          onPress={() => Linking.openURL('https://oshikatsu-navy.vercel.app/')}
          activeOpacity={0.8}
        >
          <Text style={styles.supportButtonText}>🌐 公式サイトを見る</Text>
        </TouchableOpacity>
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
    overflow: 'hidden', marginBottom: 20,
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

  sectionTitle: {
    fontSize: 16, fontWeight: '800', color: COLORS.accentDark,
    marginBottom: 10, marginLeft: 4, marginTop: 8,
  },

  // ── 統計カード ──
  statsCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    padding: 16,
    marginBottom: 24,
    ...SHADOW.card,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textTertiary,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.accentDark,
  },
  statValueMoney: {
    fontSize: 18,
    fontWeight: '800',
    color: '#D94949',
  },
  statUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginLeft: 2,
  },
  statDivider: {
    width: 1,
    height: '70%',
    backgroundColor: COLORS.divider,
  },
  statsDividerHorizontal: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 12,
  },
  topOshiWrap: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: COLORS.primaryBg,
    borderRadius: RADIUS.cardSm,
  },
  topOshiLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  topOshiName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },

  // ── 情報カード ──
  infoCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    padding: 16,
    marginBottom: 24,
    ...SHADOW.card,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 8,
  },
  highlight: {
    fontWeight: '700',
    color: COLORS.accentDark,
  },
  infoAlert: {
    fontSize: 12,
    color: '#D94949',
    lineHeight: 18,
    marginTop: 8,
    backgroundColor: '#FFF0F5',
    padding: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },

  // ── アプリ情報カード ──
  appCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    paddingHorizontal: 16,
    marginBottom: 24,
    ...SHADOW.card,
  },
  appRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  appDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
  },
  appLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  appValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },

  // サポートボタン
  supportButton: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.button,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  supportButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '700',
  },
});
