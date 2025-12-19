import type { Direction } from "../types";

export function computeDirection(params: { address: string; from: string; to: string }): Direction {
  const a = params.address.toLowerCase();
  const from = params.from.toLowerCase();
  const to = params.to.toLowerCase();

  const isFrom = from === a;
  const isTo = to === a;

  if (isFrom && isTo) return "self";
  if (isTo) return "in";
  if (isFrom) return "out";
  throw new Error("Tx does not involve the target address");
}

export function computeCounterparty(params: { address: string; from: string; to: string; direction: Direction }): string {
  const a = params.address.toLowerCase();
  const from = params.from.toLowerCase();
  const to = params.to.toLowerCase();

  if (params.direction === "in") return from;
  if (params.direction === "out") return to;
  return a; // self
}
