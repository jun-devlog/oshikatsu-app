import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Oshi, OshiLog, OshiGoods } from '../types/oshi';

const OSHI_KEY = 'oshikatsu_oshis';
const LOG_KEY = 'oshikatsu_logs';
const GOODS_KEY = 'oshikatsu_goods';
const SELECTED_KEY = 'oshikatsu_selected_oshi_id';

/** JSON パースの安全ラッパー */
function safeJsonParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback;
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? (parsed as T) : fallback;
  } catch {
    console.warn('[推しログ] JSONパースに失敗しました。データをリセットします。');
    return fallback;
  }
}

/** AsyncStorage 書き込みの安全ラッパー */
async function safeSave(key: string, data: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`[推しログ] データ保存に失敗しました (key=${key})`, e);
  }
}

export function useOshiStorage() {
  const [oshis, setOshis] = useState<Oshi[]>([]);
  const [logs, setLogs] = useState<OshiLog[]>([]);
  const [goods, setGoods] = useState<OshiGoods[]>([]);
  const [selectedOshiId, setSelectedOshiId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 初回ロード
  useEffect(() => {
    const load = async () => {
      try {
        const [oshiJson, logJson, goodsJson, selectedJson] = await Promise.all([
          AsyncStorage.getItem(OSHI_KEY),
          AsyncStorage.getItem(LOG_KEY),
          AsyncStorage.getItem(GOODS_KEY),
          AsyncStorage.getItem(SELECTED_KEY),
        ]);
        setOshis(safeJsonParse<Oshi[]>(oshiJson, []));
        setLogs(safeJsonParse<OshiLog[]>(logJson, []));
        setGoods(safeJsonParse<OshiGoods[]>(goodsJson, []));
        if (selectedJson) setSelectedOshiId(selectedJson);
      } catch (e) {
        console.warn('[推しログ] データ読み込みに失敗しました。初期状態で起動します。', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // 推し追加
  const addOshi = useCallback(async (oshi: Oshi) => {
    setOshis((prev) => {
      const next = [...prev, oshi];
      safeSave(OSHI_KEY, next);
      return next;
    });
  }, []);

  // 推し削除
  const deleteOshi = useCallback(async (id: string) => {
    setOshis((prev) => {
      const next = prev.filter((o) => o.id !== id);
      safeSave(OSHI_KEY, next);
      return next;
    });
    // 選択中の推しが削除された場合はリセット
    setSelectedOshiId((prev) => {
      if (prev === id) {
        AsyncStorage.removeItem(SELECTED_KEY).catch(() =>
          console.warn('[推しログ] 選択推しリセットに失敗しました')
        );
        return null;
      }
      return prev;
    });
    // その推しのログとグッズも削除
    setLogs((prev) => {
      const next = prev.filter((l) => l.oshiId !== id);
      safeSave(LOG_KEY, next);
      return next;
    });
    setGoods((prev) => {
      const next = prev.filter((g) => g.oshiId !== id);
      safeSave(GOODS_KEY, next);
      return next;
    });
  }, []);

  // 推し選択
  const selectOshi = useCallback(async (id: string | null) => {
    setSelectedOshiId(id);
    try {
      if (id) {
        await AsyncStorage.setItem(SELECTED_KEY, id);
      } else {
        await AsyncStorage.removeItem(SELECTED_KEY);
      }
    } catch (e) {
      console.warn('[推しログ] 選択推しの保存に失敗しました', e);
    }
  }, []);

  // ログ追加
  const addLog = useCallback(async (log: OshiLog) => {
    setLogs((prev) => {
      const next = [log, ...prev];
      safeSave(LOG_KEY, next);
      return next;
    });
  }, []);

  // ログ削除
  const deleteLog = useCallback(async (id: string) => {
    setLogs((prev) => {
      const next = prev.filter((l) => l.id !== id);
      safeSave(LOG_KEY, next);
      return next;
    });
  }, []);

  // グッズ追加
  const addGoods = useCallback(async (item: OshiGoods) => {
    setGoods((prev) => {
      const next = [item, ...prev];
      safeSave(GOODS_KEY, next);
      return next;
    });
  }, []);

  // グッズ削除
  const deleteGoods = useCallback(async (id: string) => {
    setGoods((prev) => {
      const next = prev.filter((g) => g.id !== id);
      safeSave(GOODS_KEY, next);
      return next;
    });
  }, []);

  const selectedOshi = oshis.find((o) => o.id === selectedOshiId) ?? null;

  return {
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
  };
}
