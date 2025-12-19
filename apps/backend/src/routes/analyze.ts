import { Router } from "express";
import type { AnalyzeResponse, RangeKey } from "../../../../packages/shared/src/types";

const router = Router();

function isLikelyEthAddress(input: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(input.trim());
}
function toRangeKey(v: any): RangeKey {
  if (v === "7d" || v === "30d" || v === "90d") return v;
  return "30d";
}

router.get("/analyze", (req, res) => {
  const chain = String(req.query.chain ?? "eth");
  const address = String(req.query.address ?? "").trim();
  const range = toRangeKey(req.query.range);

  if (chain !== "eth") return res.status(400).json({ error: "Only chain=eth is supported in MVP." });
  if (!isLikelyEthAddress(address)) return res.status(400).json({ error: "Invalid address. Must be a 0x address with 40 hex chars." });

  const now = Math.floor(Date.now() / 1000);

  const payload: AnalyzeResponse = {
    summary: { txCount: 3, activeDays: 2, totalInETH: "0.5000", totalOutETH: "0.1200" },
    timeseries: [
      { date: "2025-12-18", txCount: 1, inCount: 1, outCount: 0 },
      { date: "2025-12-19", txCount: 2, inCount: 0, outCount: 1 },
    ],
    topCounterparties: [
      { address: "0x1111111111111111111111111111111111111111", txCount: 1, totalInETH: "0.5000", totalOutETH: "0.0000" },
      { address: "0x3333333333333333333333333333333333333333", txCount: 1, totalInETH: "0.0000", totalOutETH: "0.1200" },
    ],
    transactions: [
      {
        type: "NATIVE_TRANSFER",
        hash: "0x" + "a".repeat(64),
        timestamp: now - 3600 * 2,
        from: "0x1111111111111111111111111111111111111111",
        to: address.toLowerCase(),
        direction: "in",
        assetSymbol: "ETH",
        amount: "0.50",
        gasFeeETH: "0.0012",
        status: "success",
        counterparty: "0x1111111111111111111111111111111111111111",
      },
      {
        type: "CONTRACT_INTERACTION",
        hash: "0x" + "b".repeat(64),
        timestamp: now - 3600 * 10,
        from: address.toLowerCase(),
        to: "0x2222222222222222222222222222222222222222",
        direction: "out",
        assetSymbol: "ETH",
        amount: "0",
        gasFeeETH: "0.0030",
        status: "success",
        counterparty: "0x2222222222222222222222222222222222222222",
      },
      {
        type: "NATIVE_TRANSFER",
        hash: "0x" + "c".repeat(64),
        timestamp: now - 3600 * 30,
        from: address.toLowerCase(),
        to: "0x3333333333333333333333333333333333333333",
        direction: "out",
        assetSymbol: "ETH",
        amount: "0.12",
        gasFeeETH: "0.0010",
        status: "success",
        counterparty: "0x3333333333333333333333333333333333333333",
      },
    ],
    metadata: { chain: "eth", range, dataSource: "Alchemy", cached: false },
  };

  res.json(payload);
});

export default router;
