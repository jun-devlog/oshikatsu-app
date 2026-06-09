import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../styles/theme';

type Props = {
  emoji: string;
  title: string;
  hint?: string;
};

/** セクション見出しコンポーネント（各タブ共通） */
export default function SectionHeader({ emoji, title, hint }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.left}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 20,
    paddingHorizontal: 2,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emoji: { fontSize: 16 },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.accentDark,
    letterSpacing: 0.2,
  },
  hint: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontWeight: '500',
  },
});
