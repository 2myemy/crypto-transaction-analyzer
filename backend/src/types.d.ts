export type Chain = "eth";
export type RangeKey = "7d" | "30d" | "90d";
export type EventType = "NATIVE_TRANSFER" | "TOKEN_TRANSFER" | "CONTRACT_INTERACTION";
export type Direction = "in" | "out" | "self";
export type TxStatus = "success" | "fail";
export type NormalizedEvent = {
    type: EventType;
    hash: string;
    timestamp: number;
    from: string;
    to: string;
    direction: Direction;
    assetSymbol: string;
    amount: string;
    gasFeeETH: string;
    status: TxStatus;
    counterparty: string;
};
export type Summary = {
    txCount: number;
    activeDays: number;
    totalInETH: string;
    totalOutETH: string;
};
export type TimeSeriesPoint = {
    date: string;
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
//# sourceMappingURL=types.d.ts.map