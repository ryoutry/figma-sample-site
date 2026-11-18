import { formatDate, type News, useApi } from "../api";

const images = {
  hero: "https://images.unsplash.com/photo-1713889594329-3b72f44fb360?auto=format&fit=crop&w=2400&q=88",
  community:
    "https://images.unsplash.com/photo-1779689512046-952d3f4cec8b?auto=format&fit=crop&w=1400&q=85",
  village:
    "https://images.unsplash.com/photo-1729669375200-9008ea007cdd?auto=format&fit=crop&w=1400&q=85",
  forest:
    "https://images.unsplash.com/photo-1535029522769-6181ef989832?auto=format&fit=crop&w=1400&q=85",
};

function Arrow() {
  return (
    <span aria-hidden="true" className="text-lg font-light">
      →
    </span>
  );
}

export default function HomePage() {
  const news = useApi<News[]>("/news?limit=3");
  return (
    <main>
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pb-20 pt-28 text-center text-white">
        <img
          src={images.hero}
          alt="緑に囲まれた静かな現代建築"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,22,18,.52),rgba(10,22,18,.08)_42%,rgba(10,22,18,.65))]" />
        <div className="relative animate-reveal max-w-5xl">
          <p className="mb-7 text-[10px] uppercase tracking-[0.38em] text-white/70 sm:text-xs">
            Our Philosophy
          </p>
          <h1 className="text-[clamp(2.3rem,6.2vw,5.5rem)] font-light leading-[1.35] tracking-[0.08em]">
            想いを、未来の景色に。
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-sm font-light leading-[2.1] tracking-[0.12em] text-white/85 sm:text-base">
            人と自然、技術と感性。その間にある可能性をひらき、
            <br className="hidden sm:block" />
            次の世代へ続く豊かさを創造します。
          </p>
          <a
            href="#/about"
            className="mx-auto mt-11 flex w-fit items-center gap-5 border-b border-white/55 pb-2 text-xs tracking-[0.18em]"
          >
            私たちの理念 <Arrow />
          </a>
        </div>
        <span className="absolute bottom-9 left-7 hidden -rotate-90 text-[9px] uppercase tracking-[0.3em] text-white/55 sm:block">
          Scroll
        </span>
      </section>

      <section className="px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
        <div className="mx-auto grid max-w-[1220px] gap-14 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <p className="section-label">About AONA</p>
            <p className="mt-5 font-serif text-5xl text-[#183027]/15">01</p>
          </div>
          <div>
            <h2 className="text-[clamp(1.8rem,3.4vw,3.3rem)] font-light leading-[1.65] tracking-[0.08em]">
              つくるのは、建物だけではない。
              <br />
              人と地域の、これからです。
            </h2>
            <p className="mt-9 max-w-2xl text-sm leading-8 tracking-[0.06em] text-[#183027]/65">
              AONAは、地域・空間・環境の視点を横断し、未来の暮らしを構想するデザインカンパニーです。調査・構想から設計、運営まで。地域に眠る価値を、その土地らしい風景へと育てます。
            </p>
            <a href="#/about" className="link-arrow mt-9">
              私たちについて <Arrow />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#e6e7df] px-6 py-28 sm:px-10 lg:px-16 lg:py-36">
        <div className="mx-auto max-w-[1320px]">
          <div className="flex items-end justify-between">
            <div>
              <p className="section-label">Our Business</p>
              <h2 className="mt-4 text-3xl font-light tracking-wider sm:text-5xl">
                未来をつくる、3つの領域
              </h2>
            </div>
            <a href="#/business" className="link-arrow hidden sm:flex">
              事業紹介 <Arrow />
            </a>
          </div>
          <div className="mt-16 grid gap-px bg-[#183027]/15 lg:grid-cols-3">
            {[
              ["01", "地域共創", "地域の声と資源をつなぎ、持続する事業と場所を育てる。"],
              ["02", "空間デザイン", "暮らしと環境に寄り添う建築・ランドスケープを設計する。"],
              ["03", "環境戦略", "自然資本を生かし、企業と地域の循環をデザインする。"],
            ].map((item) => (
              <div key={item[0]} className="bg-[#e6e7df] p-8 lg:min-h-72 lg:p-10">
                <span className="font-serif text-sm text-[#8b704b]">{item[0]}</span>
                <h3 className="mt-16 text-2xl tracking-wider">{item[1]}</h3>
                <p className="mt-5 text-sm leading-7 text-[#183027]/60">{item[2]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-28 sm:px-10 lg:px-16 lg:py-36">
        <div className="mx-auto max-w-[1320px]">
          <div className="flex items-end justify-between">
            <div>
              <p className="section-label">Featured Projects</p>
              <h2 className="mt-4 text-3xl font-light tracking-wider sm:text-5xl">
                風景になった仕事
              </h2>
            </div>
            <a href="#/projects" className="link-arrow hidden sm:flex">
              すべての実績 <Arrow />
            </a>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {[
              ["里山リビング・コモンズ", "長野県 / 地域共創", images.village],
              ["水辺のまち再生プロジェクト", "香川県 / 空間デザイン", images.community],
            ].map((item, i) => (
              <a href="#/projects" key={item[0]} className={`${i ? "md:mt-20" : ""} group block`}>
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item[2]}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-5 text-[10px] tracking-widest text-[#8b704b]">{item[1]}</p>
                <h3 className="mt-2 text-xl tracking-wider">{item[0]}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-32 text-white sm:px-10 lg:px-16">
        <img
          src={images.forest}
          alt="木々の間から差し込む光"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#10241d]/70" />
        <div className="relative mx-auto max-w-[1220px] text-center">
          <p className="text-[10px] uppercase tracking-[.35em] text-white/60">Sustainability</p>
          <h2 className="mt-6 text-3xl font-light leading-relaxed tracking-wider sm:text-5xl">
            自然の循環を、社会の力に。
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-sm font-light leading-8 text-white/70">
            すべてのプロジェクトで、環境と地域へのポジティブな影響を測り、未来へつなげます。
          </p>
          <a
            href="#/sustainability"
            className="mx-auto mt-9 flex w-fit items-center gap-5 border-b border-white/50 pb-2 text-xs tracking-wider"
          >
            取り組みを見る <Arrow />
          </a>
        </div>
      </section>

      <section className="px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1220px]">
          <div className="grid gap-12 lg:grid-cols-[.4fr_1fr]">
            <div>
              <p className="section-label">News</p>
              <h2 className="mt-4 text-4xl font-light">お知らせ</h2>
            </div>
            <div className="divide-y divide-[#183027]/15 border-t border-[#183027]/15">
              {news.error && (
                <p className="py-6 text-sm text-[#183027]/45">お知らせを読み込めませんでした。</p>
              )}
              {news.data?.map((item) => (
                <a
                  href="#/news"
                  key={item.id}
                  className="grid gap-2 py-6 text-sm transition-opacity hover:opacity-60 sm:grid-cols-[110px_100px_1fr]"
                >
                  <span className="text-[#183027]/45">{formatDate(item.date)}</span>
                  <span className="text-[10px] tracking-wider text-[#8b704b]">{item.category}</span>
                  <span>{item.title}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
