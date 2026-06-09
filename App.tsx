import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useOshiStorage } from './src/hooks/useOshiStorage';
import BottomNav, { TabKey } from './src/components/BottomNav';
import HomeTab from './src/screens/HomeTab';
import CalendarTab from './src/screens/CalendarTab';
import GoodsTab from './src/screens/GoodsTab';
import BudgetTab from './src/screens/BudgetTab';
import MyPageTab from './src/screens/MyPageTab';
import { COLORS } from './src/styles/theme';

export default function App() {
  // ── タブ切り替え状態 ──
  const [activeTab, setActiveTab] = useState<TabKey>('home');

  // ── データ管理（useOshiStorage に全て集約） ──
  const {
    oshis,
    logs,
    goods,
    selectedOshi,
    selectedOshiId,
    loading,
    addOshi,
    deleteOshi,
    selectOshi,
    addLog,
    deleteLog,
    addGoods,
    deleteGoods,
  } = useOshiStorage();

  // 推し選択トグル（同じ推しをタップしたら選択解除）
  const handleSelectOshi = (id: string) => {
    selectOshi(id === selectedOshiId ? null : id);
  };

  // ── ローディング画面 ──
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <View style={styles.loadingInner}>
          <Text style={styles.loadingAppName}>推しログ</Text>
          <Text style={styles.loadingHeart}>💕</Text>
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: 24 }}
          />
          <Text style={styles.loadingText}>読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── アクティブなタブのコンテンツを返す ──
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeTab
            oshis={oshis}
            logs={logs}
            selectedOshi={selectedOshi}
            selectedOshiId={selectedOshiId}
            onAddOshi={addOshi}
            onDeleteOshi={deleteOshi}
            onSelectOshi={handleSelectOshi}
            onAddLog={addLog}
            onDeleteLog={deleteLog}
          />
        );
      case 'calendar':
        return <CalendarTab logs={logs} oshis={oshis} />;
      case 'goods':
        return (
          <GoodsTab
            goods={goods}
            oshis={oshis}
            selectedOshi={selectedOshi}
            onAddGoods={addGoods}
            onDeleteGoods={deleteGoods}
          />
        );
      case 'budget':
        return <BudgetTab logs={logs} oshis={oshis} />;
      case 'mypage':
        return <MyPageTab oshis={oshis} logs={logs} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor={COLORS.headerBg} />

      {/*
        KeyboardAvoidingView でタブコンテンツを包む。
        BottomNav は KAV の外（下部固定）に配置する。
      */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        {renderTabContent()}
      </KeyboardAvoidingView>

      {/* 下部タブナビゲーション（activeTab でハイライト、onTabChange で切り替え） */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },

  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ローディング
  loadingScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingInner: { alignItems: 'center' },
  loadingAppName: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  loadingHeart: { fontSize: 36, marginTop: 4 },
  loadingText: {
    fontSize: 13,
    color: COLORS.textTertiary,
    marginTop: 12,
  },
});
