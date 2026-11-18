import { type ReactNode, useState } from "react";

const navigation = [
  { label: "私たちについて", route: "about" },
  { label: "事業紹介", route: "business" },
  { label: "プロジェクト", route: "projects" },
  { label: "サステナビリティ", route: "sustainability" },
  { label: "ニュース", route: "news" },
];

function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 20 20">
      <path
        d={diagonal ? "M5 15 15 5M8 5h7v7" : "M3 10h13M11 5l5 5-5 5"}
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

export default function SiteLayout({
  children,
  isHome,
  route,
}: {
  children: ReactNode;
  isHome: boolean;
  route: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const lightHeader = isHome;

  return (
    <div className="min-h-screen bg-[#f3f1eb] text-[#183027]">
      <header
        className={`${lightHeader ? "absolute border-white/20 text-white" : "relative border-[#183027]/15 bg-[#f3f1eb] text-[#183027]"} inset-x-0 top-0 z-40 flex h-24 items-center justify-between border-b px-6 sm:px-10 lg:px-16`}
      >
        <a href="#/" className="group flex items-center gap-3" aria-label="AONA ホーム">
          <span
            className={`${lightHeader ? "border-white/70 group-hover:bg-white group-hover:text-[#173228]" : "border-[#183027]/60 group-hover:bg-[#183027] group-hover:text-white"} grid h-9 w-9 place-items-center border transition-colors`}
          >
            <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
              <path d="M4 18 12 4l8 14M7.3 13h9.4" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </span>
          <span className="text-[19px] font-medium tracking-[0.24em]">AONA</span>
        </a>

        <nav className="hidden items-center gap-8 xl:flex" aria-label="メインナビゲーション">
          {navigation.map((item) => (
            <a
              key={item.route}
              href={`#/${item.route}`}
              className={`${route === item.route ? "opacity-100" : "opacity-75"} text-[12px] tracking-[0.07em] transition-opacity hover:opacity-100`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <span className="text-[10px] tracking-widest opacity-60">JP / EN</span>
          <a
            href="#/contact"
            className={`${lightHeader ? "border-white/60 hover:bg-white hover:text-[#173228]" : "border-[#183027]/50 hover:bg-[#183027] hover:text-white"} flex items-center gap-5 border px-5 py-3 text-xs tracking-[0.14em] transition-colors`}
          >
            お問い合わせ
            <ArrowIcon />
          </a>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
          className="relative grid h-11 w-11 place-items-center border border-current/50 xl:hidden"
        >
          <span className="flex w-5 flex-col gap-1.5">
            <span
              className={`h-px w-full bg-current transition-transform ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-full bg-current transition-transform ${menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </header>

      <div
        className={`fixed inset-0 z-30 bg-[#142820] px-6 pb-10 pt-28 text-white transition-all duration-500 xl:hidden ${
          menuOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-5 opacity-0"
        }`}
      >
        <nav className="mx-auto flex max-w-xl flex-col">
          {navigation.map((item, index) => (
            <a
              key={item.route}
              href={`#/${item.route}`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between border-b border-white/15 py-5 text-base tracking-wider"
            >
              <span>
                <span className="mr-5 font-serif text-xs text-white/40">0{index + 1}</span>
                {item.label}
              </span>
              <ArrowIcon />
            </a>
          ))}
          <a
            href="#/company"
            onClick={() => setMenuOpen(false)}
            className="border-b border-white/15 py-5 text-base tracking-wider"
          >
            会社情報
          </a>
          <a
            href="#/careers"
            onClick={() => setMenuOpen(false)}
            className="border-b border-white/15 py-5 text-base tracking-wider"
          >
            採用情報
          </a>
          <a
            href="#/contact"
            onClick={() => setMenuOpen(false)}
            className="mt-8 flex items-center justify-between border border-white/50 px-5 py-4 text-sm"
          >
            お問い合わせ
            <ArrowIcon />
          </a>
        </nav>
      </div>

      {children}

      <footer className="bg-[#142820] px-6 pb-8 pt-20 text-white sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <div className="grid gap-16 border-b border-white/15 pb-16 lg:grid-cols-[1.1fr_2fr]">
            <div>
              <a href="#/" className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center border border-white/60">
                  <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <path d="M4 18 12 4l8 14M7.3 13h9.4" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                </span>
                <span className="text-xl tracking-[0.24em]">AONA</span>
              </a>
              <p className="mt-6 text-sm font-light leading-7 tracking-wider text-white/60">
                想いを、未来の景色に。
                <br />
                人と自然がともに豊かになる社会をつくります。
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-5 text-sm sm:grid-cols-3">
              {[
                ...navigation,
                { label: "会社情報", route: "company" },
                { label: "採用情報", route: "careers" },
                { label: "お問い合わせ", route: "contact" },
              ].map((item) => (
                <a
                  key={item.route}
                  href={`#/${item.route}`}
                  className="flex items-center justify-between border-b border-white/10 pb-3 text-white/75 hover:text-white"
                >
                  {item.label}
                  <ArrowIcon diagonal />
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 pt-7 text-[10px] tracking-wider text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2025 AONA Inc.</p>
            <div className="flex gap-6">
              <a href="#/privacy">プライバシーポリシー</a>
              <span>東京都渋谷区神宮前 4-12-8</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
