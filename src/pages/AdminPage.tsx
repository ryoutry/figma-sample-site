import { type FormEvent, useEffect, useState } from "react";
import { api, ApiError, formatDate, type Inquiry, type News, useApi } from "../api";

const NEWS_CATEGORIES = ["お知らせ", "プロジェクト", "採用情報", "メディア"];
const input =
  "w-full border border-[#183027]/25 bg-white px-3 py-2 text-sm outline-none focus:border-[#183027]";
const button = "bg-[#183027] px-5 py-2 text-xs tracking-wider text-white disabled:opacity-60";
const errorText = "text-xs text-[#b5482f]";

const message = (e: unknown) =>
  e instanceof ApiError ? Object.values(e.errors).join(" / ") || e.message : "エラーが発生しました";

function Login({ onLogin }: { onLogin: () => void }) {
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      await api("/admin/login", {
        method: "POST",
        body: { password: new FormData(event.currentTarget).get("password") },
      });
      onLogin();
    } catch (e) {
      setError(message(e));
    }
  }
  return (
    <form onSubmit={submit} className="mx-auto mt-24 max-w-sm space-y-4">
      <h1 className="text-xl tracking-wider">管理画面ログイン</h1>
      <input name="password" type="password" required placeholder="パスワード" className={input} />
      {error && <p className={errorText}>{error}</p>}
      <button className={button}>ログイン</button>
    </form>
  );
}

function Inquiries() {
  const { data, error } = useApi<Inquiry[]>("/admin/inquiries");
  if (error) return <p className={errorText}>お問い合わせを読み込めませんでした。</p>;
  if (!data) return <p className="text-sm">読み込み中…</p>;
  if (data.length === 0) return <p className="text-sm">お問い合わせはまだありません。</p>;
  return (
    <div className="divide-y divide-[#183027]/15 border-y border-[#183027]/15">
      {data.map((q) => (
        <details key={q.id} className="py-4">
          <summary className="grid cursor-pointer gap-2 text-sm sm:grid-cols-[150px_170px_1fr]">
            <span className="text-[#183027]/50">{q.created_at} UTC</span>
            <span className="text-[#987a4e]">{q.category}</span>
            <span>
              {q.name}
              {q.company && `（${q.company}）`}
            </span>
          </summary>
          <dl className="mt-4 grid gap-2 bg-white p-4 text-sm sm:grid-cols-[120px_1fr]">
            <dt className="text-[#183027]/50">メール</dt>
            <dd>
              <a href={`mailto:${q.email}`} className="underline">
                {q.email}
              </a>
            </dd>
            <dt className="text-[#183027]/50">電話番号</dt>
            <dd>{q.tel || "—"}</dd>
            <dt className="text-[#183027]/50">内容</dt>
            <dd className="whitespace-pre-wrap leading-7">{q.message}</dd>
          </dl>
        </details>
      ))}
    </div>
  );
}

function NewsEditor() {
  const { data, error, reload } = useApi<News[]>("/news");
  const [editing, setEditing] = useState<News | null>(null);
  const [formError, setFormError] = useState("");

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    setFormError("");
    try {
      await api(editing ? `/admin/news/${editing.id}` : "/admin/news", {
        method: editing ? "PUT" : "POST",
        body: Object.fromEntries(new FormData(formEl)),
      });
      setEditing(null);
      formEl.reset();
      reload();
    } catch (e) {
      setFormError(message(e));
    }
  }

  async function remove(item: News) {
    if (!window.confirm(`「${item.title}」を削除しますか？`)) return;
    try {
      await api(`/admin/news/${item.id}`, { method: "DELETE" });
      if (editing?.id === item.id) setEditing(null);
      reload();
    } catch (e) {
      window.alert(message(e));
    }
  }

  return (
    <div className="space-y-10">
      {/* key で編集対象が変わったときにフォームの初期値を入れ直す */}
      <form key={editing?.id ?? "new"} onSubmit={save} className="space-y-3 bg-white p-5">
        <h2 className="text-sm tracking-wider">{editing ? "ニュースを編集" : "ニュースを追加"}</h2>
        <div className="grid gap-3 sm:grid-cols-[170px_160px_1fr]">
          <input
            name="date"
            type="date"
            required
            defaultValue={editing?.date ?? new Date().toISOString().slice(0, 10)}
            className={input}
          />
          <select name="category" defaultValue={editing?.category} className={input}>
            {NEWS_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input
            name="title"
            required
            maxLength={200}
            placeholder="タイトル"
            defaultValue={editing?.title}
            className={input}
          />
        </div>
        {formError && <p className={errorText}>{formError}</p>}
        <div className="flex gap-3">
          <button className={button}>{editing ? "更新する" : "追加する"}</button>
          {editing && (
            <button type="button" onClick={() => setEditing(null)} className="text-xs underline">
              キャンセル
            </button>
          )}
        </div>
      </form>

      {error && <p className={errorText}>ニュースを読み込めませんでした。</p>}
      <div className="divide-y divide-[#183027]/15 border-y border-[#183027]/15">
        {data?.map((n) => (
          <div
            key={n.id}
            className="grid items-center gap-2 py-3 text-sm sm:grid-cols-[100px_100px_1fr_auto]"
          >
            <span className="text-[#183027]/50">{formatDate(n.date)}</span>
            <span className="text-[#987a4e]">{n.category}</span>
            <span>{n.title}</span>
            <span className="flex gap-4 text-xs">
              <button onClick={() => setEditing(n)} className="underline">
                編集
              </button>
              <button onClick={() => remove(n)} className="text-[#b5482f] underline">
                削除
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean>();
  const [tab, setTab] = useState<"inquiries" | "news">("inquiries");

  useEffect(() => {
    api("/admin/me")
      .then(() => setAuthed(true))
      .catch(() => setAuthed(false));
  }, []);

  async function logout() {
    await api("/admin/logout", { method: "POST" }).catch(() => {});
    setAuthed(false);
  }

  return (
    <div className="min-h-screen bg-[#f3f1eb] px-6 pb-20 text-[#183027] sm:px-10">
      {authed === false && <Login onLogin={() => setAuthed(true)} />}
      {authed && (
        <div className="mx-auto max-w-[1100px]">
          <header className="flex items-center justify-between border-b border-[#183027]/15 py-6">
            <a href="#/" className="text-sm tracking-[0.24em]">
              AONA 管理画面
            </a>
            <button onClick={logout} className="text-xs underline">
              ログアウト
            </button>
          </header>
          <nav className="my-8 flex gap-2">
            {(
              [
                ["inquiries", "お問い合わせ"],
                ["news", "ニュース"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`${tab === key ? "bg-[#183027] text-white" : "border border-[#183027]/20"} px-4 py-2 text-xs tracking-wider`}
              >
                {label}
              </button>
            ))}
          </nav>
          {tab === "inquiries" ? <Inquiries /> : <NewsEditor />}
        </div>
      )}
    </div>
  );
}
