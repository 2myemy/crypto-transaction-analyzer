import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { AnalyzeResponse, RangeKey } from "../../../../packages/shared/src/types";
import { fetchAnalyze } from "../lib/api";

type ViewState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "empty" }
  | { kind: "error"; message: string }
  | { kind: "success"; data: AnalyzeResponse };

function isLikelyEthAddress(input: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(input.trim());
}
function toRangeKey(v: string | null): RangeKey {
  if (v === "7d" || v === "30d" || v === "90d") return v;
  return "30d";
}
function short(s: string) {
  return s.slice(0, 6) + "…" + s.slice(-4);
}

export default function Dashboard() {
  const [sp, setSp] = useSearchParams();
  const address = (sp.get("address") ?? "").trim();
  const range = toRangeKey(sp.get("range"));

  const valid = useMemo(() => (address ? isLikelyEthAddress(address) : false), [address]);
  const [state, setState] = useState<ViewState>(() => (address ? { kind: "loading" } : { kind: "idle" }));

  useEffect(() => {
    if (!address) return setState({ kind: "idle" });
    if (!valid) return setState({ kind: "error", message: "Invalid address. Must be a 0x address with 40 hex chars." });

    let cancelled = false;
    setState({ kind: "loading" });

    fetchAnalyze({ chain: "eth", address, range })
      .then((data) => {
        if (cancelled) return;
        if (!data.transactions?.length) setState({ kind: "empty" });
        else setState({ kind: "success", data });
      })
      .catch((e: any) => {
        if (cancelled) return;
        setState({ kind: "error", message: e?.message ?? "Unknown error" });
      });

    return () => {
      cancelled = true;
    };
  }, [address, range, valid]);

  const setRange = (rk: RangeKey) => {
    const next = new URLSearchParams(sp);
    next.set("range", rk);
    setSp(next, { replace: true });
  };

  const retry = async () => {
    if (!address || !valid) return;
    setState({ kind: "loading" });
    try {
      const data = await fetchAnalyze({ chain: "eth", address, range });
      if (!data.transactions?.length) setState({ kind: "empty" });
      else setState({ kind: "success", data });
    } catch (e: any) {
      setState({ kind: "error", message: e?.message ?? "Unknown error" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-slate-200">
      <header className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 hover:bg-white/5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(46,242,199,0.45)]" />
            <span className="text-sm font-semibold tracking-tight">Crypto Transaction Analyzer</span>
          </Link>

          <div className="flex items-center gap-2">
            <Pill active={range === "7d"} onClick={() => setRange("7d")}>7d</Pill>
            <Pill active={range === "30d"} onClick={() => setRange("30d")}>30d</Pill>
            <Pill active={range === "90d"} onClick={() => setRange("90d")}>90d</Pill>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-400">
            {address ? (
              <>Address: <span className="text-slate-200">{address}</span></>
            ) : (
              <>No address provided.</>
            )}
          </div>
          <div className="text-xs text-slate-500">
            Ethereum Mainnet · Alchemy · {range}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-16">
        {state.kind === "idle" && <Panel title="Dashboard"><Idle /></Panel>}
        {state.kind === "loading" && <Loading />}
        {state.kind === "empty" && <Panel title="No Transactions"><Empty /></Panel>}
        {state.kind === "error" && <Panel title="Error"><Err message={state.message} onRetry={retry} /></Panel>}
        {state.kind === "success" && <Success data={state.data} />}
      </main>
    </div>
  );
}

function Pill({ active, onClick, children }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full px-3 py-1 text-xs ring-1 transition",
        active ? "bg-emerald-400/10 text-emerald-200 ring-emerald-400/20" : "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Panel({ title, children }: any) {
  return (
    <section className="rounded-3xl bg-[#121820] p-6 ring-1 ring-white/10">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-50">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Idle() {
  return (
    <div className="rounded-2xl bg-[#0F141B] p-6 ring-1 ring-white/10">
      <p className="text-sm text-slate-300">No wallet analyzed yet.</p>
      <p className="mt-2 text-xs text-slate-500">Go back and enter a 0x address.</p>
      <Link to="/" className="mt-4 inline-flex rounded-2xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-[#061014] hover:brightness-110">
        Back
      </Link>
    </div>
  );
}

function Empty() {
  return (
    <div className="rounded-2xl bg-[#0F141B] p-6 ring-1 ring-white/10">
      <p className="text-sm text-slate-300">No transactions found in this range.</p>
      <p className="mt-2 text-xs text-slate-500">Try 90d or verify the address.</p>
    </div>
  );
}

function Err({ message, onRetry }: any) {
  return (
    <div className="rounded-2xl bg-[#0F141B] p-6 ring-1 ring-rose-500/20">
      <p className="text-sm text-rose-200">{message}</p>
      <p className="mt-2 text-xs text-slate-500">If rate-limited, wait a bit and retry.</p>
      <div className="mt-4 flex gap-2">
        <button onClick={onRetry} className="rounded-2xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-[#061014] hover:brightness-110">
          Retry
        </button>
        <Link to="/" className="rounded-2xl bg-white/5 px-4 py-2 text-sm ring-1 ring-white/10 hover:bg-white/10">
          Back
        </Link>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Skel h="h-20" /><Skel h="h-20" /><Skel h="h-20" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skel h="h-64" /><Skel h="h-64" />
      </div>
      <Skel h="h-80" />
    </div>
  );
}
function Skel({ h }: any) {
  return <div className={`${h} animate-pulse rounded-3xl bg-[#121820] ring-1 ring-white/10`} />;
}

function Success({ data }: { data: AnalyzeResponse }) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card label="Tx Count" value={String(data.summary.txCount)} />
        <Card label="Total In (ETH)" value={`${data.summary.totalInETH} ETH`} />
        <Card label="Total Out (ETH)" value={`${data.summary.totalOutETH} ETH`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title={`Time Series · ${data.metadata.range} · ${data.metadata.cached ? "cached" : "live"}`}>
          <div className="space-y-2">
            {data.timeseries.slice(-10).map((p) => (
              <div key={p.date} className="flex items-center justify-between rounded-2xl bg-[#0F141B] px-4 py-2 ring-1 ring-white/10">
                <span className="text-xs text-slate-400">{p.date}</span>
                <span className="text-xs text-slate-200">{p.txCount} tx</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Top Counterparties">
          <div className="space-y-2">
            {data.topCounterparties.slice(0, 10).map((c) => (
              <div key={c.address} className="flex items-center justify-between rounded-2xl bg-[#0F141B] px-4 py-2 ring-1 ring-white/10">
                <div>
                  <p className="text-sm text-slate-100">{short(c.address)}</p>
                  <p className="text-xs text-slate-500">{c.txCount} interactions</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-300">In {c.totalInETH} ETH</p>
                  <p className="text-xs text-slate-500">Out {c.totalOutETH} ETH</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Transactions">
        <div className="overflow-x-auto rounded-2xl ring-1 ring-white/10">
          <table className="min-w-full bg-[#0F141B] text-left text-sm">
            <thead className="text-xs text-slate-400">
              <tr className="border-b border-white/10">
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Dir</th>
                <th className="px-4 py-3">Asset</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Counterparty</th>
                <th className="px-4 py-3">Tx</th>
              </tr>
            </thead>
            <tbody>
              {data.transactions.slice(0, 50).map((t) => (
                <tr key={t.hash} className="border-b border-white/5">
                  <td className="px-4 py-3 text-xs text-slate-400">{new Date(t.timestamp * 1000).toLocaleString()}</td>
                  <td className="px-4 py-3">{t.direction}</td>
                  <td className="px-4 py-3">{t.assetSymbol}</td>
                  <td className="px-4 py-3">{t.amount}</td>
                  <td className="px-4 py-3 text-slate-300">{short(t.counterparty)}</td>
                  <td className="px-4 py-3">
                    <a className="text-emerald-300 hover:underline" href={`https://etherscan.io/tx/${t.hash}`} target="_blank" rel="noreferrer">
                      {short(t.hash)}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function Card({ label, value }: any) {
  return (
    <div className="rounded-3xl bg-[#121820] p-5 ring-1 ring-white/10">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-50">{value}</p>
    </div>
  );
}
