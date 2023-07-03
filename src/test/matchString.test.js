import { test, expect } from "vitest";
import { testMatchStr } from "../lib/matchString";

test("Simple tests", () => {
    const config = { "c1": "A", "c2": "B" };

    expect(testMatchStr("c1.A", config)).toBe(true);
    expect(testMatchStr("c1.B", config)).toBe(false);
    expect(testMatchStr("c2.A", config)).toBe(false);
    expect(testMatchStr("c2.B", config)).toBe(true);
    expect(testMatchStr("*", config)).toBe(true);
});

test("Missing config key/value", () => {
    const config = { "c1": "A" };

    expect(testMatchStr("c2.A", config)).toBe(false);
});

test("Negation", () => {
    const config = { "c1": "A" };

    expect(testMatchStr("!c1.A", config)).toBe(false);
    expect(testMatchStr("!c1.B", config)).toBe(true);
    expect(testMatchStr("!c2.A", config)).toBe(true);
});

test("Simple boolean operations", () => {
    const config = { "c1": "A", "c2": "B" };

    expect(testMatchStr("c1.A | c2.B", config)).toBe(true);
    expect(testMatchStr("c1.A & c2.B", config)).toBe(true);
    expect(testMatchStr("c1.B | c2.A", config)).toBe(false);
    expect(testMatchStr("c1.B & c2.A", config)).toBe(false);
    expect(testMatchStr("!c1.A | c2.A", config)).toBe(false);
    expect(testMatchStr("c1.A & !c2.B", config)).toBe(false);
    expect(testMatchStr("!!!c1.A", config)).toBe(false);
});

test("Whitespace test", () => {
    const config = { "c1": "A", "c2": "B" };

    expect(testMatchStr("c1.A&c2.B", config)).toBe(true);
    expect(testMatchStr("c1.A     &      c2.B", config)).toBe(true);
});

test("Invalid match string", () => {
    const config = {};

    expect(() => testMatchStr(null, config)).toThrow("match string is null");
    expect(() => testMatchStr("", config)).toThrow("Empty match string");
    expect(() => testMatchStr("&", config)).toThrow("Invalid literal: &");
    expect(() => testMatchStr("|", config)).toThrow("Invalid literal: |");
    expect(() => testMatchStr("!", config)).toThrow("Unexpected end of match string");
    expect(() => testMatchStr("c1.A |", config)).toThrow("Unexpected end of match string");
    expect(() => testMatchStr("c1.A | c2.B &", config)).toThrow("Unexpected end of match string");
    expect(() => testMatchStr("c1.A & (c1.A", config)).toThrow("Expected ')'");
    expect(() => testMatchStr("c1.A & (c1.A | c1.B))", config)).toThrow("Unexpected token: )");
    expect(() => testMatchStr("c1.A ! c1.A", config)).toThrow("Unary operator in wrong position: !");
    expect(() => testMatchStr("c1.A $ c1.B", config)).toThrow("Invalid operator: $");
});

test("Parentheses", () => {
    const config = { "c1": "A", "c2": "A", "c3": "C" };

    expect(testMatchStr("(c1.A | c2.B) & c3.C", config)).toBe(true);
    expect(testMatchStr("c1.A | (c2.B & c3.C)", config)).toBe(true);
    expect(testMatchStr("(c1.A | c2.B) & (c3.C)", config)).toBe(true);
    expect(testMatchStr("(c1.A | c2.B) & (!c3.C)", config)).toBe(false);
    expect(testMatchStr("(c1.A | c2.B) & (c3.A | c1.A)", config)).toBe(true);
});

test("Order of operations test", () => {
    const config = { "c1": "A", "c2": "A", "c3": "C" };

    expect(testMatchStr("c1.A | c2.B & c3.C", config)).toBe(true);
    expect(testMatchStr("c1.A | c2.B & c3.X", config)).toBe(true);
    expect(testMatchStr("c1.A & c2.X | c3.X", config)).toBe(false);
    expect(testMatchStr("c1.A & c2.X | c3.X", config)).toBe(false);
    expect(testMatchStr("c1.A & c2.A | c3.X", config)).toBe(true);
    expect(testMatchStr("c1.A & c2.X | !c3.X", config)).toBe(true);
    expect(testMatchStr("!(c1.A & c2.X) | c3.X", config)).toBe(true);
    expect(testMatchStr("c1.A & !c2.X | c3.X", config)).toBe(true);
    expect(testMatchStr("!c1.X & c2.X", config)).toBe(false);
    expect(testMatchStr("!c1.X | c2.A", config)).toBe(true);
});

test("Wildcard test", () => {
    const config = { "c1": "A", "c2": "B" };

    expect(testMatchStr("*", config)).toBe(true);
    expect(testMatchStr("c3.A & *", config)).toBe(false);
    expect(testMatchStr("c1.*", config)).toBe(true);
    expect(testMatchStr("c1.A & c2.*", config)).toBe(true);
    expect(testMatchStr("c1.A & c3.*", config)).toBe(false);
});
