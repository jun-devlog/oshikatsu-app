import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { OshiLog, Oshi } from '../types/oshi';
import { formatAmount, formatDate } from '../utils/format';
import { COLORS, RADIUS } from '../styles/theme';

type Props = {
  logs: OshiLog[];
  oshis: Oshi[];
  onDelete: (id: string) => void;
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  '配信': { bg: '#E8F4FF', text: '#4A90D9' },
  'ライブ': { bg: '#FFE8F4', text: '#D94A90' },
  'グッズ': { bg: '#FFF3E8', text: '#D9904A' },
  'イベント': { bg: '#F3E8FF', text: '#904AD9' },
  '聖地巡礼': { bg: '#E8FFF3', text: '#4AD990' },
  '感想': { bg: '#FFFDE8', text: '#C9A000' },
  '支出': { bg: '#FFE8E8', text: '#D94A4A' },
  'その他': { bg: '#F0F0F0', text: '#888' },
};

export default function OshiLogList({ logs, oshis, onDelete }: Props) {
  if (logs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🌟</Text>
        <Text style={styles.emptyText}>まだログが記録されていません</Text>
        <Text style={styles.emptySubText}>推しを選択してログを記録しよう！</Text>
      </View>
    );
  }

  const getOshiName = (oshiId: string) =>
    oshis.find((o) => o.id === oshiId)?.name ?? '不明';

  return (
    <View style={styles.container}>
      {logs.map((log) => {
        const catStyle = CATEGORY_COLORS[log.category] ?? CATEGORY_COLORS['その他'];
        return (
          <View key={log.id} style={styles.card}>
            {/* ヘッダー行 */}
            <View style={styles.cardHeader}>
              <View style={styles.headerLeft}>
                <Text style={styles.date}>{formatDate(log.date)}</Text>
                <View style={[styles.categoryBadge, { backgroundColor: catStyle.bg }]}>
                  <Text style={[styles.categoryText, { color: catStyle.text }]}>
                    {log.category}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => onDelete(log.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.deleteBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* 推し名 */}
            <Text style={styles.oshiName}>💕 {getOshiName(log.oshiId)}</Text>

            {/* タイトル */}
            <Text style={styles.title}>{log.title}</Text>

            {/* メモ */}
            {log.memo ? <Text style={styles.memo}>{log.memo}</Text> : null}

            {/* 金額 */}
            {log.amount != null && (
              <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>支出</Text>
                <Text style={styles.amount}>{formatAmount(log.amount)}</Text>
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
    gap: 12,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primaryLight,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    flexWrap: 'wrap',
  },
  date: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  categoryBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
  },
  deleteBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFE0E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  deleteBtnText: {
    fontSize: 10,
    color: '#E05080',
    fontWeight: '700',
  },
  oshiName: {
    fontSize: 12,
    color: COLORS.primaryLight,
    fontWeight: '600',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  memo: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 6,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0E8F8',
  },
  amountLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#D94A90',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 6,
  },
  emptySubText: {
    fontSize: 13,
    color: COLORS.placeholder,
  },
});
