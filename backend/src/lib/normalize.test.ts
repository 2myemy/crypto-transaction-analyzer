import { computeCounterparty, computeDirection } from "./normalize";

const A = "0xAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAa";
const X = "0x1111111111111111111111111111111111111111";
const Y = "0x2222222222222222222222222222222222222222";

test("direction: to == address => in", () => {
  expect(computeDirection({ address: A, from: X, to: A })).toBe("in");
});

test("direction: from == address => out", () => {
  expect(computeDirection({ address: A, from: A, to: Y })).toBe("out");
});

test("direction: from==address && to==address => self", () => {
  expect(computeDirection({ address: A, from: A, to: A })).toBe("self");
});

test("counterparty: in => from", () => {
  const dir = computeDirection({ address: A, from: X, to: A });
  expect(computeCounterparty({ address: A, from: X, to: A, direction: dir })).toBe(X.toLowerCase());
});

test("counterparty: out => to", () => {
  const dir = computeDirection({ address: A, from: A, to: Y });
  expect(computeCounterparty({ address: A, from: A, to: Y, direction: dir })).toBe(Y.toLowerCase());
});
