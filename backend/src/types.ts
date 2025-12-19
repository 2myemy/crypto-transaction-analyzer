export type Chain = "eth";
export type RangeKey = "7d" | "30d" | "90d";

export type EventType = "NATIVE_TRANSFER" | "TOKEN_TRANSFER" | "CONTRACT_INTERACTION";
export type Direction = "in" | "out" | "self";
export type TxStatus = "success" | "fail";

export type NormalizedEvent = {
  type: EventType;
  hash: string;
  timestamp: number; // unix seconds
  from: string;
  to: string;
  direction: Direction;
  assetSymbol: string; // "ETH" or token symbol
  amount: string; // decimal string
  gasFeeETH: string; // decimal string
  status: TxStatus;
  counterparty: string; // in이면 from, out이면 to, self면 address(또는 to/from 중 하나 선택)
};

export type Summary = {
  txCount: number;
  activeDays: number;
  totalInETH: string;
  totalOutETH: string;
};

export type TimeSeriesPoint = {
  date: string; // "YYYY-MM-DD"
  txCount: number;
  inCount: number;
  outCount: number;
};

export type CounterpartyRow = {
  address: string;
  label?: string;
  txCount: number;
  totalInETH: string;
  totalOutETH: string;
};

export type AnalyzeResponse = {
  summary: Summary;
  timeseries: TimeSeriesPoint[];
  topCounterparties: CounterpartyRow[];
  transactions: NormalizedEvent[];
  metadata: {
    chain: Chain;
    range: RangeKey;
    dataSource: "Alchemy";
    cached: boolean;
  };
};
