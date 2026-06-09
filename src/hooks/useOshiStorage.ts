import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { Oshi, OshiLog, OshiGoods } from '../types/oshi';

const SELECTED_KEY = 'oshikatsu_selected_oshi_id';

// Firestoreはundefinedを許容しないため削除するヘルパー
function removeUndefined<T extends Record<string, any>>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined)) as T;
}

export function useOshiStorage() {
  const [user, setUser] = useState<User | null>(null);
  const [oshis, setOshis] = useState<Oshi[]>([]);
  const [logs, setLogs] = useState<OshiLog[]>([]);
  const [goods, setGoods] = useState<OshiGoods[]>([]);
  const [selectedOshiId, setSelectedOshiId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. 匿名認証のセットアップ
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        try {
          await signInAnonymously(auth);
        } catch (error) {
          console.error("匿名ログインに失敗しました", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. データのリアルタイム購読
  useEffect(() => {
    if (!user) return;

    setLoading(true);

    // AsyncStorageから選択中の推しを復元
    AsyncStorage.getItem(SELECTED_KEY).then(id => {
      if (id) setSelectedOshiId(id);
    });

    const oshisRef = collection(db, 'oshis');
    const logsRef = collection(db, 'logs');
    const goodsRef = collection(db, 'goods');

    const qOshis = query(oshisRef, where('userId', '==', user.uid));
    const qLogs = query(logsRef, where('userId', '==', user.uid));
    const qGoods = query(goodsRef, where('userId', '==', user.uid));

    const unsubOshis = onSnapshot(qOshis, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as Oshi);
      // ローカルで作成日順にソートするなどの対応が可能
      setOshis(data);
    });

    const unsubLogs = onSnapshot(qLogs, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as OshiLog);
      // 日付の降順（新しい順）
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setLogs(data);
    });

    const unsubGoods = onSnapshot(qGoods, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as OshiGoods);
      // 日付の降順
      data.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
      setGoods(data);
      setLoading(false);
    });

    return () => {
      unsubOshis();
      unsubLogs();
      unsubGoods();
    };
  }, [user]);

  // 推し追加
  const addOshi = useCallback(async (oshi: Oshi) => {
    if (!user) return;
    const docRef = doc(db, 'oshis', oshi.id);
    await setDoc(docRef, removeUndefined({ ...oshi, userId: user.uid }));
  }, [user]);

  // 推し削除（関連ログ・グッズも削除）
  const deleteOshi = useCallback(async (id: string) => {
    if (!user) return;

    try {
      const batch = writeBatch(db);
      
      // 推し自身の削除
      batch.delete(doc(db, 'oshis', id));

      // 関連ログの削除
      const logsQuery = query(collection(db, 'logs'), where('oshiId', '==', id), where('userId', '==', user.uid));
      const logsSnap = await getDocs(logsQuery);
      logsSnap.forEach((d) => batch.delete(d.ref));

      // 関連グッズの削除
      const goodsQuery = query(collection(db, 'goods'), where('oshiId', '==', id), where('userId', '==', user.uid));
      const goodsSnap = await getDocs(goodsQuery);
      goodsSnap.forEach((d) => batch.delete(d.ref));

      await batch.commit();

      if (selectedOshiId === id) {
        setSelectedOshiId(null);
        await AsyncStorage.removeItem(SELECTED_KEY);
      }
    } catch (e) {
      console.error("推しの削除に失敗しました", e);
    }
  }, [user, selectedOshiId]);

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
    if (!user) return;
    const docRef = doc(db, 'logs', log.id);
    await setDoc(docRef, removeUndefined({ ...log, userId: user.uid }));
  }, [user]);

  // ログ削除
  const deleteLog = useCallback(async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'logs', id));
  }, [user]);

  // グッズ追加
  const addGoods = useCallback(async (item: OshiGoods) => {
    if (!user) return;
    const docRef = doc(db, 'goods', item.id);
    await setDoc(docRef, removeUndefined({ ...item, userId: user.uid }));
  }, [user]);

  // グッズ削除
  const deleteGoods = useCallback(async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'goods', id));
  }, [user]);

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
