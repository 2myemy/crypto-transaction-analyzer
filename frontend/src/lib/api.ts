import type { AnalyzeResponse, RangeKey, Chain } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE ?? ""; // ex) https://<heroku-app>.herokuapp.com

export async function fetchAnalyze(params: { chain: Chain; address: string; range: RangeKey }) {
  const qs = new URLSearchParams({
    chain: params.chain,
    address: params.address,
    range: params.range,
  });

  const res = await fetch(`${API_BASE}/api/analyze?${qs.toString()}`);

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.error) msg = data.error;
    } catch {}
    throw new Error(msg);
  }

  return (await res.json()) as AnalyzeResponse;
}
