import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  parseDateString,
  toDateString,
  formatDisplayDate,
  getTodayString,
  generateCalendarWeeks,
} from '../utils/date';
import { COLORS, RADIUS } from '../styles/theme';

type Props = {
  visible: boolean;
  /** 現在の値（YYYY-MM-DD） */
  currentValue: string;
  /** 日付確定時のコールバック（YYYY-MM-DD を渡す） */
  onSelect: (dateStr: string) => void;
  onClose: () => void;
};

const DOW_LABELS = ['日', '月', '火', '水', '木', '金', '土'];
const MONTH_LABELS = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月',
];

/**
 * カレンダーUIによる日付選択モーダル
 * - 外部ライブラリ不使用、自作カレンダー
 * - 保存形式：YYYY-MM-DD
 */
export default function DatePickerModal({
  visible,
  currentValue,
  onSelect,
  onClose,
}: Props) {
  const todayStr = getTodayString();
  const todayDate = parseDateString(todayStr)!;

  // カレンダーが表示している年月
  const [viewYear, setViewYear] = useState(todayDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(todayDate.getMonth());

  // 選択中の日付（YYYY-MM-DD）
  const [selectedStr, setSelectedStr] = useState(currentValue || todayStr);

  // モーダルが開くたびに表示月・選択値を同期
  useEffect(() => {
    if (visible) {
      const parsed = parseDateString(currentValue) ?? todayDate;
      setViewYear(parsed.getFullYear());
      setViewMonth(parsed.getMonth());
      setSelectedStr(currentValue || todayStr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // 前月へ
  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  // 次月へ
  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // 日付タップ
  const handleDayPress = (day: number) => {
    setSelectedStr(toDateString(new Date(viewYear, viewMonth, day)));
  };

  // 今日ボタン
  const handleToday = () => {
    setSelectedStr(todayStr);
    setViewYear(todayDate.getFullYear());
    setViewMonth(todayDate.getMonth());
  };

  // 確定ボタン
  const handleConfirm = () => {
    onSelect(selectedStr);
    onClose();
  };

  // カレンダーグリッド生成
  const weeks = generateCalendarWeeks(viewYear, viewMonth);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {/* 背景タップで閉じる */}
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onClose}
          activeOpacity={1}
        />

        {/* カレンダーシート */}
        <View style={styles.sheet}>
          {/* ── ハンドル ── */}
          <View style={styles.handle} />

          {/* ── シートタイトル ── */}
          <View style={styles.sheetTitleRow}>
            <Text style={styles.sheetTitle}>📅 日付を選択</Text>
            {selectedStr ? (
              <Text style={styles.sheetSelectedDate}>
                {formatDisplayDate(selectedStr)}
              </Text>
            ) : null}
          </View>

          {/* ── 月ナビゲーション ── */}
          <View style={styles.monthNav}>
            <TouchableOpacity
              style={styles.navBtn}
              onPress={goPrevMonth}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.navBtnText}>‹</Text>
            </TouchableOpacity>

            <Text style={styles.monthLabel}>
              {viewYear}年 {MONTH_LABELS[viewMonth]}
            </Text>

            <TouchableOpacity
              style={styles.navBtn}
              onPress={goNextMonth}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.navBtnText}>›</Text>
            </TouchableOpacity>
          </View>

          {/* ── 曜日ヘッダー ── */}
          <View style={styles.dowRow}>
            {DOW_LABELS.map((label, i) => (
              <Text
                key={label}
                style={[
                  styles.dowLabel,
                  i === 0 && styles.dowSun,
                  i === 6 && styles.dowSat,
                ]}
              >
                {label}
              </Text>
            ))}
          </View>

          {/* ── カレンダーグリッド ── */}
          {weeks.map((week, wi) => (
            <View key={wi} style={styles.weekRow}>
              {week.map((day, di) => {
                if (day === null) {
                  return <View key={`e-${di}`} style={styles.dayCell} />;
                }

                const cellStr = toDateString(new Date(viewYear, viewMonth, day));
                const isSelected = cellStr === selectedStr;
                const isToday = cellStr === todayStr;
                const isSun = di === 0;
                const isSat = di === 6;

                return (
                  <TouchableOpacity
                    key={day}
                    style={styles.dayCell}
                    onPress={() => handleDayPress(day)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.dayInner,
                        isToday && !isSelected && styles.dayInnerToday,
                        isSelected && styles.dayInnerSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          isSun && styles.dayTextSun,
                          isSat && styles.dayTextSat,
                          isToday && !isSelected && styles.dayTextToday,
                          isSelected && styles.dayTextSelected,
                        ]}
                      >
                        {day}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          {/* ── アクションボタン ── */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.todayBtn} onPress={handleToday}>
              <Text style={styles.todayBtnText}>今日</Text>
            </TouchableOpacity>

            <View style={styles.actionRight}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                <Text style={styles.confirmBtnText}>決定 ✓</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // ── モーダルオーバーレイ ──
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(42, 32, 64, 0.45)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },

  // ── ボトムシート ──
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 8,
    shadowColor: '#2A1F40',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },

  // ハンドル
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginBottom: 14,
  },

  // シートタイトル
  sheetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.accentDark,
    letterSpacing: 0.2,
  },
  sheetSelectedDate: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // 月ナビゲーション
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.circle,
    backgroundColor: COLORS.accentBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnText: {
    fontSize: 22,
    color: COLORS.accentDark,
    fontWeight: '700',
    lineHeight: 26,
  },
  monthLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.accentDark,
    letterSpacing: 0.3,
  },

  // 曜日ヘッダー
  dowRow: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  dowLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    paddingVertical: 4,
  },
  dowSun: { color: '#D94949' },
  dowSat: { color: '#4A8FD9' },

  // カレンダーグリッド
  weekRow: {
    flexDirection: 'row',
    paddingHorizontal: 2,
  },
  dayCell: {
    flex: 1,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayInnerToday: {
    backgroundColor: COLORS.primaryBg,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  dayInnerSelected: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  dayTextSun: { color: '#D94949' },
  dayTextSat: { color: '#4A8FD9' },
  dayTextToday: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  dayTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },

  // アクションボタン行
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  actionRight: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  todayBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.button,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  todayBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textTertiary,
  },
  confirmBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: RADIUS.button,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
});
