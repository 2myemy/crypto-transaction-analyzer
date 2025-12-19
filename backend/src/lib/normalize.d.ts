import type { Direction } from "../types";
export declare function computeDirection(params: {
    address: string;
    from: string;
    to: string;
}): Direction;
export declare function computeCounterparty(params: {
    address: string;
    from: string;
    to: string;
    direction: Direction;
}): string;
//# sourceMappingURL=normalize.d.ts.map