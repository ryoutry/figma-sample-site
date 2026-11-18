import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { IncomingMessage } from "node:http";
import type { DatabaseSync } from "node:sqlite";
import { Hono, type MiddlewareHandler } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

export const INQUIRY_CATEGORIES = [
  "プロジェクトのご相談",
  "協業・パートナーシップ",
  "採用について",
  "取材・その他",
];
export const NEWS_CATEGORIES = ["お知らせ", "プロジェクト", "採用情報", "メディア"];

const SESSION_COOKIE = "aona_admin";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const CONTACT_LIMIT = 5;
const CONTACT_WINDOW_MS = 10 * 60 * 1000;
// 人には見えない入力欄。値が入っていたらボットとみなす
const HONEYPOT_FIELD = "website";

type Errors = Record<string, string>;
type Body = Record<string, unknown>;

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

function validateInquiry(body: Body) {
  const data = {
    company: str(body.company),
    name: str(body.name),
    email: str(body.email),
    tel: str(body.tel),
    category: str(body.category),
    message: str(body.message),
  };
  const errors: Errors = {};
  if (!data.name) errors.name = "お名前を入力してください";
  else if (data.name.length > 100) errors.name = "お名前は100文字以内で入力してください";
  if (data.company.length > 100) errors.company = "会社名は100文字以内で入力してください";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.email.length > 254)
    errors.email = "正しいメールアドレスを入力してください";
  if (data.tel && !/^[0-9+\-() ]{6,20}$/.test(data.tel))
    errors.tel = "電話番号は数字とハイフンで入力してください";
  if (!INQUIRY_CATEGORIES.includes(data.category))
    errors.category = "お問い合わせ種別を選択してください";
  if (!data.message) errors.message = "お問い合わせ内容を入力してください";
  else if (data.message.length > 5000)
    errors.message = "お問い合わせ内容は5000文字以内で入力してください";
  if (body.agreed !== true) errors.agreed = "プライバシーポリシーへの同意が必要です";
  return { data, errors };
}

function validateNews(body: Body) {
  const data = { date: str(body.date), category: str(body.category), title: str(body.title) };
  const errors: Errors = {};
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || Number.isNaN(Date.parse(data.date)))
    errors.date = "日付を YYYY-MM-DD 形式で入力してください";
  if (!NEWS_CATEGORIES.includes(data.category)) errors.category = "カテゴリを選択してください";
  if (!data.title) errors.title = "タイトルを入力してください";
  else if (data.title.length > 200) errors.title = "タイトルは200文字以内で入力してください";
  return { data, errors };
}

const sha256 = (s: string) => createHash("sha256").update(s).digest();

async function readJson(req: { json: () => Promise<unknown> }): Promise<Body> {
  const body = await req.json().catch(() => null);
  return body && typeof body === "object" && !Array.isArray(body) ? (body as Body) : {};
}

export function createApp(
  db: DatabaseSync,
  options: {
    adminPassword?: string;
    /** 接続元 IP を読むヘッダー名。Vercel のようにプロキシが付けるヘッダーを信頼できる環境だけで指定する */
    clientIpHeader?: string;
  },
) {
  // ログイン状態は「有効期限.署名」の Cookie で持ち、サーバーには保存しない。
  // サーバーレスで複数のインスタンスが動いても同じ判定になる。
  // 鍵はパスワードから作るので、パスワードを変えると既存のログインはすべて無効になる。
  const sessionKey = sha256(`aona-session:${options.adminPassword ?? ""}`);
  const sign = (expires: string) => createHmac("sha256", sessionKey).update(expires).digest();
  const isValidSession = (token: string | undefined) => {
    const [expires, signature] = token?.split(".") ?? [];
    if (!expires || !signature || !options.adminPassword) return false;
    const given = Buffer.from(signature, "hex");
    const expected = sign(expires);
    return (
      given.length === expected.length &&
      timingSafeEqual(given, expected) &&
      Number(expires) > Date.now()
    );
  };
  // IP ごとの送信時刻（メモリ保持。再起動でリセット）
  const contactLog = new Map<string, number[]>();
  const app = new Hono<{ Bindings: { incoming?: IncomingMessage } }>().basePath("/api");

  // ---- 公開API ----

  app.post("/contact", async (c) => {
    const ip =
      (options.clientIpHeader && c.req.header(options.clientIpHeader)) ||
      c.env?.incoming?.socket.remoteAddress ||
      "unknown";
    const now = Date.now();
    if (contactLog.size > 1000) {
      for (const [key, times] of contactLog)
        if (times.every((t) => now - t >= CONTACT_WINDOW_MS)) contactLog.delete(key);
    }
    const recent = (contactLog.get(ip) ?? []).filter((t) => now - t < CONTACT_WINDOW_MS);
    if (recent.length >= CONTACT_LIMIT)
      return c.json({ error: "送信回数が多すぎます。しばらくしてから再度お試しください。" }, 429);

    const body = await readJson(c.req);
    // ボットに弾いたことを悟らせないよう、保存せず成功と同じ形で返す
    if (str(body[HONEYPOT_FIELD])) return c.json({ id: 0 }, 201);

    const { data, errors } = validateInquiry(body);
    if (Object.keys(errors).length) return c.json({ errors }, 400);
    const result = db
      .prepare(
        "INSERT INTO inquiries (company, name, email, tel, category, message) VALUES (?, ?, ?, ?, ?, ?)",
      )
      .run(data.company, data.name, data.email, data.tel, data.category, data.message);
    contactLog.set(ip, [...recent, now]);
    return c.json({ id: Number(result.lastInsertRowid) }, 201);
  });

  app.get("/news", (c) => {
    const limit = Number(c.req.query("limit"));
    const rows = db
      .prepare("SELECT id, date, category, title FROM news ORDER BY date DESC, id DESC LIMIT ?")
      .all(Number.isInteger(limit) && limit > 0 ? limit : -1);
    return c.json(rows);
  });

  app.get("/projects", (c) =>
    c.json(
      db
        .prepare(
          "SELECT id, title, location, category, year, image, summary FROM projects ORDER BY year DESC, id",
        )
        .all(),
    ),
  );

  // ---- 管理API ----

  app.post("/admin/login", async (c) => {
    if (!options.adminPassword)
      return c.json({ error: "ADMIN_PASSWORD が設定されていません" }, 503);
    const password = str((await readJson(c.req)).password);
    if (!timingSafeEqual(sha256(password), sha256(options.adminPassword)))
      return c.json({ error: "パスワードが違います" }, 401);
    const expires = String(Date.now() + SESSION_TTL_MS);
    setCookie(c, SESSION_COOKIE, `${expires}.${sign(expires).toString("hex")}`, {
      httpOnly: true,
      sameSite: "Strict",
      path: "/api/admin",
      maxAge: SESSION_TTL_MS / 1000,
      secure:
        new URL(c.req.url).protocol === "https:" || c.req.header("x-forwarded-proto") === "https",
    });
    return c.json({ ok: true });
  });

  const requireAdmin: MiddlewareHandler = async (c, next) => {
    if (!isValidSession(getCookie(c, SESSION_COOKIE)))
      return c.json({ error: "ログインが必要です" }, 401);
    await next();
  };

  // サーバーに状態を持たないため、ログアウトはブラウザの Cookie を消すことで行う
  app.post("/admin/logout", (c) => {
    deleteCookie(c, SESSION_COOKIE, { path: "/api/admin" });
    return c.json({ ok: true });
  });

  app.get("/admin/me", requireAdmin, (c) => c.json({ ok: true }));

  app.get("/admin/inquiries", requireAdmin, (c) =>
    c.json(db.prepare("SELECT * FROM inquiries ORDER BY id DESC").all()),
  );

  app.post("/admin/news", requireAdmin, async (c) => {
    const { data, errors } = validateNews(await readJson(c.req));
    if (Object.keys(errors).length) return c.json({ errors }, 400);
    const result = db
      .prepare("INSERT INTO news (date, category, title) VALUES (?, ?, ?)")
      .run(data.date, data.category, data.title);
    return c.json({ id: Number(result.lastInsertRowid), ...data }, 201);
  });

  app.put("/admin/news/:id", requireAdmin, async (c) => {
    const { data, errors } = validateNews(await readJson(c.req));
    if (Object.keys(errors).length) return c.json({ errors }, 400);
    const id = Number(c.req.param("id"));
    const result = db
      .prepare("UPDATE news SET date = ?, category = ?, title = ? WHERE id = ?")
      .run(data.date, data.category, data.title, id);
    if (result.changes === 0) return c.json({ error: "ニュースが見つかりません" }, 404);
    return c.json({ id, ...data });
  });

  app.delete("/admin/news/:id", requireAdmin, (c) => {
    const result = db.prepare("DELETE FROM news WHERE id = ?").run(Number(c.req.param("id")));
    if (result.changes === 0) return c.json({ error: "ニュースが見つかりません" }, 404);
    return c.body(null, 204);
  });

  return app;
}
