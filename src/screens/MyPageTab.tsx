import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Oshi, OshiLog } from '../types/oshi';
import { formatAmount } from '../utils/format';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';

type Props = {
  oshis: Oshi[];
  logs: OshiLog[];
};

const INFO_ITEMS = [
  { icon: '🔔', label: '通知設定', desc: '推し活のリマインダーを設定（準備中）' },
  { icon: '☁️', label: 'データバックアップ', desc: '端末外への保存機能（準備中）' },
  { icon: '🔑', label: 'ログイン・アカウント', desc: '複数端末での同期機能（準備中）' },
  { icon: '💬', label: 'ヘルプ・お問い合わせ', desc: 'フィードバックをお待ちしています' },
];

export default function MyPageTab({ oshis, logs }: Props) {
  const totalAmount = logs
    .filter((l) => l.amount != null)
    .reduce((sum, l) => sum + (l.amount ?? 0), 0);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ページヘッダー（LP「マイページ」画面参考） */}
      <View style={styles.pageHeader}>
        <View style={styles.decoCircle1} />
        <View style={styles.decoCircle2} />

        {/* アバター */}
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarEmoji}>💕</Text>
        </View>
        <Text style={styles.appName}>推しログ</Text>
        <Text style={styles.appNameEn}>Oshi Katsu Diary</Text>
      </View>

      <View style={styles.body}>
        {/* 統計カード */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{oshis.length}</Text>
            <Text style={styles.statUnit}>人</Text>
            <Text style={styles.statLabel}>登録推し</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{logs.length}</Text>
            <Text style={styles.statUnit}>件</Text>
            <Text style={styles.statLabel}>ログ記録</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.statItem}>
            <Text style={[styles.statVal, styles.statValAmount]}>
              ¥{totalAmount.toLocaleString('ja-JP')}
            </Text>
            <Text style={styles.statLabel}>累計支出</Text>
          </View>
        </View>

        {/* 登録推し一覧 */}
        {oshis.length > 0 && (
          <View style={styles.oshisCard}>
            <Text style={styles.cardTitle}>💕 登録中の推し</Text>
            {oshis.map((oshi, idx) => (
              <View
                key={oshi.id}
                style={[
                  styles.oshiRow,
                  idx < oshis.length - 1 && styles.oshiRowBorder,
                ]}
              >
                <View style={styles.oshiAvatarMini}>
                  <Text style={styles.oshiAvatarMiniText}>💫</Text>
                </View>
                <View style={styles.oshiInfo}>
                  <Text style={styles.oshiName}>{oshi.name}</Text>
                  {oshi.genre ? (
                    <Text style={styles.oshiGenre}>{oshi.genre}</Text>
                  ) : null}
                </View>
                <Text style={styles.oshiLogCount}>
                  {logs.filter((l) => l.oshiId === oshi.id).length}件
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* データ保存について */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <Text style={styles.infoCardIcon}>📱</Text>
            <Text style={styles.infoCardTitle}>データの保存について</Text>
          </View>
          <Text style={styles.infoCardDesc}>
            すべてのデータはこの端末（AsyncStorage）に保存されています。アンインストールするとデータが消えるためご注意ください。
          </Text>
        </View>

        {/* 今後の機能 */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <Text style={styles.infoCardIcon}>🚀</Text>
            <Text style={styles.infoCardTitle}>今後追加予定の機能</Text>
          </View>
          <Text style={styles.infoCardDesc}>
            今後、バックアップ・ログイン機能・グッズ管理などの機能を追加予定です。引き続きご利用をお楽しみに！
          </Text>
        </View>

        {/* メニューリスト */}
        <View style={styles.menuCard}>
          {INFO_ITEMS.map((item, idx) => (
            <View
              key={item.label}
              style={[
                styles.menuRow,
                idx < INFO_ITEMS.length - 1 && styles.menuRowBorder,
              ]}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <View style={styles.menuText}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuDesc}>{item.desc}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>

        {/* バージョン情報 */}
        <View style={styles.versionArea}>
          <Text style={styles.versionText}>推しログ v1.0.0（MVP）</Text>
          <Text style={styles.versionSubText}>Expo + React Native + TypeScript</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 32 },

  // ページヘッダー（LP マイページ画面風：グラデーション背景）
  pageHeader: {
    backgroundColor: COLORS.headerBg,
    paddingTop: 32, paddingBottom: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
    overflow: 'hidden', marginBottom: 8,
    ...SHADOW.cardStrong,
    borderBottomWidth: 3, borderBottomColor: COLORS.primaryLight,
  },
  decoCircle1: {
    position: 'absolute', top: -40, right: -40,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: COLORS.primaryBg, opacity: 0.9,
  },
  decoCircle2: {
    position: 'absolute', bottom: -40, left: -40,
    width: 150, height: 150, borderRadius: 75,
    backgroundColor: COLORS.accentBg, opacity: 0.8,
  },
  avatarWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: COLORS.primaryLight,
    marginBottom: 12, ...SHADOW.card,
  },
  avatarEmoji: { fontSize: 36 },
  appName: {
    fontSize: 22, fontWeight: '800',
    color: COLORS.accentDark, letterSpacing: 0.5, marginBottom: 2,
  },
  appNameEn: {
    fontSize: 11, color: COLORS.textTertiary,
    letterSpacing: 1.2,
  },

  body: { paddingHorizontal: 16, paddingTop: 4 },

  // 統計カード
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    paddingVertical: 18, paddingHorizontal: 14,
    marginBottom: 14, ...SHADOW.card,
    borderTopWidth: 3, borderTopColor: COLORS.primary,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: {
    fontSize: 22, fontWeight: '800',
    color: COLORS.accentDark, letterSpacing: -0.5,
  },
  statValAmount: { fontSize: 16, color: COLORS.primaryDark },
  statUnit: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  statLabel: {
    fontSize: 11, color: COLORS.textTertiary,
    fontWeight: '500', marginTop: 3,
  },
  statDiv: {
    width: 1, backgroundColor: COLORS.border, alignSelf: 'center', height: 36,
  },

  // 推し一覧カード
  oshisCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    padding: 16, marginBottom: 14,
    ...SHADOW.card,
  },
  cardTitle: {
    fontSize: 15, fontWeight: '700',
    color: COLORS.accentDark, marginBottom: 12,
  },
  oshiRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, paddingVertical: 10,
  },
  oshiRowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  oshiAvatarMini: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center', justifyContent: 'center',
  },
  oshiAvatarMiniText: { fontSize: 18 },
  oshiInfo: { flex: 1 },
  oshiName: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  oshiGenre: { fontSize: 12, color: COLORS.textTertiary, marginTop: 1 },
  oshiLogCount: {
    fontSize: 12, fontWeight: '600', color: COLORS.primary,
  },

  // 情報カード
  infoCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    padding: 16, marginBottom: 10,
    ...SHADOW.card,
  },
  infoCardHeader: {
    flexDirection: 'row', alignItems: 'center',
    gap: 8, marginBottom: 8,
  },
  infoCardIcon: { fontSize: 18 },
  infoCardTitle: {
    fontSize: 14, fontWeight: '700', color: COLORS.accentDark,
  },
  infoCardDesc: {
    fontSize: 13, color: COLORS.textSecondary,
    lineHeight: 20,
  },

  // メニューリスト
  menuCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    paddingHorizontal: 16, marginTop: 4, marginBottom: 14,
    ...SHADOW.card,
  },
  menuRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, gap: 12,
  },
  menuRowBorder: {
    borderBottomWidth: 1, borderBottomColor: COLORS.divider,
  },
  menuIcon: { fontSize: 20 },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  menuDesc: { fontSize: 11, color: COLORS.textTertiary, marginTop: 2 },
  menuArrow: { fontSize: 20, color: COLORS.textTertiary },

  // バージョン情報
  versionArea: { alignItems: 'center', paddingVertical: 20 },
  versionText: { fontSize: 12, color: COLORS.textTertiary },
  versionSubText: { fontSize: 11, color: COLORS.placeholder, marginTop: 2 },
});
