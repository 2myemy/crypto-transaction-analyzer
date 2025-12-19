"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeDirection = computeDirection;
exports.computeCounterparty = computeCounterparty;
function computeDirection(params) {
    const a = params.address.toLowerCase();
    const from = params.from.toLowerCase();
    const to = params.to.toLowerCase();
    const isFrom = from === a;
    const isTo = to === a;
    if (isFrom && isTo)
        return "self";
    if (isTo)
        return "in";
    if (isFrom)
        return "out";
    throw new Error("Tx does not involve the target address");
}
function computeCounterparty(params) {
    const a = params.address.toLowerCase();
    const from = params.from.toLowerCase();
    const to = params.to.toLowerCase();
    if (params.direction === "in")
        return from;
    if (params.direction === "out")
        return to;
    return a; // self
}
//# sourceMappingURL=normalize.js.map