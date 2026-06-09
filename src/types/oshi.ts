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
  imageUri?: string; // 添付画像のURI（任意）
  createdAt: string;
};

export type OshiGoods = {
  id: string;
  oshiId: string;
  name: string;
  category: string;
  status: string;
  purchaseDate: string;
  price?: number;
  memo: string;
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

export const GOODS_CATEGORIES = [
  'アクスタ',
  '缶バッジ',
  'ぬい',
  '写真',
  'CD/DVD',
  '本',
  '衣類',
  'その他',
] as const;

export type GoodsCategory = (typeof GOODS_CATEGORIES)[number];

export const GOODS_STATUSES = [
  '所持中',
  '欲しい',
  '予約済み',
  '売却予定',
] as const;

export type GoodsStatus = (typeof GOODS_STATUSES)[number];
