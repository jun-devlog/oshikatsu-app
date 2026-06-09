import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { OshiLog, Oshi, CATEGORIES } from '../types/oshi';
import { generateId } from '../utils/format';
import { getTodayString, formatDisplayDate, isValidDateString } from '../utils/date';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';
import DatePickerModal from './DatePickerModal';
import { auth } from '../config/firebase';

type Props = {
  selectedOshi: Oshi | null;
  onAdd: (log: OshiLog) => void;
};

// カテゴリアイコン
const CATEGORY_ICONS: Record<string, string> = {
  配信: '📺',
  ライブ: '🎤',
  グッズ: '🛍️',
  イベント: '🎪',
  聖地巡礼: '🗺️',
  感想: '💭',
  支出: '💸',
  その他: '📌',
};

export default function OshiLogForm({ selectedOshi, onAdd }: Props) {
  // 日付状態 (YYYY-MM-DD)
  const [dateStr, setDateStr] = useState(getTodayString());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (e) {
      console.warn('Image picker error:', e);
    }
  };

  // 推し未選択時
  if (!selectedOshi) {
    return (
      <View style={styles.placeholderCard}>
        <View style={styles.placeholderIconWrap}>
          <Text style={styles.placeholderIcon}>📖</Text>
        </View>
        <Text style={styles.placeholderTitle}>推しを選択してください</Text>
        <Text style={styles.placeholderDesc}>
          上のリストから推しをタップすると{'\n'}ログを記録できます
        </Text>
      </View>
    );
  }

  const handleAdd = async () => {
    // 日付チェック
    if (!isValidDateString(dateStr)) {
      Alert.alert('入力エラー', '正しい日付を選択してください');
      return;
    }

    if (!title.trim()) {
      Alert.alert('入力エラー', 'タイトルを入力してください');
      return;
    }
    const amount = amountStr
      ? parseInt(amountStr.replace(/,/g, ''), 10)
      : undefined;
    if (amountStr && isNaN(amount!)) {
      Alert.alert('入力エラー', '金額は数字で入力してください');
      return;
    }

    if (isUploading) return;
    setIsUploading(true);

    try {
      const finalImageUri = imageUri; // クラウド保存せずローカルURIをそのまま使う

      const log: OshiLog = {
        id: generateId(),
        oshiId: selectedOshi.id,
        date: dateStr, // YYYY-MM-DD で保存
        category,
        title: title.trim(),
        memo: memo.trim(),
        amount,
        imageUri: finalImageUri || undefined,
        createdAt: new Date().toISOString(),
      };
      
      await onAdd(log);

      // フォームリセット
      setDateStr(getTodayString());
      setCategory(CATEGORIES[0]);
      setTitle('');
      setMemo('');
      setAmountStr('');
      setImageUri(null);
    } catch (e) {
      Alert.alert('エラー', '保存に失敗しました');
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <>
      <View style={styles.card}>
        {/* ヘッダー */}
        <View style={styles.cardHeader}>
          <View style={styles.headerIconWrap}>
            <Text style={styles.headerIcon}>📝</Text>
          </View>
          <View style={styles.headerTextArea}>
            <Text style={styles.cardTitle}>推し活を記録する</Text>
            <Text style={styles.cardSubtitle}>日記・イベント・支出などを残そう</Text>
          </View>
        </View>

        {/* 選択中推しバナー */}
        <View style={styles.oshiBanner}>
          <Text style={styles.oshiBannerIcon}>💕</Text>
          <Text style={styles.oshiBannerName}>{selectedOshi.name}</Text>
          {selectedOshi.genre ? (
            <View style={styles.oshiBannerBadge}>
              <Text style={styles.oshiBannerBadgeText}>{selectedOshi.genre}</Text>
            </View>
          ) : null}
        </View>

        {/* 日付（タップでモーダル起動） */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>📅 日付 <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setDatePickerVisible(true)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.dateInputText,
                !dateStr && styles.dateInputPlaceholder,
              ]}
            >
              {dateStr ? formatDisplayDate(dateStr) : '日付を選択'}
            </Text>
            <Text style={styles.dateInputIcon}>📅</Text>
          </TouchableOpacity>
        </View>

        {/* カテゴリ */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>🏷️ カテゴリ</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {CATEGORIES.map((cat) => {
              const isActive = category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => setCategory(cat)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.chipIcon}>{CATEGORY_ICONS[cat] ?? '📌'}</Text>
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* タイトル */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            ✏️ タイトル <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="例：夏ツアー初日、アクスタ購入"
            placeholderTextColor={COLORS.placeholder}
            value={title}
            onChangeText={setTitle}
            returnKeyType="next"
          />
        </View>

        {/* メモ */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>💬 メモ</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="感想や気持ちを自由に書こう…"
            placeholderTextColor={COLORS.placeholder}
            value={memo}
            onChangeText={setMemo}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* 画像添付 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>📸 画像</Text>
          {imageUri ? (
            <View style={styles.imagePreviewWrap}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
              <TouchableOpacity
                style={styles.imageClearBtn}
                onPress={() => setImageUri(null)}
              >
                <Text style={styles.imageClearText}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.imagePickBtn} onPress={pickImage} activeOpacity={0.7}>
              <Text style={styles.imagePickEmoji}>🖼️</Text>
              <Text style={styles.imagePickText}>画像を選択する</Text>
            </TouchableOpacity>
          )}
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
              value={amountStr}
              onChangeText={setAmountStr}
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>
        </View>

        {/* 保存ボタン */}
        <TouchableOpacity style={[styles.button, isUploading && styles.buttonDisabled]} onPress={handleAdd} activeOpacity={0.82} disabled={isUploading}>
          <Text style={styles.buttonText}>{isUploading ? 'アップロード中...' : '🌸 記録する'}</Text>
        </TouchableOpacity>
      </View>

      {/* カレンダーモーダル */}
      <DatePickerModal
        visible={isDatePickerVisible}
        currentValue={dateStr}
        onSelect={(newDate) => {
          setDateStr(newDate);
          setDatePickerVisible(false);
        }}
        onClose={() => setDatePickerVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  // プレースホルダー
  placeholderCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  placeholderIconWrap: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.circle,
    backgroundColor: COLORS.accentBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  placeholderIcon: { fontSize: 26 },
  placeholderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.accentDark,
    marginBottom: 6,
  },
  placeholderDesc: {
    fontSize: 13,
    color: COLORS.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // フォームカード
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
    marginBottom: 14,
  },
  headerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.circle,
    backgroundColor: COLORS.accentBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: { fontSize: 20 },
  headerTextArea: { flex: 1 },
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
  oshiBannerName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryDark,
    flex: 1,
  },
  oshiBannerBadge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.chip,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  oshiBannerBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },

  // 入力
  inputGroup: { marginBottom: 14 },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 7,
    letterSpacing: 0.2,
  },
  required: { color: COLORS.primary },
  
  // ── 日付入力（変更点） ──
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.input,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: COLORS.inputBg,
  },
  dateInputText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
  dateInputPlaceholder: {
    color: COLORS.placeholder,
  },
  dateInputIcon: {
    fontSize: 16,
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
  textArea: {
    minHeight: 84,
    paddingTop: 12,
  },
  amountInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.input,
    backgroundColor: COLORS.inputBg,
    overflow: 'hidden',
  },
  amountPrefix: {
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  amountInput: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 0,
    paddingLeft: 0,
  },

  // カテゴリチップ
  chipRow: {
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.chip,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBg,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipIcon: { fontSize: 13 },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  chipTextActive: { color: '#fff' },

  // 画像添付
  imagePickBtn: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: RADIUS.button,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  imagePickEmoji: { fontSize: 18 },
  imagePickText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  imagePreviewWrap: {
    position: 'relative',
    borderRadius: RADIUS.button,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imagePreview: {
    width: '100%',
    height: 140,
  },
  imageClearBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageClearText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // 保存ボタン
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.button,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
