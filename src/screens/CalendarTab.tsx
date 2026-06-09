import React, { useState, useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Oshi, OshiLog } from '../types/oshi';
import { formatAmount } from '../utils/format';
import { getTodayString, parseDateString, toDateString, generateCalendarWeeks } from '../utils/date';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';

import OshiSelectorTabs from '../components/OshiFilterToggle';
import { useOshiContext } from '../contexts/OshiContext';

const DOW_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

// イベント用カラーマッピング (LP画像のピンク・紫・ミント系を参考)
const EVENT_COLORS: Record<string, string> = {
  配信: '#9B8EC4', // 紫
  ライブ: '#E991A8', // ピンク
  グッズ: '#91E9C5', // ミント
  イベント: '#E9A891', // オレンジ系ピンク
  聖地巡礼: '#91BCE9', // 水色
  感想: '#E9D691', // 黄色
  支出: '#D94949', // 赤
  その他: '#AFA0C8', // 薄紫
};

export default function CalendarTab() {
  const { logs, oshis, selectedOshiId, selectOshi } = useOshiContext();
  const todayStr = getTodayString();
  const todayDate = parseDateString(todayStr)!;

  const [viewYear, setViewYear] = useState(todayDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(todayDate.getMonth());
  
  // 選択中の日付
  const [selectedStr, setSelectedStr] = useState(todayStr);

  const getOshiName = (oshiId: string) =>
    oshis.find((o) => o.id === oshiId)?.name ?? '不明';

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

  // フィルタ適用
  const filteredLogs = useMemo(() => {
    if (selectedOshiId) {
      return logs.filter((l) => l.oshiId === selectedOshiId);
    }
    return logs;
  }, [logs, selectedOshiId]);

  // カレンダーマトリックス生成
  const weeks = useMemo(() => {
    return generateCalendarWeeks(viewYear, viewMonth);
  }, [viewYear, viewMonth]);

  // 選択日のログ一覧
  const selectedLogs = useMemo(() => {
    return filteredLogs.filter((l) => l.date === selectedStr);
  }, [filteredLogs, selectedStr]);

  // その日にイベント(ログ)があるかどうか
  const getEventForDate = (dateStr: string) => {
    return filteredLogs.find((l) => l.date === dateStr);
  };

  // 特定の日の色（最初のイベントの色を返す）
  const getDayColor = (day: number) => {
    const dStr = toDateString(new Date(viewYear, viewMonth, day));
    const dayEvent = getEventForDate(dStr);
    if (dayEvent) {
      return EVENT_COLORS[dayEvent.category] ?? EVENT_COLORS['その他'];
    }
    return null;
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── カレンダーエリア ── */}
      <View style={styles.calendarContainer}>
        {/* タイトル */}
        <View style={styles.headerRow}>
          <Text style={styles.headerIcon}>📅</Text>
          <Text style={styles.headerTitle}>イベントカレンダー</Text>
        </View>

        {/* フィルタ */}
        <View style={{ marginBottom: 16 }}>
          <OshiSelectorTabs
            oshis={oshis}
            selectedOshiId={selectedOshiId}
            onSelect={selectOshi}
          />
        </View>

        {/* 月ナビゲーション */}
        <View style={styles.monthNavRow}>
          <Text style={styles.monthLabel}>
            {viewYear}年{viewMonth + 1}月
          </Text>
          <View style={styles.navArrows}>
            <TouchableOpacity onPress={goPrevMonth} style={styles.navBtn} hitSlop={{top:10,bottom:10,left:10,right:10}}>
              <Text style={styles.navArrowText}>◀</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goNextMonth} style={styles.navBtn} hitSlop={{top:10,bottom:10,left:10,right:10}}>
              <Text style={styles.navArrowText}>▶</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 曜日ヘッダー */}
        <View style={styles.dowRow}>
          {DOW_LABELS.map((label, i) => (
            <Text key={label} style={[styles.dowLabel, i === 0 && styles.dowSun, i === 6 && styles.dowSat]}>
              {label}
            </Text>
          ))}
        </View>

        {/* カレンダーグリッド */}
        <View style={styles.grid}>
          {weeks.map((week, wi) => (
            <View key={wi} style={styles.weekRow}>
              {week.map((day, di) => {
                if (day === null) {
                  return <View key={`e-${di}`} style={styles.dayCell} />;
                }

                const cellStr = toDateString(new Date(viewYear, viewMonth, day));
                const isSelected = cellStr === selectedStr;
                const isSun = di === 0;
                const isSat = di === 6;
                const dayColor = getDayColor(day);

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
                        dayColor && { backgroundColor: dayColor }, // イベントあり
                        isSelected && !dayColor && { backgroundColor: COLORS.primaryLight }, // 選択中（イベントなし）
                        isSelected && { borderWidth: 2, borderColor: COLORS.primaryDark }, // 選択中は枠線で強調
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          isSun && !dayColor && styles.dayTextSun,
                          isSat && !dayColor && styles.dayTextSat,
                          dayColor && { color: '#fff', fontWeight: '700' }, // 背景色がある場合は白文字
                          isSelected && !dayColor && { color: COLORS.primaryDark, fontWeight: '700' },
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
        </View>
      </View>

      {/* ── イベント一覧エリア ── */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>イベント一覧</Text>

        {selectedLogs.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>この日に登録されたイベントはありません</Text>
          </View>
        ) : (
          selectedLogs.map((log) => {
            const barColor = EVENT_COLORS[log.category] ?? EVENT_COLORS['その他'];
            const dateObj = parseDateString(log.date);
            const displayDate = dateObj ? `${dateObj.getMonth() + 1}/${dateObj.getDate()}` : log.date;

            return (
              <View key={log.id} style={styles.eventCard}>
                <View style={[styles.eventBar, { backgroundColor: barColor }]} />
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle} numberOfLines={2}>
                    {displayDate} {log.title}
                  </Text>
                  <View style={styles.eventSubInfo}>
                    <Text style={styles.eventOshi} numberOfLines={1}>💕 {getOshiName(log.oshiId)}</Text>
                    {log.amount != null && (
                      <Text style={styles.eventAmount}>-{formatAmount(log.amount)}</Text>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },

  // カレンダーエリア
  calendarContainer: {
    paddingTop: 24,
    paddingHorizontal: 20,
    backgroundColor: COLORS.headerBg,
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    ...SHADOW.card,
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.accentDark,
    letterSpacing: 0.3,
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  monthLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.accentDark,
    letterSpacing: 0.5,
  },
  navArrows: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  navBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  navArrowText: {
    fontSize: 14,
    color: COLORS.accentDark,
    fontWeight: '800',
  },

  // カレンダーグリッド
  dowRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dowLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  dowSun: { color: '#D94949' },
  dowSat: { color: '#4A8FD9' },

  grid: {
    gap: 8,
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayInner: {
    width: 34,
    height: 34,
    borderRadius: 8, // 角丸で参考画像風に
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  dayTextSun: { color: '#D94949' },
  dayTextSat: { color: '#4A8FD9' },

  // イベント一覧エリア
  listContainer: {
    paddingHorizontal: 20,
  },
  listTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.accentDark,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  emptyCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.cardSm,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },

  // イベントカード
  eventCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.cardSm,
    marginBottom: 10,
    minHeight: 64,
    ...SHADOW.card,
    overflow: 'hidden', // 縦バーをきれいにおさめるため
  },
  eventBar: {
    width: 6,
    height: '100%',
  },
  eventContent: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.2,
  },
  eventSubInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 10,
  },
  eventOshi: {
    fontSize: 11,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
  eventAmount: {
    fontSize: 12,
    color: '#D94949',
    fontWeight: '700',
  },
});
