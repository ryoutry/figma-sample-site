import { serve } from "@hono/node-server";
import { createApp } from "./app.ts";
import { openDb } from "./db.ts";

const port = Number(process.env.API_PORT ?? 8787);
const db = openDb(process.env.DB_PATH ?? "data/aona.db");
const app = createApp(db, { adminPassword: process.env.ADMIN_PASSWORD });

if (!process.env.ADMIN_PASSWORD) {
  console.warn("ADMIN_PASSWORD が未設定のため、管理画面にはログインできません");
}

serve({ fetch: app.fetch, port }, () => {
  console.log(`API server: http://localhost:${port}/api`);
});
