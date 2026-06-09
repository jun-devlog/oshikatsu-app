import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Oshi } from '../types/oshi';
import { generateId } from '../utils/format';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';

type Props = {
  onAdd: (oshi: Oshi) => void;
};

export default function OshiForm({ onAdd }: Props) {
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('');

  const handleAdd = () => {
    if (!name.trim()) {
      Alert.alert('入力エラー', '推しの名前を入力してください 💕');
      return;
    }
    const oshi: Oshi = {
      id: generateId(),
      name: name.trim(),
      genre: genre.trim(),
      createdAt: new Date().toISOString(),
    };
    onAdd(oshi);
    setName('');
    setGenre('');
  };

  return (
    <View style={styles.card}>
      {/* カードヘッダー */}
      <View style={styles.cardHeader}>
        <View style={styles.headerIconWrap}>
          <Text style={styles.headerIcon}>✨</Text>
        </View>
        <View>
          <Text style={styles.cardTitle}>推しを登録する</Text>
          <Text style={styles.cardSubtitle}>あなたの推しを追加しよう</Text>
        </View>
      </View>

      {/* 名前入力 */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>推しの名前 <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="例：田中くん、花ちゃん"
          placeholderTextColor={COLORS.placeholder}
          value={name}
          onChangeText={setName}
          returnKeyType="next"
        />
      </View>

      {/* ジャンル入力 */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>ジャンル</Text>
        <TextInput
          style={styles.input}
          placeholder="例：アイドル、Vtuber、2.5次元俳優"
          placeholderTextColor={COLORS.placeholder}
          value={genre}
          onChangeText={setGenre}
          returnKeyType="done"
          onSubmitEditing={handleAdd}
        />
      </View>

      {/* 登録ボタン */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleAdd}
        activeOpacity={0.82}
      >
        <Text style={styles.buttonIcon}>＋</Text>
        <Text style={styles.buttonText}>登録する</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    padding: 20,
    ...SHADOW.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  headerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.circle,
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.accentDark,
    letterSpacing: 0.2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: 1,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 7,
    letterSpacing: 0.2,
  },
  required: {
    color: COLORS.primary,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.input,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: COLORS.inputBg,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.button,
    paddingVertical: 14,
    marginTop: 2,
    gap: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
