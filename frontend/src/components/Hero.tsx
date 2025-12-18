import { useMemo, useState } from "react";

type Props = {
  onAnalyze?: (addressOrEns: string) => void;
};

function isLikelyEthAddress(input: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(input.trim());
}

function isLikelyEns(input: string) {
  return input.trim().toLowerCase().endsWith(".eth");
}

export default function Hero({ onAnalyze }: Props) {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

  const status = useMemo(() => {
    const v = value.trim();
    if (!touched || v.length === 0) return { kind: "idle" as const, msg: "" };
    if (isLikelyEthAddress(v) || isLikelyEns(v)) return { kind: "ok" as const, msg: "Looks valid." };
    return { kind: "err" as const, msg: "Enter a valid 0x address (40 hex chars) or an ENS name (.eth)." };
  }, [value, touched]);

  const canSubmit = status.kind !== "err" && value.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    onAnalyze?.(value.trim());
  };

  return (
    <section className="relative overflow-hidden bg-[#0B0F14] text-slate-200">
      {/* subtle background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(46,242,199,0.08),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(125,211,252,0.07),transparent_55%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#121820] ring-1 ring-white/10">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(46,242,199,0.45)]" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Crypto Transaction Analyzer</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-300">
            <a
              href="#"
              className="hidden rounded-xl px-3 py-2 hover:bg-white/5 sm:inline-block"
            >
              Docs
            </a>
            <a
              href="#"
              className="rounded-xl px-3 py-2 hover:bg-white/5"
            >
              GitHub
            </a>
          </div>
        </div>

        {/* Hero content */}
        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300 ring-1 ring-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Ethereum Mainnet · Alchemy API
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
              Analyze Ethereum wallet activity.
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300">
              Turn raw on-chain transactions into clear insights: inflows/outflows, counterparties,
              and behavior patterns — built for analysis, not speculation.
            </p>

            {/* Address input */}
            <div className="mt-7">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={() => setTouched(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setTouched(true);
                        submit();
                      }
                    }}
                    placeholder="Enter wallet address (0x...) or ENS (vitalik.eth)"
                    className={[
                      "w-full rounded-2xl bg-[#121820] px-4 py-3 text-sm text-slate-100",
                      "ring-1 ring-white/10 outline-none",
                      "placeholder:text-slate-500",
                      status.kind === "err" ? "ring-rose-500/50" : "focus:ring-emerald-400/30",
                    ].join(" ")}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <span
                      className={[
                        "text-xs",
                        status.kind === "ok" ? "text-emerald-400" : status.kind === "err" ? "text-rose-400" : "text-slate-500",
                      ].join(" ")}
                    >
                      {status.kind === "ok" ? "✓" : status.kind === "err" ? "!" : ""}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setTouched(true);
                    submit();
                  }}
                  disabled={!canSubmit}
                  className={[
                    "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold",
                    "bg-emerald-400 text-[#061014]",
                    "shadow-[0_0_30px_rgba(46,242,199,0.20)]",
                    "transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40",
                  ].join(" ")}
                >
                  Analyze
                </button>
              </div>

              <p
                className={[
                  "mt-2 text-xs",
                  status.kind === "err" ? "text-rose-300" : status.kind === "ok" ? "text-emerald-300/80" : "text-slate-500",
                ].join(" ")}
              >
                {status.msg || "Tip: Try an Ethereum address like 0x… or an ENS name ending with .eth"}
              </p>
            </div>

            {/* Trust row */}
            <div className="mt-7 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">No wallet connection required</span>
              <span className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">Server-side API key</span>
              <span className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">Read-only analytics</span>
            </div>
          </div>

          {/* Right: Preview card */}
          <div className="rounded-3xl bg-[#121820] p-6 ring-1 ring-white/10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-400">Preview</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-50">Wallet Overview</h3>
              </div>
              <div className="rounded-2xl bg-white/5 px-3 py-2 text-xs text-slate-300 ring-1 ring-white/10">
                Last 30 days
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Tx Count", value: "128" },
                { label: "Total In", value: "4.62 ETH" },
                { label: "Total Out", value: "3.97 ETH" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-[#0F141B] p-4 ring-1 ring-white/10"
                >
                  <p className="text-xs text-slate-400">{item.label}</p>
                  <p className="mt-1 text-base font-semibold text-slate-50">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl bg-[#0F141B] p-4 ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">Activity</p>
                <p className="text-xs text-emerald-300/80">+12% vs prev.</p>
              </div>

              {/* fake mini chart */}
              <div className="mt-3 grid grid-cols-12 items-end gap-1">
                {[6, 10, 8, 12, 9, 14, 16, 10, 12, 18, 14, 20].map((h, i) => (
                  <div
                    key={i}
                    className="rounded-md bg-emerald-400/70"
                    style={{ height: `${h * 4}px` }}
                    aria-hidden="true"
                  />
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>In/Out ratio</span>
                <span className="text-slate-200">54% / 46%</span>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-[#0F141B] p-4 ring-1 ring-white/10">
              <p className="text-xs text-slate-400">Top Counterparty</p>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-white/5 ring-1 ring-white/10" />
                  <div>
                    <p className="text-sm font-medium text-slate-50">0x7a…9c3D</p>
                    <p className="text-xs text-slate-400">14 interactions</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300 ring-1 ring-emerald-400/20">
                  Frequent
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              This is a UI preview. Real values will appear after analysis.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
