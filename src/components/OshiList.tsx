import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Oshi } from '../types/oshi';
import { COLORS, RADIUS } from '../styles/theme';

type Props = {
  oshis: Oshi[];
  selectedOshiId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
};

const GENRE_ICONS: Record<string, string> = {
  'アイドル': '🌟',
  'Vtuber': '🎮',
  '2.5次元俳優': '🎭',
  '声優': '🎤',
  'アニメ': '✨',
  'バンド': '🎸',
  'ゲーム': '🕹️',
};

function getGenreIcon(genre: string): string {
  for (const key of Object.keys(GENRE_ICONS)) {
    if (genre.includes(key)) return GENRE_ICONS[key];
  }
  return '💫';
}

export default function OshiList({ oshis, selectedOshiId, onSelect, onDelete }: Props) {
  if (oshis.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🌸</Text>
        <Text style={styles.emptyText}>まだ推しが登録されていません</Text>
        <Text style={styles.emptySubText}>上のフォームから推しを登録しよう！</Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {oshis.map((oshi) => {
        const isSelected = oshi.id === selectedOshiId;
        return (
          <TouchableOpacity
            key={oshi.id}
            style={[styles.card, isSelected && styles.cardSelected]}
            onPress={() => onSelect(oshi.id)}
            activeOpacity={0.8}
          >
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>{getGenreIcon(oshi.genre)}</Text>
            </View>
            <Text style={[styles.name, isSelected && styles.nameSelected]} numberOfLines={2}>
              {oshi.name}
            </Text>
            {oshi.genre ? (
              <Text style={[styles.genre, isSelected && styles.genreSelected]} numberOfLines={1}>
                {oshi.genre}
              </Text>
            ) : null}
            {isSelected && (
              <View style={styles.selectedBadge}>
                <Text style={styles.selectedBadgeText}>選択中 ✓</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => onDelete(oshi.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.deleteBtnText}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    gap: 12,
  },
  card: {
    width: 110,
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    position: 'relative',
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF0F6',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    elevation: 5,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5E6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  nameSelected: {
    color: COLORS.primary,
  },
  genre: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  genreSelected: {
    color: COLORS.primaryLight,
  },
  selectedBadge: {
    marginTop: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  selectedBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  deleteBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFE0E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    fontSize: 9,
    color: '#E05080',
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubText: {
    fontSize: 12,
    color: COLORS.placeholder,
  },
});
