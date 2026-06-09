import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { OshiGoods, Oshi, GOODS_CATEGORIES, GOODS_STATUSES } from '../types/oshi';
import { generateId, formatAmount } from '../utils/format';
import { getTodayString, formatDisplayDate, isValidDateString } from '../utils/date';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';
import DatePickerModal from '../components/DatePickerModal';

type Props = {
  goods: OshiGoods[];
  oshis: Oshi[];
  selectedOshi: Oshi | null;
  onAddGoods: (item: OshiGoods) => void;
  onDeleteGoods: (id: string) => void;
};

// アイコンマッピング
const CAT_ICONS: Record<string, string> = {
  アクスタ: '🧍',
  缶バッジ: '📛',
  ぬい: '🧸',
  写真: '📸',
  'CD/DVD': '💿',
  本: '📚',
  衣類: '👕',
  その他: '📦',
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  所持中: { bg: '#E9F5E9', text: '#2E7D32' },
  欲しい: { bg: '#FFF0F5', text: '#C2185B' },
  予約済み: { bg: '#E3F2FD', text: '#1565C0' },
  売却予定: { bg: '#FFF8E1', text: '#F57F17' },
};

export default function GoodsTab({
  goods,
  oshis,
  selectedOshi,
  onAddGoods,
  onDeleteGoods,
}: Props) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>(GOODS_CATEGORIES[0]);
  const [status, setStatus] = useState<string>(GOODS_STATUSES[0]);
  const [purchaseDateStr, setPurchaseDateStr] = useState(getTodayString());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [priceStr, setPriceStr] = useState('');
  const [memo, setMemo] = useState('');

  const getOshiName = (oshiId: string) =>
    oshis.find((o) => o.id === oshiId)?.name ?? '不明';

  const handleAdd = () => {
    if (!selectedOshi) {
      Alert.alert('エラー', '推しを選択してください');
      return;
    }
    if (!name.trim()) {
      Alert.alert('入力エラー', 'グッズ名を入力してください');
      return;
    }
    if (!isValidDateString(purchaseDateStr)) {
      Alert.alert('入力エラー', '正しい購入/予定日を選択してください');
      return;
    }

    const price = priceStr ? parseInt(priceStr.replace(/,/g, ''), 10) : undefined;
    if (priceStr && isNaN(price!)) {
      Alert.alert('入力エラー', '金額は数字で入力してください');
      return;
    }

    const newItem: OshiGoods = {
      id: generateId(),
      oshiId: selectedOshi.id,
      name: name.trim(),
      category,
      status,
      purchaseDate: purchaseDateStr,
      price,
      memo: memo.trim(),
      createdAt: new Date().toISOString(),
    };

    onAddGoods(newItem);

    // リセット
    setName('');
    setCategory(GOODS_CATEGORIES[0]);
    setStatus(GOODS_STATUSES[0]);
    setPurchaseDateStr(getTodayString());
    setPriceStr('');
    setMemo('');
  };

  const handleDelete = (id: string, itemName: string) => {
    Alert.alert('削除', `「${itemName}」を削除しますか？`, [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: () => onDeleteGoods(id),
      },
    ]);
  };

  // 新しい順にソート
  const sortedGoods = useMemo(() => {
    return [...goods].sort((a, b) => {
      if (a.createdAt < b.createdAt) return 1;
      if (a.createdAt > b.createdAt) return -1;
      return 0;
    });
  }, [goods]);

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ページヘッダー */}
        <View style={styles.pageHeader}>
          <View style={styles.pageHeaderDeco} />
          <Text style={styles.pageTitle}>🛍️ グッズ管理</Text>
          <Text style={styles.pageSub}>持っているグッズや欲しいものを記録しよう</Text>
        </View>

        <View style={styles.body}>
          {/* 登録フォーム */}
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>✨ 新しいグッズを登録</Text>
            </View>

            {!selectedOshi ? (
              <View style={styles.placeholderCard}>
                <Text style={styles.placeholderText}>
                  ホームタブで推しを選択してから登録してください
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.oshiBanner}>
                  <Text style={styles.oshiBannerIcon}>💕</Text>
                  <Text style={styles.oshiBannerName}>{selectedOshi.name}</Text>
                </View>

                {/* グッズ名 */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>🏷️ グッズ名 <Text style={styles.required}>*</Text></Text>
                  <TextInput
                    style={styles.input}
                    placeholder="例：アクリルスタンド 第2弾"
                    placeholderTextColor={COLORS.placeholder}
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                {/* カテゴリ */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>📦 カテゴリ</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                    {GOODS_CATEGORIES.map((cat) => {
                      const isActive = category === cat;
                      return (
                        <TouchableOpacity
                          key={cat}
                          style={[styles.chip, isActive && styles.chipActive]}
                          onPress={() => setCategory(cat)}
                        >
                          <Text style={styles.chipIcon}>{CAT_ICONS[cat] ?? '📌'}</Text>
                          <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{cat}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* ステータス */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>📝 ステータス</Text>
                  <View style={styles.statusRow}>
                    {GOODS_STATUSES.map((stat) => {
                      const isActive = status === stat;
                      const statColor = STATUS_COLORS[stat] || { bg: '#eee', text: '#333' };
                      return (
                        <TouchableOpacity
                          key={stat}
                          style={[
                            styles.statusChip,
                            isActive && { backgroundColor: statColor.bg, borderColor: statColor.text, borderWidth: 1.5 },
                          ]}
                          onPress={() => setStatus(stat)}
                        >
                          <Text
                            style={[
                              styles.statusText,
                              isActive && { color: statColor.text, fontWeight: '700' },
                            ]}
                          >
                            {stat}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 購入日/予定日 */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>📅 購入・発売日 <Text style={styles.required}>*</Text></Text>
                  <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => setDatePickerVisible(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.dateInputText, !purchaseDateStr && styles.dateInputPlaceholder]}>
                      {purchaseDateStr ? formatDisplayDate(purchaseDateStr) : '日付を選択'}
                    </Text>
                    <Text style={styles.dateInputIcon}>📅</Text>
                  </TouchableOpacity>
                </View>

                {/* 金額 */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>💰 金額（円）</Text>
                  <View style={styles.amountInputWrap}>
                    <Text style={styles.amountPrefix}>¥</Text>
                    <TextInput
                      style={[styles.input, styles.amountInput]}
                      placeholder="0"
                      placeholderTextColor={COLORS.placeholder}
                      value={priceStr}
                      onChangeText={setPriceStr}
                      keyboardType="numeric"
                      returnKeyType="done"
                    />
                  </View>
                </View>

                {/* メモ */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>💬 メモ</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="保管場所や備考..."
                    placeholderTextColor={COLORS.placeholder}
                    value={memo}
                    onChangeText={setMemo}
                    multiline
                    numberOfLines={2}
                    textAlignVertical="top"
                  />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleAdd} activeOpacity={0.8}>
                  <Text style={styles.buttonText}>🛍️ 登録する</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* 一覧 */}
          <Text style={styles.listTitle}>グッズ一覧 ({sortedGoods.length})</Text>
          {sortedGoods.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>📦</Text>
              <Text style={styles.emptyTitle}>グッズがありません</Text>
              <Text style={styles.emptyDesc}>上でグッズを登録するとここに表示されます</Text>
            </View>
          ) : (
            sortedGoods.map((item) => {
              const statColor = STATUS_COLORS[item.status] || { bg: '#eee', text: '#333' };
              return (
                <View key={item.id} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <View style={styles.itemCatWrap}>
                      <Text style={styles.itemCatIcon}>{CAT_ICONS[item.category] ?? '📌'}</Text>
                      <Text style={styles.itemCatText}>{item.category}</Text>
                    </View>
                    <View style={[styles.itemStatusBadge, { backgroundColor: statColor.bg }]}>
                      <Text style={[styles.itemStatusText, { color: statColor.text }]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.itemName}>{item.name}</Text>
                  
                  <View style={styles.itemSubRow}>
                    <Text style={styles.itemOshi}>💕 {getOshiName(item.oshiId)}</Text>
                    <Text style={styles.itemDate}>📅 {formatDisplayDate(item.purchaseDate)}</Text>
                  </View>

                  {item.price != null && (
                    <Text style={styles.itemPrice}>{formatAmount(item.price)}</Text>
                  )}

                  {item.memo ? (
                    <Text style={styles.itemMemo} numberOfLines={2}>
                      {item.memo}
                    </Text>
                  ) : null}

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(item.id, item.name)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.deleteText}>削除</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* カレンダーモーダル */}
      <DatePickerModal
        visible={isDatePickerVisible}
        currentValue={purchaseDateStr}
        onSelect={(date) => setPurchaseDateStr(date)}
        onClose={() => setDatePickerVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },

  // ページヘッダー
  pageHeader: {
    backgroundColor: COLORS.headerBg,
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    ...SHADOW.card,
  },
  pageHeaderDeco: {
    position: 'absolute', top: -30, right: -30,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: COLORS.accentBg, opacity: 0.7,
  },
  pageTitle: {
    fontSize: 20, fontWeight: '800',
    color: COLORS.accentDark, letterSpacing: 0.3, marginBottom: 6,
  },
  pageSub: {
    fontSize: 13, color: COLORS.textSecondary, lineHeight: 18,
  },

  body: { paddingHorizontal: 16 },

  // フォームカード
  formCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    padding: 20,
    marginBottom: 24,
    ...SHADOW.card,
  },
  formHeader: { marginBottom: 16 },
  formTitle: { fontSize: 16, fontWeight: '700', color: COLORS.accentDark },

  placeholderCard: {
    backgroundColor: COLORS.inputBg,
    padding: 20,
    borderRadius: RADIUS.cardSm,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 13,
    color: COLORS.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // 推しバナー
  oshiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryBg,
    borderRadius: RADIUS.cardSm,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    gap: 6,
  },
  oshiBannerIcon: { fontSize: 16 },
  oshiBannerName: { fontSize: 14, fontWeight: '700', color: COLORS.primaryDark },

  // 入力フォーム
  inputGroup: { marginBottom: 14 },
  label: {
    fontSize: 12, fontWeight: '600', color: COLORS.textSecondary,
    marginBottom: 7, letterSpacing: 0.2,
  },
  required: { color: COLORS.primary },
  input: {
    borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: RADIUS.input, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: COLORS.text, backgroundColor: COLORS.inputBg,
  },
  textArea: { minHeight: 70, paddingTop: 12 },
  
  // 日付入力
  dateInput: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.input,
    paddingHorizontal: 14, paddingVertical: 12, backgroundColor: COLORS.inputBg,
  },
  dateInputText: { fontSize: 15, color: COLORS.text, fontWeight: '500' },
  dateInputPlaceholder: { color: COLORS.placeholder },
  dateInputIcon: { fontSize: 16 },

  // 金額入力
  amountInputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.input,
    backgroundColor: COLORS.inputBg, overflow: 'hidden',
  },
  amountPrefix: {
    paddingHorizontal: 12, fontSize: 16, fontWeight: '700', color: COLORS.textSecondary,
  },
  amountInput: {
    flex: 1, borderWidth: 0, borderRadius: 0, paddingLeft: 0,
  },

  // カテゴリチップ
  chipRow: { gap: 8, paddingVertical: 2 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: RADIUS.chip, borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: COLORS.inputBg,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipIcon: { fontSize: 13 },
  chipText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  chipTextActive: { color: '#fff' },

  // ステータスチップ
  statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statusChip: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: RADIUS.chip, borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: COLORS.inputBg,
  },
  statusText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },

  // 登録ボタン
  button: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.button,
    paddingVertical: 15, alignItems: 'center', marginTop: 8,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 10, elevation: 5,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },

  // 一覧エリア
  listTitle: {
    fontSize: 16, fontWeight: '800', color: COLORS.accentDark,
    marginBottom: 12, marginLeft: 4,
  },
  empty: {
    alignItems: 'center', paddingVertical: 40,
    backgroundColor: COLORS.cardBg, borderRadius: RADIUS.card,
    borderWidth: 1.5, borderColor: COLORS.border, borderStyle: 'dashed',
  },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: COLORS.accentDark, marginBottom: 6 },
  emptyDesc: { fontSize: 13, color: COLORS.textTertiary },

  // アイテムカード
  itemCard: {
    backgroundColor: COLORS.cardBg, borderRadius: RADIUS.cardSm,
    padding: 16, marginBottom: 12, ...SHADOW.card,
  },
  itemHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 8,
  },
  itemCatWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  itemCatIcon: { fontSize: 12 },
  itemCatText: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary },
  itemStatusBadge: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12,
  },
  itemStatusText: { fontSize: 10, fontWeight: '700' },
  
  itemName: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  
  itemSubRow: { flexDirection: 'row', gap: 12, marginBottom: 6 },
  itemOshi: { fontSize: 12, fontWeight: '600', color: COLORS.primary },
  itemDate: { fontSize: 12, color: COLORS.textSecondary },

  itemPrice: { fontSize: 14, fontWeight: '700', color: '#D94949', marginTop: 4 },
  
  itemMemo: { fontSize: 12, color: COLORS.textTertiary, marginTop: 8, lineHeight: 18 },

  deleteBtn: {
    position: 'absolute', right: 16, bottom: 16,
  },
  deleteText: { fontSize: 12, fontWeight: '600', color: COLORS.textTertiary },
});
