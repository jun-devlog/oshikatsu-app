import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Oshi, OshiLog, OshiGoods } from '../types/oshi';

const OSHI_KEY = 'oshikatsu_oshis';
const LOG_KEY = 'oshikatsu_logs';
const GOODS_KEY = 'oshikatsu_goods';
const SELECTED_KEY = 'oshikatsu_selected_oshi_id';

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
        if (oshiJson) setOshis(JSON.parse(oshiJson));
        if (logJson) setLogs(JSON.parse(logJson));
        if (goodsJson) setGoods(JSON.parse(goodsJson));
        if (selectedJson) setSelectedOshiId(selectedJson);
      } catch (e) {
        console.error('load error', e);
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
      AsyncStorage.setItem(OSHI_KEY, JSON.stringify(next)).catch(console.error);
      return next;
    });
  }, []);

  // 推し削除
  const deleteOshi = useCallback(async (id: string) => {
    setOshis((prev) => {
      const next = prev.filter((o) => o.id !== id);
      AsyncStorage.setItem(OSHI_KEY, JSON.stringify(next)).catch(console.error);
      return next;
    });
    // 選択中の推しが削除された場合はリセット
    setSelectedOshiId((prev) => {
      if (prev === id) {
        AsyncStorage.removeItem(SELECTED_KEY).catch(console.error);
        return null;
      }
      return prev;
    });
    // その推しのログとグッズも削除
    setLogs((prev) => {
      const next = prev.filter((l) => l.oshiId !== id);
      AsyncStorage.setItem(LOG_KEY, JSON.stringify(next)).catch(console.error);
      return next;
    });
    setGoods((prev) => {
      const next = prev.filter((g) => g.oshiId !== id);
      AsyncStorage.setItem(GOODS_KEY, JSON.stringify(next)).catch(console.error);
      return next;
    });
  }, []);

  // 推し選択
  const selectOshi = useCallback(async (id: string | null) => {
    setSelectedOshiId(id);
    if (id) {
      await AsyncStorage.setItem(SELECTED_KEY, id);
    } else {
      await AsyncStorage.removeItem(SELECTED_KEY);
    }
  }, []);

  // ログ追加
  const addLog = useCallback(async (log: OshiLog) => {
    setLogs((prev) => {
      const next = [log, ...prev];
      AsyncStorage.setItem(LOG_KEY, JSON.stringify(next)).catch(console.error);
      return next;
    });
  }, []);

  // ログ削除
  const deleteLog = useCallback(async (id: string) => {
    setLogs((prev) => {
      const next = prev.filter((l) => l.id !== id);
      AsyncStorage.setItem(LOG_KEY, JSON.stringify(next)).catch(console.error);
      return next;
    });
  }, []);

  // グッズ追加
  const addGoods = useCallback(async (item: OshiGoods) => {
    setGoods((prev) => {
      const next = [item, ...prev];
      AsyncStorage.setItem(GOODS_KEY, JSON.stringify(next)).catch(console.error);
      return next;
    });
  }, []);

  // グッズ削除
  const deleteGoods = useCallback(async (id: string) => {
    setGoods((prev) => {
      const next = prev.filter((g) => g.id !== id);
      AsyncStorage.setItem(GOODS_KEY, JSON.stringify(next)).catch(console.error);
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
