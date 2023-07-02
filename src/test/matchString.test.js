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

    expect(() => testMatchStr("", config)).toThrow();
    expect(() => testMatchStr(null, config)).toThrow();
    expect(() => testMatchStr("&", config)).toThrow();
    expect(() => testMatchStr("|", config)).toThrow();
    expect(() => testMatchStr("!", config)).toThrow();
    expect(() => testMatchStr("c1.A |", config)).toThrow();
    expect(() => testMatchStr("c1.A | c2.B &", config)).toThrow();
    expect(() => testMatchStr("c1.A ! c1.A", config)).toThrow();
    expect(() => testMatchStr("c1.A & (c1.A", config)).toThrow();
    expect(() => testMatchStr("c1.A & (c1.A | c1.B))", config)).toThrow();
});

test("Parentheses", () => {
    const config = { "c1": "A", "c2": "A", "c3": "C" };

    expect(testMatchStr("(c1.A | c2.B) & c3.C", config)).toBe(true);
    expect(testMatchStr("c1.A | (c2.B & c3.C)", config)).toBe(true);
    expect(testMatchStr("(c1.A | c2.B) & (c3.C)", config)).toBe(true);
    expect(testMatchStr("(c1.A | c2.B) & (c3.A | c1.A)", config)).toBe(true);
});

test("Order of operation test", () => {
    const config = { "c1": "A", "c2": "A", "c3": "C" };

    expect(testMatchStr("c1.A | c2.B & c3.C", config)).toBe(true);
    expect(testMatchStr("c1.A | c2.B & c3.X", config)).toBe(true);
    expect(testMatchStr("c1.A & c2.X | c3.X", config)).toBe(false);
    expect(testMatchStr("c1.A & c2.X | c3.X", config)).toBe(false);
    expect(testMatchStr("c1.A & c2.A | c3.X", config)).toBe(true);
    expect(testMatchStr("c1.A & c2.X | !c3.X", config)).toBe(true);
    expect(testMatchStr("!(c1.A & c2.X) | c3.X", config)).toBe(true);
    expect(testMatchStr("c1.A & !c2.X | c3.X", config)).toBe(true);
});


