import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useOshiContext } from '../contexts/OshiContext';
import { formatDisplayDate, formatAmount } from '../utils/format';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';
import { StatusBar } from 'expo-status-bar';

const CAT_ICONS: Record<string, string> = {
  アクスタ: '🧍', 缶バッジ: '📛', ぬい: '🧸',
  写真: '📸', 'CD/DVD': '💿', 本: '📚',
  衣類: '👕', その他: '📦',
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  所持中: { bg: '#E9F5E9', text: '#2E7D32' },
  欲しい: { bg: '#FFF0F5', text: '#C2185B' },
  予約済み: { bg: '#E3F2FD', text: '#1565C0' },
  売却予定: { bg: '#FFF8E1', text: '#F57F17' },
};

export default function GoodsDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { goods, oshis, deleteGoods } = useOshiContext();
  
  const { goodsId } = route.params as { goodsId: string };
  
  const item = useMemo(() => goods.find(g => g.id === goodsId), [goods, goodsId]);
  const oshi = useMemo(() => oshis.find(o => o.id === item?.oshiId), [oshis, item]);

  if (!item) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>グッズが見つかりません</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>戻る</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'グッズを削除',
      `「${item.name}」を削除しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除する',
          style: 'destructive',
          onPress: () => {
            deleteGoods(item.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const statColor = STATUS_COLORS[item.status] || { bg: '#eee', text: '#333' };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar style="dark" />
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.catWrap}>
            <Text style={styles.catIcon}>{CAT_ICONS[item.category] ?? '📌'}</Text>
            <Text style={styles.catText}>{item.category}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statColor.bg }]}>
            <Text style={[styles.statusText, { color: statColor.text }]}>{item.status}</Text>
          </View>
        </View>
        
        <Text style={styles.title}>{item.name}</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>推し</Text>
          <Text style={styles.oshiName}>💕 {oshi?.name ?? '不明'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>購入/予定日</Text>
          <Text style={styles.infoValue}>📅 {formatDisplayDate(item.purchaseDate)}</Text>
        </View>

        {item.price != null && item.price > 0 && (
          <View style={styles.amountWrap}>
            <Text style={styles.amountLabel}>価格</Text>
            <Text style={styles.amountValue}>{formatAmount(item.price)}</Text>
          </View>
        )}

        {item.memo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>メモ</Text>
            <Text style={styles.memoText}>{item.memo}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>このグッズを削除する</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: COLORS.textSecondary, marginBottom: 16 },
  backBtn: { padding: 12, backgroundColor: COLORS.primary, borderRadius: RADIUS.button },
  backBtnText: { color: '#fff', fontWeight: 'bold' },
  
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    padding: 20,
    ...SHADOW.card,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  catWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  catIcon: { fontSize: 18 },
  catText: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  statusText: { fontSize: 12, fontWeight: '700' },
  
  title: { fontSize: 22, fontWeight: '800', color: COLORS.accentDark, marginBottom: 20 },
  
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoLabel: { width: 80, fontSize: 13, fontWeight: '600', color: COLORS.textTertiary },
  oshiName: { fontSize: 15, fontWeight: '600', color: COLORS.primary },
  infoValue: { fontSize: 15, fontWeight: '600', color: COLORS.textSecondary },
  
  section: { marginTop: 16, marginBottom: 16, padding: 16, backgroundColor: COLORS.inputBg, borderRadius: RADIUS.cardSm },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textTertiary, marginBottom: 6 },
  memoText: { fontSize: 15, color: COLORS.text, lineHeight: 24 },
  
  amountWrap: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF0F5', padding: 16, borderRadius: RADIUS.cardSm, marginTop: 12, marginBottom: 24 },
  amountLabel: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary },
  amountValue: { fontSize: 20, fontWeight: '800', color: '#D94949' },
  
  deleteButton: { padding: 14, alignItems: 'center', borderRadius: RADIUS.button, borderWidth: 1, borderColor: '#D94949', marginTop: 16 },
  deleteButtonText: { color: '#D94949', fontWeight: 'bold' },
});
