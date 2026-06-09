import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { OshiLog, Oshi } from '../types/oshi';
import { formatAmount, formatDate } from '../utils/format';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';

type Props = {
  logs: OshiLog[];
  oshis: Oshi[];
  onDelete: (id: string) => void;
};

// LP 収支管理画面参考のカテゴリスタイル
const CAT_STYLES = COLORS.cat;

const LEFT_BORDER_COLORS: Record<string, string> = {
  配信: '#4A8FD9',
  ライブ: '#E991A8',
  グッズ: '#D98C49',
  イベント: '#9B8EC4',
  聖地巡礼: '#49D98C',
  感想: '#C9A200',
  支出: '#D94949',
  その他: '#AFA0C8',
};

const CATEGORY_ICONS: Record<string, string> = {
  配信: '📺',
  ライブ: '🎤',
  グッズ: '🛍️',
  イベント: '🎪',
  聖地巡礼: '🗺️',
  感想: '💭',
  支出: '💸',
  その他: '📌',
};

export default function OshiLogList({ logs, oshis, onDelete }: Props) {
  if (logs.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyEmoji}>🌟</Text>
        <Text style={styles.emptyTitle}>まだログがありません</Text>
        <Text style={styles.emptyDesc}>
          最初の推し活を記録してみましょう{'\n'}素敵な思い出を残そう！
        </Text>
      </View>
    );
  }

  const getOshiName = (oshiId: string) =>
    oshis.find((o) => o.id === oshiId)?.name ?? '不明';

  return (
    <View style={styles.container}>
      {logs.map((log) => {
        const catStyle = CAT_STYLES[log.category] ?? CAT_STYLES['その他'];
        const borderColor = LEFT_BORDER_COLORS[log.category] ?? COLORS.accentLight;
        const catIcon = CATEGORY_ICONS[log.category] ?? '📌';

        return (
          <View key={log.id} style={[styles.card, { borderLeftColor: borderColor }]}>
            {/* ── ヘッダー行：日付・カテゴリ・削除 ── */}
            <View style={styles.row}>
              <Text style={styles.date}>{formatDate(log.date)}</Text>
              <View
                style={[
                  styles.catBadge,
                  { backgroundColor: catStyle.bg, borderColor: catStyle.border },
                ]}
              >
                <Text style={styles.catIcon}>{catIcon}</Text>
                <Text style={[styles.catText, { color: catStyle.text }]}>
                  {log.category}
                </Text>
              </View>
              <View style={styles.rowSpacer} />
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => onDelete(log.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.deleteBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* ── 推し名 ── */}
            <Text style={styles.oshiName}>💕 {getOshiName(log.oshiId)}</Text>

            {/* ── タイトル ── */}
            <Text style={styles.title}>{log.title}</Text>

            {/* ── メモ ── */}
            {log.memo ? (
              <Text style={styles.memo} numberOfLines={3}>
                {log.memo}
              </Text>
            ) : null}

            {/* ── 金額（LP 収支管理画面スタイル） ── */}
            {log.amount != null && (
              <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>支出</Text>
                <Text style={styles.amountValue}>
                  -{formatAmount(log.amount)}
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },

  // カード（左ボーダーカラーで LP リストUI を再現）
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    padding: 16,
    borderLeftWidth: 4,
    ...SHADOW.card,
  },

  // 上段行
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  rowSpacer: { flex: 1 },

  date: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textTertiary,
  },

  // カテゴリバッジ
  catBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: RADIUS.chip,
    borderWidth: 1,
  },
  catIcon: { fontSize: 11 },
  catText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // 削除ボタン
  deleteBtn: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.circle,
    backgroundColor: '#FFE0EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    fontSize: 10,
    color: COLORS.primaryDark,
    fontWeight: '800',
  },

  // 推し名
  oshiName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },

  // タイトル
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
    letterSpacing: 0.1,
  },

  // メモ
  memo: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 6,
  },

  // 金額（LP 収支管理参考：右寄せ・赤いマイナス表示）
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  amountLabel: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontWeight: '600',
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#D94949',
  },

  // 空状態
  empty: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    ...SHADOW.card,
  },
  emptyEmoji: {
    fontSize: 44,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.accentDark,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: COLORS.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
