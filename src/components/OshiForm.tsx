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
import { COLORS, FONTS, RADIUS } from '../styles/theme';

type Props = {
  onAdd: (oshi: Oshi) => void;
};

export default function OshiForm({ onAdd }: Props) {
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('');

  const handleAdd = () => {
    if (!name.trim()) {
      Alert.alert('入力エラー', '推しの名前を入力してください');
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
      <Text style={styles.sectionTitle}>✨ 推しを登録する</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>推しの名前 *</Text>
        <TextInput
          style={styles.input}
          placeholder="例：田中くん、花ちゃん"
          placeholderTextColor={COLORS.placeholder}
          value={name}
          onChangeText={setName}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>ジャンル</Text>
        <TextInput
          style={styles.input}
          placeholder="例：2.5次元俳優、Vtuber、アイドル"
          placeholderTextColor={COLORS.placeholder}
          value={genre}
          onChangeText={setGenre}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleAdd} activeOpacity={0.8}>
        <Text style={styles.buttonText}>登録する 💕</Text>
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
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 16,
    letterSpacing: 0.3,
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
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.button,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: COLORS.primary,
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
