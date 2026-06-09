import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, RADIUS } from '../styles/theme';

export type TabKey = 'home' | 'calendar' | 'goods' | 'budget' | 'mypage';

type Props = {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
};

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'home',     label: 'ホーム',     icon: '🏠' },
  { key: 'calendar', label: 'カレンダー', icon: '📅' },
  { key: 'goods',    label: 'グッズ',     icon: '🎁' },
  { key: 'budget',   label: '収支',       icon: '💰' },
  { key: 'mypage',   label: 'マイページ', icon: '👤' },
];

/** 下部ナビゲーション（useStateでタブ切り替え） */
export default function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
              <Text style={[styles.icon, isActive && styles.iconActive]}>{tab.icon}</Text>
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.navBg,
    borderTopWidth: 1,
    borderTopColor: COLORS.navBorder,
    paddingTop: 6,
    paddingBottom: 10,
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 2,
    gap: 2,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.circle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: COLORS.primaryBg,
  },
  icon: { fontSize: 18 },
  iconActive: {},
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.navInactive,
  },
  labelActive: {
    color: COLORS.navActive,
    fontWeight: '700',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.navActive,
    marginTop: 1,
  },
});
