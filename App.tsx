import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useOshiStorage } from './src/hooks/useOshiStorage';
import OshiForm from './src/components/OshiForm';
import OshiList from './src/components/OshiList';
import OshiLogForm from './src/components/OshiLogForm';
import OshiLogList from './src/components/OshiLogList';
import { COLORS } from './src/styles/theme';

export default function App() {
  const {
    oshis,
    logs,
    selectedOshi,
    selectedOshiId,
    loading,
    addOshi,
    deleteOshi,
    selectOshi,
    addLog,
    deleteLog,
  } = useOshiStorage();

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>読み込み中...</Text>
      </SafeAreaView>
    );
  }

  const totalAmount = logs
    .filter((l) => l.amount != null)
    .reduce((sum, l) => sum + (l.amount ?? 0), 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor={COLORS.headerBg} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ─── ヘッダー ─── */}
          <View style={styles.header}>
            <View style={styles.headerDecoLeft} />
            <View style={styles.headerDecoRight} />
            <Text style={styles.appName}>推しログ 💕</Text>
            <Text style={styles.appCatch}>
              推し活の思い出・イベント・支出・感想を{'\n'}日記のように記録しよう
            </Text>
            {/* サマリー */}
            {(oshis.length > 0 || logs.length > 0) && (
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryNum}>{oshis.length}</Text>
                  <Text style={styles.summaryLabel}>推し</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryNum}>{logs.length}</Text>
                  <Text style={styles.summaryLabel}>ログ</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryNum}>
                    {totalAmount > 0 ? `¥${totalAmount.toLocaleString('ja-JP')}` : '¥0'}
                  </Text>
                  <Text style={styles.summaryLabel}>累計支出</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.body}>
            {/* ─── 推し登録エリア ─── */}
            <View style={styles.section}>
              <OshiForm onAdd={addOshi} />
            </View>

            {/* ─── 推し一覧エリア ─── */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeading}>🌸 推し一覧</Text>
                <Text style={styles.sectionHint}>タップして推しを選択</Text>
              </View>
              <OshiList
                oshis={oshis}
                selectedOshiId={selectedOshiId}
                onSelect={(id) => {
                  // 同じ推しをタップしたら選択解除
                  if (id === selectedOshiId) {
                    selectOshi(null);
                  } else {
                    selectOshi(id);
                  }
                }}
                onDelete={deleteOshi}
              />
            </View>

            {/* ─── 推し活ログ登録エリア ─── */}
            <View style={styles.section}>
              <OshiLogForm selectedOshi={selectedOshi} onAdd={addLog} />
            </View>

            {/* ─── 推し活ログ一覧エリア ─── */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeading}>📖 推し活ログ一覧</Text>
                {logs.length > 0 && (
                  <Text style={styles.sectionHint}>{logs.length}件</Text>
                )}
              </View>
              <OshiLogList logs={logs} oshis={oshis} onDelete={deleteLog} />
            </View>

            {/* フッター余白 */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>推しログ — 推し活をもっと楽しく 💫</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  // ── ヘッダー ──
  header: {
    backgroundColor: COLORS.headerBg,
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    overflow: 'hidden',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 8,
  },
  headerDecoLeft: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.gradientStart,
    opacity: 0.8,
  },
  headerDecoRight: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.gradientEnd,
    opacity: 0.7,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  appCatch: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 4,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryNum: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  summaryLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.border,
    marginHorizontal: 8,
  },

  // ── ボディ ──
  body: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  // ── フッター ──
  footer: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.placeholder,
  },
});
