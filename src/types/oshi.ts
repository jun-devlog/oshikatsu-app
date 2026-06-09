export type Oshi = {
  id: string;
  name: string;
  genre: string;
  createdAt: string;
};

export type OshiLog = {
  id: string;
  oshiId: string;
  date: string;
  category: string;
  title: string;
  memo: string;
  amount?: number;
  createdAt: string;
};

export const CATEGORIES = [
  '配信',
  'ライブ',
  'グッズ',
  'イベント',
  '聖地巡礼',
  '感想',
  '支出',
  'その他',
] as const;

export type Category = (typeof CATEGORIES)[number];
