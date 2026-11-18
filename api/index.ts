// Vercel のサーバーレス関数の入口。vercel.json で /api/* をここに集めている。
// Vercel は TS を JS に変換して実行するため、import は変換後の .js で書く
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";

// デモ用：DB はインスタンスのメモリ上に作るため、インスタンスが入れ替わると初期データに戻る
const app = createApp(openDb(":memory:"), {
  adminPassword: process.env.ADMIN_PASSWORD,
  // Vercel は接続元 IP を x-real-ip に入れ、クライアントからの値は上書きする
  clientIpHeader: "x-real-ip",
});

const handler = (request: Request) => app.fetch(request);

export { handler as DELETE, handler as GET, handler as POST, handler as PUT };
