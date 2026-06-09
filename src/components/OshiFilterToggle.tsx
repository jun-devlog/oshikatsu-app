import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Oshi } from '../types/oshi';
import { COLORS, RADIUS } from '../styles/theme';

type Props = {
  oshis: Oshi[];
  selectedOshiId: string | null;
  onSelect: (id: string | null) => void;
};

/**
 * 推し別フィルタ切り替え / 選択用の横スクロールタブ
 * 「すべて」と「登録済みの全推し」を並べる
 */
export default function OshiSelectorTabs({ oshis, selectedOshiId, onSelect }: Props) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={[styles.chip, selectedOshiId === null && styles.chipActive]}
          onPress={() => onSelect(null)}
          activeOpacity={0.7}
        >
          <Text style={[styles.chipText, selectedOshiId === null && styles.chipTextActive]}>
            すべて
          </Text>
        </TouchableOpacity>
        
        {oshis.map((oshi) => (
          <TouchableOpacity
            key={oshi.id}
            style={[styles.chip, selectedOshiId === oshi.id && styles.chipActive]}
            onPress={() => onSelect(oshi.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, selectedOshiId === oshi.id && styles.chipTextActive]}>
              💕 {oshi.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // コンテナスタイル
  },
  scrollContent: {
    flexDirection: 'row',
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.chip,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: 3,
    gap: 4,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.chip - 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
});
