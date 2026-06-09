import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Oshi } from '../types/oshi';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';

type Props = {
  oshis: Oshi[];
  selectedOshiId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
};

const GENRE_EMOJI: Record<string, string> = {
  アイドル:     '🌟',
  Vtuber:       '🎮',
  vtuber:       '🎮',
  '2.5次元':    '🎭',
  俳優:         '🎭',
  声優:         '🎤',
  アニメ:       '✨',
  バンド:       '🎸',
  ゲーム:       '🕹️',
  アーティスト: '🎵',
};

const BG_PALETTE = [
  '#FFE8F4', '#EDE8FF', '#E8F4FF', '#FFF3E8',
  '#E8FFF3', '#FFF8E8', '#FFE8E8', '#E8F0FF',
];

function getEmoji(genre: string): string {
  for (const key of Object.keys(GENRE_EMOJI)) {
    if (genre.includes(key)) return GENRE_EMOJI[key];
  }
  return '💫';
}

function getAvatarBg(id: string): string {
  const idx = id.charCodeAt(id.length - 1) % BG_PALETTE.length;
  return BG_PALETTE[idx];
}

export default function OshiList({ oshis, selectedOshiId, onSelect, onDelete }: Props) {
  if (oshis.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyEmoji}>🌸</Text>
        <Text style={styles.emptyTitle}>推しがまだいません</Text>
        <Text style={styles.emptyDesc}>上のフォームから推しを登録してみよう！</Text>
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
        const avatarBg = getAvatarBg(oshi.id);

        return (
          <TouchableOpacity
            key={oshi.id}
            style={[styles.card, isSelected && styles.cardSelected]}
            onPress={() => onSelect(oshi.id)}
            activeOpacity={0.75}
          >
            {/* 選択中インジケーター */}
            {isSelected && <View style={styles.selectedDot} />}

            {/* アバター */}
            <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
              <Text style={styles.avatarEmoji}>{getEmoji(oshi.genre)}</Text>
            </View>

            {/* 名前 */}
            <Text
              style={[styles.name, isSelected && styles.nameSelected]}
              numberOfLines={2}
            >
              {oshi.name}
            </Text>

            {/* ジャンル */}
            {oshi.genre ? (
              <View style={[styles.genreBadge, isSelected && styles.genreBadgeSelected]}>
                <Text
                  style={[styles.genreText, isSelected && styles.genreTextSelected]}
                  numberOfLines={1}
                >
                  {oshi.genre}
                </Text>
              </View>
            ) : null}

            {/* 削除ボタン */}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => onDelete(oshi.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
    paddingHorizontal: 2,
    paddingVertical: 6,
    gap: 10,
  },

  // カード
  card: {
    width: 100,
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    position: 'relative',
    ...SHADOW.card,
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryBg,
    ...SHADOW.cardStrong,
  },
  selectedDot: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 8,
    height: 8,
    borderRadius: RADIUS.circle,
    backgroundColor: COLORS.primary,
  },

  // アバター
  avatar: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarEmoji: {
    fontSize: 26,
  },

  // テキスト
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 18,
  },
  nameSelected: {
    color: COLORS.primaryDark,
  },

  // ジャンルバッジ
  genreBadge: {
    backgroundColor: COLORS.accentBg,
    borderRadius: RADIUS.chip,
    paddingHorizontal: 8,
    paddingVertical: 3,
    maxWidth: 90,
  },
  genreBadgeSelected: {
    backgroundColor: COLORS.primaryLight,
  },
  genreText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.accent,
    textAlign: 'center',
  },
  genreTextSelected: {
    color: COLORS.primaryDark,
  },

  // 削除ボタン
  deleteBtn: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 20,
    height: 20,
    borderRadius: RADIUS.circle,
    backgroundColor: '#FFE0EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    fontSize: 9,
    color: COLORS.primaryDark,
    fontWeight: '800',
  },

  // 空状態
  empty: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
  },
  emptyEmoji: {
    fontSize: 38,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 12,
    color: COLORS.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
