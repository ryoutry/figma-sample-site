import assert from "node:assert/strict";
import { beforeEach, describe, test } from "node:test";
import { createApp } from "./app.ts";
import { openDb } from "./db.ts";

const PASSWORD = "test-password";
let app: ReturnType<typeof createApp>;

beforeEach(() => {
  app = createApp(openDb(":memory:"), { adminPassword: PASSWORD });
});

const json = (method: string, body: unknown, cookie = "") => ({
  method,
  headers: { "Content-Type": "application/json", Cookie: cookie },
  body: JSON.stringify(body),
});

async function login() {
  const res = await app.request("/api/admin/login", json("POST", { password: PASSWORD }));
  assert.equal(res.status, 200);
  return res.headers.get("set-cookie")!.split(";")[0];
}

const validInquiry = {
  company: "株式会社テスト",
  name: "青木 太郎",
  email: "taro@example.com",
  tel: "03-0000-0000",
  category: "プロジェクトのご相談",
  message: "相談したいことがあります。",
  agreed: true,
};

describe("POST /api/contact", () => {
  test("正しい入力を保存し 201 を返す", async () => {
    const res = await app.request("/api/contact", json("POST", validInquiry));
    assert.equal(res.status, 201);
    assert.equal(typeof (await res.json()).id, "number");

    const list = await app.request("/api/admin/inquiries", { headers: { Cookie: await login() } });
    const rows = await list.json();
    assert.equal(rows.length, 1);
    assert.equal(rows[0].name, "青木 太郎");
    assert.equal(rows[0].category, "プロジェクトのご相談");
  });

  test("必須項目が欠けていると 400 と項目ごとのエラーを返す", async () => {
    const res = await app.request("/api/contact", json("POST", { agreed: false }));
    assert.equal(res.status, 400);
    const { errors } = await res.json();
    assert.deepEqual(Object.keys(errors).sort(), [
      "agreed",
      "category",
      "email",
      "message",
      "name",
    ]);
  });

  test("不正なメール・種別・電話番号を拒否する", async () => {
    const res = await app.request(
      "/api/contact",
      json("POST", { ...validInquiry, email: "foo@", category: "不明", tel: "abc" }),
    );
    assert.equal(res.status, 400);
    const { errors } = await res.json();
    assert.ok(errors.email && errors.category && errors.tel);
  });

  test("ハニーポット欄に値があると、保存せずに成功と同じ応答を返す", async () => {
    const res = await app.request(
      "/api/contact",
      json("POST", { ...validInquiry, website: "http://spam.example" }),
    );
    assert.equal(res.status, 201);
    const list = await app.request("/api/admin/inquiries", { headers: { Cookie: await login() } });
    assert.equal((await list.json()).length, 0);
  });

  test("同じ IP から6件目は 429、別の IP は送信できる", async () => {
    const from = (ip: string) => ({ incoming: { socket: { remoteAddress: ip } } });
    for (let i = 0; i < 5; i++) {
      const res = await app.request("/api/contact", json("POST", validInquiry), from("1.1.1.1"));
      assert.equal(res.status, 201);
    }
    const blocked = await app.request("/api/contact", json("POST", validInquiry), from("1.1.1.1"));
    assert.equal(blocked.status, 429);
    assert.ok((await blocked.json()).error);
    const other = await app.request("/api/contact", json("POST", validInquiry), from("2.2.2.2"));
    assert.equal(other.status, 201);
  });

  test("clientIpHeader を指定すると、そのヘッダーの IP で回数を数える", async () => {
    const proxied = createApp(openDb(":memory:"), { clientIpHeader: "x-real-ip" });
    const send = (ip: string) =>
      proxied.request("/api/contact", {
        ...json("POST", validInquiry),
        headers: { "Content-Type": "application/json", "x-real-ip": ip },
      });
    for (let i = 0; i < 5; i++) assert.equal((await send("4.4.4.4")).status, 201);
    assert.equal((await send("4.4.4.4")).status, 429);
    assert.equal((await send("5.5.5.5")).status, 201);
  });

  test("入力エラーの送信は回数に数えない", async () => {
    const from = { incoming: { socket: { remoteAddress: "3.3.3.3" } } };
    for (let i = 0; i < 6; i++)
      await app.request("/api/contact", json("POST", { agreed: false }), from);
    const res = await app.request("/api/contact", json("POST", validInquiry), from);
    assert.equal(res.status, 201);
  });

  test("壊れた JSON でも 500 にならず 400 を返す", async () => {
    const res = await app.request("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{",
    });
    assert.equal(res.status, 400);
  });
});

describe("公開API", () => {
  test("GET /api/news は初期データを日付の新しい順に返し、limit を効かせる", async () => {
    const all = await (await app.request("/api/news")).json();
    assert.equal(all.length, 6);
    assert.equal(all[0].date, "2025-04-18");
    const top3 = await (await app.request("/api/news?limit=3")).json();
    assert.equal(top3.length, 3);
  });

  test("GET /api/projects は実績4件を返す", async () => {
    const rows = await (await app.request("/api/projects")).json();
    assert.equal(rows.length, 4);
    assert.equal(rows[0].title, "里山リビング・コモンズ");
  });
});

describe("管理API", () => {
  test("未ログインでは 401", async () => {
    for (const [path, init] of [
      ["/api/admin/me", {}],
      ["/api/admin/inquiries", {}],
      ["/api/admin/news", json("POST", { date: "2025-05-01", category: "お知らせ", title: "x" })],
      ["/api/admin/news/1", { method: "DELETE" }],
    ] as const) {
      assert.equal((await app.request(path, init)).status, 401, path);
    }
  });

  test("パスワード違いは 401、パスワード未設定なら 503", async () => {
    const res = await app.request("/api/admin/login", json("POST", { password: "wrong" }));
    assert.equal(res.status, 401);
    const noPw = createApp(openDb(":memory:"), {});
    const res2 = await noPw.request("/api/admin/login", json("POST", { password: "" }));
    assert.equal(res2.status, 503);
  });

  const me = (cookie: string, target = app) =>
    target.request("/api/admin/me", { headers: { Cookie: cookie } });

  test("ログアウトでブラウザの Cookie を削除させる", async () => {
    const cookie = await login();
    assert.equal((await me(cookie)).status, 200);
    const res = await app.request("/api/admin/logout", {
      method: "POST",
      headers: { Cookie: cookie },
    });
    assert.match(res.headers.get("set-cookie")!, /aona_admin=;.*Max-Age=0/);
  });

  test("ログイン状態はサーバーに保存しないので、別のインスタンスでも有効", async () => {
    const cookie = await login();
    const other = createApp(openDb(":memory:"), { adminPassword: PASSWORD });
    assert.equal((await me(cookie, other)).status, 200);
  });

  test("改ざんした Cookie と、パスワード変更前の Cookie は 401", async () => {
    const cookie = await login();
    const [name, value] = cookie.split("=");
    const [expires, signature] = value.split(".");
    const extended = `${name}=${Number(expires) + 1e9}.${signature}`;
    assert.equal((await me(extended)).status, 401);
    const changed = createApp(openDb(":memory:"), { adminPassword: "new-password" });
    assert.equal((await me(cookie, changed)).status, 401);
  });

  test("8時間を過ぎた Cookie は 401", async (t) => {
    const cookie = await login();
    t.mock.timers.enable({ apis: ["Date"], now: Date.now() + 8 * 60 * 60 * 1000 + 1 });
    assert.equal((await me(cookie)).status, 401);
  });

  test("ニュースを登録・更新・削除でき、公開APIに反映される", async () => {
    const cookie = await login();
    const created = await app.request(
      "/api/admin/news",
      json("POST", { date: "2025-06-01", category: "メディア", title: "新しい記事" }, cookie),
    );
    assert.equal(created.status, 201);
    const { id } = await created.json();
    assert.equal((await (await app.request("/api/news")).json())[0].title, "新しい記事");

    const updated = await app.request(
      `/api/admin/news/${id}`,
      json("PUT", { date: "2025-06-01", category: "メディア", title: "更新した記事" }, cookie),
    );
    assert.equal(updated.status, 200);
    assert.equal((await (await app.request("/api/news")).json())[0].title, "更新した記事");

    const deleted = await app.request(`/api/admin/news/${id}`, {
      method: "DELETE",
      headers: { Cookie: cookie },
    });
    assert.equal(deleted.status, 204);
    assert.equal((await (await app.request("/api/news")).json()).length, 6);
  });

  test("ニュースの不正入力は 400、存在しない ID は 404", async () => {
    const cookie = await login();
    const bad = await app.request(
      "/api/admin/news",
      json("POST", { date: "2025/06/01", category: "不明", title: "" }, cookie),
    );
    assert.equal(bad.status, 400);
    assert.deepEqual(Object.keys((await bad.json()).errors).sort(), ["category", "date", "title"]);

    const missing = await app.request(
      "/api/admin/news/9999",
      json("PUT", { date: "2025-06-01", category: "お知らせ", title: "x" }, cookie),
    );
    assert.equal(missing.status, 404);
  });
});
