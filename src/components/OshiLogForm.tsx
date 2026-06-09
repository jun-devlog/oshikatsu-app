import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { OshiLog, Oshi, CATEGORIES } from '../types/oshi';
import { generateId, todayString } from '../utils/format';
import { COLORS, RADIUS } from '../styles/theme';

type Props = {
  selectedOshi: Oshi | null;
  onAdd: (log: OshiLog) => void;
};

export default function OshiLogForm({ selectedOshi, onAdd }: Props) {
  const [date, setDate] = useState(todayString());
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [amountStr, setAmountStr] = useState('');

  if (!selectedOshi) {
    return (
      <View style={styles.disabledCard}>
        <Text style={styles.disabledIcon}>📝</Text>
        <Text style={styles.disabledText}>推しを選択すると{'\n'}ログを記録できます</Text>
      </View>
    );
  }

  const handleAdd = () => {
    if (!title.trim()) {
      Alert.alert('入力エラー', 'タイトルを入力してください');
      return;
    }
    const amount = amountStr ? parseInt(amountStr.replace(/,/g, ''), 10) : undefined;
    if (amountStr && isNaN(amount!)) {
      Alert.alert('入力エラー', '金額は数字で入力してください');
      return;
    }

    const log: OshiLog = {
      id: generateId(),
      oshiId: selectedOshi.id,
      date,
      category,
      title: title.trim(),
      memo: memo.trim(),
      amount,
      createdAt: new Date().toISOString(),
    };
    onAdd(log);
    setDate(todayString());
    setCategory(CATEGORIES[0]);
    setTitle('');
    setMemo('');
    setAmountStr('');
  };

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>📝 ログを記録する</Text>
      <View style={styles.selectedBanner}>
        <Text style={styles.selectedBannerText}>💕 {selectedOshi.name}</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>日付</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={COLORS.placeholder}
          keyboardType="numbers-and-punctuation"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>カテゴリ</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, category === cat && styles.categoryChipSelected]}
              onPress={() => setCategory(cat)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.categoryChipText, category === cat && styles.categoryChipTextSelected]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>タイトル *</Text>
        <TextInput
          style={styles.input}
          placeholder="例：夏ツアー初日、アクスタ購入"
          placeholderTextColor={COLORS.placeholder}
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>メモ</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="感想・記念・気持ちなど自由に書こう"
          placeholderTextColor={COLORS.placeholder}
          value={memo}
          onChangeText={setMemo}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>金額（円）</Text>
        <TextInput
          style={styles.input}
          placeholder="例：3000"
          placeholderTextColor={COLORS.placeholder}
          value={amountStr}
          onChangeText={setAmountStr}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAdd} activeOpacity={0.8}>
        <Text style={styles.buttonText}>記録する 🌸</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    padding: 20,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  disabledCard: {
    backgroundColor: '#F8F8FC',
    borderRadius: RADIUS.card,
    padding: 28,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E8E0F0',
    borderStyle: 'dashed',
  },
  disabledIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  disabledText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  selectedBanner: {
    backgroundColor: '#FFF0F6',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  selectedBannerText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.input,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: COLORS.inputBg,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 11,
  },
  categoryRow: {
    gap: 8,
    paddingVertical: 2,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBg,
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  categoryChipTextSelected: {
    color: '#fff',
  },
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.button,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
