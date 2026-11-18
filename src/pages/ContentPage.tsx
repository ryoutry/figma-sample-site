import { type FormEvent, useState } from "react";
import { api, ApiError, formatDate, type News, type Project, useApi } from "../api";

const image = {
  about:
    "https://images.unsplash.com/photo-1758691737124-05c5bffe46f0?auto=format&fit=crop&w=1800&q=85",
  business:
    "https://images.unsplash.com/photo-1767840272272-e736a41fc2f1?auto=format&fit=crop&w=1800&q=85",
  forest:
    "https://images.unsplash.com/photo-1512694686974-04f888b86ca3?auto=format&fit=crop&w=1800&q=85",
  careers:
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1800&q=85",
};

const pageTitles: Record<string, [string, string, string?]> = {
  about: ["私たちについて", "About Us", "人と自然のあいだに、豊かな関係をつくる。"],
  business: ["事業紹介", "Our Business", "構想から運営まで、未来の風景を一緒につくる。"],
  company: ["会社情報", "Company", "AONAという会社について。"],
  contact: ["お問い合わせ", "Contact", "まだ言葉になっていない相談から、お聞かせください。"],
  projects: ["プロジェクト・実績", "Projects", "地域に根づき、風景になっていく仕事。"],
  news: ["ニュース", "News", "AONAの活動と、日々の動きをお伝えします。"],
  careers: ["採用情報", "Careers", "まだない景色を、ともにつくろう。"],
  sustainability: ["サステナビリティ", "Sustainability", "自然の循環を、社会の力に。"],
  privacy: ["プライバシーポリシー", "Privacy Policy", "個人情報の取り扱いについて。"],
};

function PageHero({ route }: { route: string }) {
  const title = pageTitles[route] || ["ページが見つかりません", "Not Found", ""];
  return (
    <section className="border-b border-[#183027]/15 px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1220px] animate-reveal">
        <p className="section-label">{title[1]}</p>
        <div className="mt-6 grid items-end gap-8 lg:grid-cols-[.85fr_1.15fr]">
          <h1 className="text-[clamp(2.3rem,5vw,4.8rem)] font-light tracking-[0.08em]">
            {title[0]}
          </h1>
          <p className="max-w-xl text-base font-light leading-8 tracking-[0.08em] text-[#183027]/65 lg:justify-self-end lg:text-lg">
            {title[2]}
          </p>
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ en, children }: { en: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="section-label">{en}</p>
      <h2 className="mt-4 text-3xl font-light leading-relaxed tracking-wider sm:text-4xl">
        {children}
      </h2>
    </div>
  );
}

function AboutPage() {
  return (
    <>
      <section className="page-section">
        <div className="mx-auto grid max-w-[1220px] gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionTitle en="Our Purpose">想いを、未来の景色に。</SectionTitle>
            <p className="mt-8 text-sm leading-8 text-[#183027]/65">
              便利さや効率だけでは測れない、土地の記憶、人の営み、自然のリズム。私たちは、そこにある声に耳を澄まし、地域の未来をともに描きます。
            </p>
            <p className="mt-5 text-sm leading-8 text-[#183027]/65">
              短期的な完成ではなく、10年、50年先も愛される風景へ。AONAはデザインの力で、人と自然のよりよい関係を育て続けます。
            </p>
          </div>
          <img
            src={image.about}
            alt="プロジェクトについて話し合うチーム"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      </section>
      <section className="bg-[#e4e5dd] page-section">
        <div className="mx-auto max-w-[1220px]">
          <SectionTitle en="Our Values">大切にしている、3つの姿勢</SectionTitle>
          <div className="mt-14 grid gap-px bg-[#183027]/15 md:grid-cols-3">
            {[
              [
                "01",
                "よく聴く",
                "土地の歴史、自然の声、暮らす人の想い。答えを急がず、まず深く理解することから始めます。",
              ],
              [
                "02",
                "ともにつくる",
                "専門家だけで完結せず、地域やお客さまと同じテーブルで考え、つくるプロセスを大切にします。",
              ],
              [
                "03",
                "長く育てる",
                "完成をゴールにせず、使われ方や環境の変化を見つめながら、場所と関係を育て続けます。",
              ],
            ].map((v) => (
              <div key={v[0]} className="bg-[#e4e5dd] p-8 lg:p-10">
                <span className="font-serif text-[#987a4e]">{v[0]}</span>
                <h3 className="mt-12 text-2xl tracking-wider">{v[1]}</h3>
                <p className="mt-5 text-sm leading-7 text-[#183027]/60">{v[2]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="page-section">
        <div className="mx-auto max-w-4xl text-center">
          <p className="section-label">Message</p>
          <blockquote className="mt-8 text-2xl font-light leading-[2] tracking-wider sm:text-3xl">
            「地域らしさ」は、
            <br />
            未来をつくるための資源です。
          </blockquote>
          <p className="mx-auto mt-9 max-w-2xl text-left text-sm leading-8 text-[#183027]/65">
            日本の各地には、まだ名前のついていない価値がたくさんあります。私たちの役割は、外から答えを持ち込むことではなく、その土地にある可能性を見つけ、地域の皆さまと一緒に形にすること。誠実な対話と確かな専門性で、未来へ続く選択肢をつくります。
          </p>
          <p className="mt-8 text-sm tracking-wider">代表取締役　青木 直人</p>
        </div>
      </section>
    </>
  );
}

function BusinessPage() {
  const services: [string, string, string, string, string[]][] = [
    [
      "01",
      "地域共創",
      "Regional Design",
      "地域資源の調査から将来ビジョンの策定、住民参加型ワークショップ、事業化支援まで。地域の内側から続いていく仕組みをつくります。",
      ["地域ビジョン策定", "官民連携事業", "コミュニティ運営"],
    ],
    [
      "02",
      "空間デザイン",
      "Spatial Design",
      "建築、インテリア、ランドスケープを横断し、環境と使い手に寄り添う場所を設計。完成後の運用まで見据えて伴走します。",
      ["建築・内装設計", "ランドスケープ", "エリアリノベーション"],
    ],
    [
      "03",
      "環境戦略",
      "Environmental Strategy",
      "自然資本や地域エネルギーの可能性を可視化し、企業・自治体の環境戦略を実装可能なプロジェクトへと変換します。",
      ["自然資本評価", "脱炭素ロードマップ", "循環型事業開発"],
    ],
  ];
  return (
    <>
      <div className="px-6 pt-12 sm:px-10 lg:px-16">
        <img
          src={image.business}
          alt="自然素材でつくられた建築空間"
          className="mx-auto h-[38vh] min-h-72 w-full max-w-[1320px] object-cover object-center"
        />
      </div>
      <section className="page-section">
        <div className="mx-auto max-w-[1220px]">
          <SectionTitle en="Business Fields">3つの専門領域を、ひとつのチームで。</SectionTitle>
          <div className="mt-16 divide-y divide-[#183027]/15 border-t border-[#183027]/15">
            {services.map((s) => (
              <div key={s[0]} className="grid gap-8 py-12 lg:grid-cols-[100px_1fr_1.4fr]">
                <span className="font-serif text-[#987a4e]">{s[0]}</span>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#183027]/45">{s[2]}</p>
                  <h3 className="mt-3 text-3xl tracking-wider">{s[1]}</h3>
                </div>
                <div>
                  <p className="text-sm leading-8 text-[#183027]/65">{s[3]}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {s[4].map((tag) => (
                      <span
                        key={tag}
                        className="border border-[#183027]/20 px-3 py-2 text-[10px] tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#183027] page-section text-white">
        <div className="mx-auto max-w-[1220px]">
          <SectionTitle en="Our Process">調べる、描く、つくる、育てる。</SectionTitle>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Listen", "対話と調査"],
              ["02", "Envision", "未来像の構想"],
              ["03", "Create", "設計と実装"],
              ["04", "Nurture", "運営と改善"],
            ].map((p) => (
              <div key={p[0]} className="border-t border-white/30 pt-5">
                <span className="text-xs text-white/40">{p[0]}</span>
                <p className="mt-8 font-serif text-2xl">{p[1]}</p>
                <p className="mt-2 text-xs tracking-wider text-white/60">{p[2]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function CompanyPage() {
  const info = [
    ["社名", "株式会社AONA（AONA Inc.）"],
    ["設立", "2013年6月12日"],
    ["代表者", "代表取締役　青木 直人"],
    ["資本金", "3,000万円"],
    ["所在地", "〒150-0001 東京都渋谷区神宮前4-12-8 AONA PLACE"],
    ["事業内容", "地域共創事業、建築・空間デザイン、環境戦略コンサルティング"],
    ["従業員数", "42名（2025年4月現在）"],
    ["登録", "一級建築士事務所 東京都知事登録 第00000号"],
  ];
  return (
    <section className="page-section">
      <div className="mx-auto grid max-w-[1220px] gap-16 lg:grid-cols-[.55fr_1fr]">
        <SectionTitle en="Profile">会社概要</SectionTitle>
        <dl className="border-t border-[#183027]/20">
          {info.map((row) => (
            <div
              key={row[0]}
              className="grid gap-2 border-b border-[#183027]/15 py-6 text-sm sm:grid-cols-[140px_1fr]"
            >
              <dt className="text-[#183027]/45">{row[0]}</dt>
              <dd className="leading-7">{row[1]}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="mx-auto mt-28 max-w-[1220px]">
        <SectionTitle en="History">沿革</SectionTitle>
        <div className="mt-12 border-l border-[#183027]/20 pl-7">
          {[
            ["2013", "東京・神宮前にAONA設立"],
            ["2016", "地域共創プログラム「LOCAL CANVAS」開始"],
            ["2019", "環境デザイン部門を新設"],
            ["2022", "長野サテライトオフィス開設"],
            ["2024", "環境配慮型プロジェクト累計50件を達成"],
          ].map((h) => (
            <div key={h[0]} className="grid gap-2 pb-10 sm:grid-cols-[100px_1fr]">
              <span className="font-serif text-xl text-[#987a4e]">{h[0]}</span>
              <p className="text-sm">{h[1]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LoadState({ error, loading }: { error: boolean; loading: boolean }) {
  if (error)
    return <p className="py-7 text-sm text-[#183027]/45">データを読み込めませんでした。</p>;
  if (loading) return <p className="py-7 text-sm text-[#183027]/45">読み込み中…</p>;
  return null;
}

function ProjectsPage() {
  const [filter, setFilter] = useState("すべて");
  const { data: projects = [], error } = useApi<Project[]>("/projects");
  const shown =
    filter === "すべて" ? projects : projects.filter((project) => project.category === filter);
  return (
    <section className="page-section">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-12 flex flex-wrap gap-3">
          {["すべて", "地域共創", "空間デザイン", "環境戦略"].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`${filter === f ? "bg-[#183027] text-white" : "border border-[#183027]/20"} px-5 py-3 text-xs tracking-wider`}
            >
              {f}
            </button>
          ))}
        </div>
        <LoadState error={error} loading={!error && projects.length === 0} />
        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
          {shown.map((p, i) => (
            <article key={p.id} className={i % 2 ? "md:mt-20" : ""}>
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={p.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>
              <p className="mt-5 text-[10px] tracking-widest text-[#987a4e]">
                {p.category} / {p.year}　/　{p.location}
              </p>
              <h2 className="mt-3 text-2xl tracking-wider">{p.title}</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#183027]/60">{p.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsPage() {
  const [filter, setFilter] = useState("すべて");
  const { data: articles, error } = useApi<News[]>("/news");
  const shown =
    filter === "すべて" ? articles : articles?.filter((a) => a.category === filter);
  return (
    <section className="page-section">
      <div className="mx-auto max-w-[1040px]">
        <div className="mb-10 flex flex-wrap gap-2">
          {["すべて", "お知らせ", "プロジェクト", "採用情報", "メディア"].map((f) => (
            <button
              onClick={() => setFilter(f)}
              key={f}
              className={`${filter === f ? "bg-[#183027] text-white" : "border border-[#183027]/20"} px-4 py-2 text-[11px] tracking-wider`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="divide-y divide-[#183027]/15 border-y border-[#183027]/15">
          <LoadState error={error} loading={!error && !articles} />
          {shown?.map((a) => (
            <article key={a.id} className="grid gap-3 py-7 sm:grid-cols-[110px_110px_1fr]">
              <time dateTime={a.date} className="text-sm text-[#183027]/45">
                {formatDate(a.date)}
              </time>
              <span className="text-[10px] tracking-wider text-[#987a4e]">{a.category}</span>
              <h2 className="text-sm leading-6">{a.title}</h2>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SustainabilityPage() {
  return (
    <>
      <div className="relative h-[48vh] min-h-96 text-white">
        <img
          src={image.forest}
          alt="上空から見た緑豊かな森"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 grid place-items-center bg-[#12291f]/40 px-6 text-center">
          <p className="text-2xl font-light leading-[1.8] tracking-wider sm:text-4xl">
            自然と人の豊かさを、
            <br />
            同じ指標で考える。
          </p>
        </div>
      </div>
      <section className="page-section">
        <div className="mx-auto max-w-[1220px]">
          <SectionTitle en="AONA 2030">2030年に向けた、3つの約束</SectionTitle>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              [
                "01",
                "環境再生",
                "全プロジェクトで生物多様性への影響を評価し、自然を減らさない設計を実現。",
                "Nature Positive",
              ],
              [
                "02",
                "地域循環",
                "プロジェクト費用の50%以上を、地域の人材・素材・事業者へ還元。",
                "50% Local",
              ],
              ["03", "ネットゼロ", "事業活動と設計建築物の運用由来CO₂を実質ゼロへ。", "Net Zero"],
            ].map((g) => (
              <div key={g[0]} className="border-t border-[#183027]/30 pt-6">
                <span className="font-serif text-[#987a4e]">{g[0]}</span>
                <h3 className="mt-9 text-2xl">{g[1]}</h3>
                <p className="mt-5 text-sm leading-7 text-[#183027]/60">{g[2]}</p>
                <p className="mt-8 font-serif text-3xl text-[#183027]/20">{g[3]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function CareersPage() {
  return (
    <>
      <div className="px-6 pt-12 sm:px-10 lg:px-16">
        <img
          src={image.careers}
          alt="対話しながら働くチーム"
          className="mx-auto h-[45vh] min-h-80 w-full max-w-[1320px] object-cover"
        />
      </div>
      <section className="page-section">
        <div className="mx-auto grid max-w-[1220px] gap-14 lg:grid-cols-2">
          <SectionTitle en="Message">
            専門を越えて、
            <br />
            未来を構想する人へ。
          </SectionTitle>
          <div>
            <p className="text-sm leading-8 text-[#183027]/65">
              AONAには、建築家、ランドスケープデザイナー、リサーチャー、事業プロデューサーなど、異なる専門性を持つ仲間が集まっています。
            </p>
            <p className="mt-5 text-sm leading-8 text-[#183027]/65">
              必要なのは、完成された答えではなく、知らないことに向き合う好奇心。地域の人々と同じ目線に立ち、対話し、手を動かせる方を待っています。
            </p>
          </div>
        </div>
        <div className="mx-auto mt-24 max-w-[1220px]">
          <SectionTitle en="Open Positions">募集職種</SectionTitle>
          <div className="mt-10 divide-y divide-[#183027]/15 border-y border-[#183027]/15">
            {[
              "プロジェクトデザイナー（中途）",
              "地域プロデューサー（中途）",
              "デザインリサーチャー（新卒）",
            ].map((job) => (
              <a href="#/contact" key={job} className="flex items-center justify-between py-7">
                <span className="text-sm tracking-wider">{job}</span>
                <span>→</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSending(true);
    setErrors({});
    setFormError("");
    try {
      await api("/contact", {
        method: "POST",
        body: { ...Object.fromEntries(form), agreed: form.get("agreed") === "on" },
      });
      setSent(true);
      window.scrollTo({ top: 100, behavior: "smooth" });
    } catch (e) {
      const err = e instanceof ApiError ? e : new ApiError(0);
      setErrors(err.errors);
      setFormError(Object.keys(err.errors).length ? "入力内容をご確認ください。" : err.message);
    } finally {
      setSending(false);
    }
  }
  const fieldError = (name: string) =>
    errors[name] && <span className="mt-2 block text-xs text-[#b5482f]">{errors[name]}</span>;
  if (sent)
    return (
      <section className="page-section">
        <div className="mx-auto max-w-2xl py-20 text-center">
          <p className="font-serif text-6xl text-[#987a4e]">Thank you.</p>
          <h2 className="mt-8 text-2xl tracking-wider">お問い合わせを受け付けました</h2>
          <p className="mt-5 text-sm leading-7 text-[#183027]/60">
            内容を確認のうえ、通常3営業日以内に担当者よりご連絡いたします。
          </p>
          <button
            onClick={() => setSent(false)}
            className="mt-10 border-b border-[#183027] pb-2 text-xs tracking-wider"
          >
            フォームへ戻る
          </button>
        </div>
      </section>
    );
  return (
    <section className="page-section">
      <div className="mx-auto grid max-w-[1100px] gap-16 lg:grid-cols-[.6fr_1fr]">
        <div>
          <p className="text-sm leading-8 text-[#183027]/65">
            プロジェクトのご相談、協業、取材、採用について、こちらからお問い合わせください。
          </p>
          <div className="mt-10 border-t border-[#183027]/15 pt-6">
            <p className="text-[10px] uppercase tracking-widest text-[#183027]/40">Email</p>
            <p className="mt-2 text-sm">hello@aona.jp</p>
            <p className="mt-7 text-[10px] uppercase tracking-widest text-[#183027]/40">
              Office Hours
            </p>
            <p className="mt-2 text-sm">平日 10:00–18:00</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-7">
          {[
            ["会社名", "company", "株式会社AONA"],
            ["お名前 *", "name", "青木 太郎"],
            ["メールアドレス *", "email", "hello@example.com"],
            ["電話番号", "tel", "03-0000-0000"],
          ].map((f) => (
            <label key={f[1]} className="block">
              <span className="text-xs tracking-wider">{f[0]}</span>
              <input
                name={f[1]}
                required={f[0].includes("*")}
                type={f[1] === "email" ? "email" : f[1] === "tel" ? "tel" : "text"}
                placeholder={f[2]}
                className="mt-3 w-full border-b border-[#183027]/25 bg-transparent px-0 py-3 text-sm outline-none transition-colors placeholder:text-[#183027]/25 focus:border-[#183027]"
              />
              {fieldError(f[1])}
            </label>
          ))}
          <label className="block">
            <span className="text-xs tracking-wider">お問い合わせ種別 *</span>
            <select
              name="category"
              required
              className="mt-3 w-full border-b border-[#183027]/25 bg-transparent py-3 text-sm outline-none"
            >
              <option>プロジェクトのご相談</option>
              <option>協業・パートナーシップ</option>
              <option>採用について</option>
              <option>取材・その他</option>
            </select>
            {fieldError("category")}
          </label>
          <label className="block">
            <span className="text-xs tracking-wider">お問い合わせ内容 *</span>
            <textarea
              name="message"
              required
              rows={6}
              maxLength={5000}
              className="mt-3 w-full border border-[#183027]/25 bg-transparent p-4 text-sm outline-none focus:border-[#183027]"
            />
            {fieldError("message")}
          </label>
          <label className="flex items-start gap-3 text-xs leading-6">
            <input name="agreed" required type="checkbox" className="mt-1" />
            <span>
              <a href="#/privacy" className="border-b border-[#183027]/40">
                プライバシーポリシー
              </a>
              に同意する
              {fieldError("agreed")}
            </span>
          </label>
          {/* スパム対策のハニーポット。人には見えず、ボットだけが入力する */}
          <input
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-px w-px opacity-0"
          />
          {formError && (
            <p role="alert" className="text-sm text-[#b5482f]">
              {formError}
            </p>
          )}
          <button
            type="submit"
            disabled={sending}
            className="flex w-full items-center justify-between bg-[#183027] px-7 py-5 text-sm tracking-wider text-white transition-colors hover:bg-[#294b3e] disabled:opacity-60"
          >
            {sending ? "送信中…" : "入力内容を送信する"} <span>→</span>
          </button>
        </form>
      </div>
    </section>
  );
}

function PrivacyPage() {
  return (
    <section className="page-section">
      <div className="mx-auto max-w-3xl space-y-10 text-sm leading-8 text-[#183027]/65">
        <p>株式会社AONAは、お客さまの個人情報を適切に保護し、以下の方針に基づいて取り扱います。</p>
        {[
          [
            "1. 個人情報の利用目的",
            "お問い合わせへの回答、サービスのご案内、採用選考および当社サービスの改善のために利用します。",
          ],
          [
            "2. 第三者への提供",
            "法令に基づく場合を除き、ご本人の同意なく個人情報を第三者へ提供しません。",
          ],
          [
            "3. お問い合わせ窓口",
            "個人情報に関するお問い合わせは、hello@aona.jp までご連絡ください。",
          ],
        ].map((p) => (
          <div key={p[0]}>
            <h2 className="text-lg text-[#183027]">{p[0]}</h2>
            <p className="mt-3">{p[1]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ContentPage({ route }: { route: string }) {
  const content: Record<string, React.ReactNode> = {
    about: <AboutPage />,
    business: <BusinessPage />,
    company: <CompanyPage />,
    contact: <ContactPage />,
    projects: <ProjectsPage />,
    news: <NewsPage />,
    careers: <CareersPage />,
    sustainability: <SustainabilityPage />,
    privacy: <PrivacyPage />,
  };
  const actualRoute = content[route] ? route : "about";
  return (
    <main>
      <PageHero route={content[route] ? route : "about"} />
      {content[actualRoute]}
    </main>
  );
}
