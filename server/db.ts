import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";

const schema = `
CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  tel TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  year INTEGER NOT NULL,
  image TEXT NOT NULL,
  summary TEXT NOT NULL
);
`;

// フロントに直書きされていたデータを初期データとして移す
const seedNews = [
  ["2025-04-18", "お知らせ", "コーポレートサイトをリニューアルしました"],
  ["2025-03-12", "プロジェクト", "水辺のまち再生プロジェクトが始動します"],
  ["2025-02-03", "採用情報", "2026年度 新卒採用エントリーを開始しました"],
  ["2025-01-22", "メディア", "雑誌『地域をつくる人』に代表インタビューが掲載されました"],
  ["2024-12-10", "お知らせ", "年末年始休業のお知らせ"],
  ["2024-11-06", "プロジェクト", "里山リビング・コモンズがグッドデザイン賞を受賞しました"],
];

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=85`;

const seedProjects = [
  [
    "里山リビング・コモンズ",
    "長野県小布施町",
    "地域共創",
    2024,
    unsplash("1729669375200-9008ea007cdd"),
    "空き家12棟を活用し、移住者と地域住民が交わる分散型の暮らし拠点を整備。",
  ],
  [
    "水辺のまち再生プロジェクト",
    "香川県高松市",
    "空間デザイン",
    2023,
    unsplash("1779689512046-952d3f4cec8b"),
    "使われなくなった水辺に遊歩道と小さな商いの場をつくり、日常の居場所を再生。",
  ],
  [
    "森と学ぶキャンパス",
    "山梨県北杜市",
    "環境戦略",
    2022,
    unsplash("1553134230-64a44a322d59"),
    "森の保全と企業研修をつなぎ、管理費を地域に還元する循環モデルを構築。",
  ],
  [
    "白庭のアトリエ",
    "神奈川県鎌倉市",
    "空間デザイン",
    2021,
    unsplash("1597505377629-85f4f200f186"),
    "既存の樹木と光を生かした、地域にひらかれた創作と交流の拠点。",
  ],
] as const;

export function openDb(path: string) {
  if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(schema);

  const count = (table: string) =>
    (db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get() as { n: number }).n;

  if (count("news") === 0) {
    const insert = db.prepare("INSERT INTO news (date, category, title) VALUES (?, ?, ?)");
    for (const row of seedNews) insert.run(...row);
  }
  if (count("projects") === 0) {
    const insert = db.prepare(
      "INSERT INTO projects (title, location, category, year, image, summary) VALUES (?, ?, ?, ?, ?, ?)",
    );
    for (const row of seedProjects) insert.run(...row);
  }
  return db;
}
