import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useOshiContext } from '../contexts/OshiContext';
import { formatDate, formatAmount } from '../utils/format';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';
import { StatusBar } from 'expo-status-bar';

export default function LogDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { logs, oshis, deleteLog } = useOshiContext();
  
  const { logId } = route.params as { logId: string };
  
  const log = useMemo(() => logs.find(l => l.id === logId), [logs, logId]);
  const oshi = useMemo(() => oshis.find(o => o.id === log?.oshiId), [oshis, log]);

  if (!log) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>ログが見つかりません</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>戻る</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'ログを削除',
      `「${log.title}」を削除しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除する',
          style: 'destructive',
          onPress: () => {
            deleteLog(log.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar style="dark" />
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.date}>{formatDate(log.date)}</Text>
          <View style={styles.catBadge}>
            <Text style={styles.catText}>{log.category}</Text>
          </View>
        </View>
        
        <Text style={styles.title}>{log.title}</Text>
        <Text style={styles.oshiName}>💕 {oshi?.name ?? '不明'}</Text>
        
        {log.imageUri && (
          <Image source={{ uri: log.imageUri }} style={styles.image} resizeMode="contain" />
        )}

        {log.memo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>メモ</Text>
            <Text style={styles.memoText}>{log.memo}</Text>
          </View>
        )}

        {log.amount != null && log.amount > 0 && (
          <View style={styles.amountWrap}>
            <Text style={styles.amountLabel}>支出</Text>
            <Text style={styles.amountValue}>{formatAmount(log.amount)}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>このログを削除する</Text>
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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  date: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary },
  catBadge: { backgroundColor: COLORS.primaryBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  catText: { fontSize: 12, fontWeight: 'bold', color: COLORS.primaryDark },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.accentDark, marginBottom: 8 },
  oshiName: { fontSize: 15, fontWeight: '600', color: COLORS.primary, marginBottom: 16 },
  image: { width: '100%', height: 300, borderRadius: RADIUS.cardSm, marginBottom: 16, backgroundColor: '#f0f0f0' },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 6 },
  memoText: { fontSize: 15, color: COLORS.text, lineHeight: 24 },
  amountWrap: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF0F5', padding: 16, borderRadius: RADIUS.cardSm, marginBottom: 24 },
  amountLabel: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary },
  amountValue: { fontSize: 20, fontWeight: '800', color: '#D94949' },
  deleteButton: { padding: 14, alignItems: 'center', borderRadius: RADIUS.button, borderWidth: 1, borderColor: '#D94949' },
  deleteButtonText: { color: '#D94949', fontWeight: 'bold' },
});
