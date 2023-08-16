import { test, expect } from "vitest";
import { GradeCalculation } from "../lib/gradeCalculation";

const grades = {
  "Jahr6": 5,
  "MatPr1": 3.5,
  "MatPr2": 4.5,
};

test("Simple tests", () => {
  const calculation1 = new GradeCalculation("Avg(Jahr6, MatPr1)");
  const calculation2 = new GradeCalculation("Round(Avg(Jahr6, MatPr1, MatPr2))");
  const calculation3 = new GradeCalculation("WeightedAvg(Jahr6, 0.2, MatPr1, 0.8)");

  expect(calculation1.eval(grades)).toBeCloseTo(4.25);
  expect(calculation2.eval(grades)).toBeCloseTo(4.5);
  expect(calculation3.eval(grades)).toBeCloseTo(3.8);
});

test("Fraction test", () => {
  const calculation = new GradeCalculation("WeightedAvg(Jahr6, Frac(1, 3), MatPr1, Frac(2, 3))");

  expect(calculation.eval(grades)).toBeCloseTo(4);
});

test("Invalid calculation strings", () => {
  expect(() => new GradeCalculation("Avg(4, 5")).toThrow("Expected closing parenthesis for function Avg");
  expect(() => new GradeCalculation("Avg(")).toThrow("Expected closing parenthesis for function Avg");
});

test("Pretty print tests", () => {
  const calculation1 = new GradeCalculation("Avg(Jahr6, MatPr1)");
  const calculation2 = new GradeCalculation("Round(Avg(Jahr6, MatPr1, MatPr2))");
  const calculation3 = new GradeCalculation("WeightedAvg(Jahr6, 0.2, MatPr1, 0.8)");

  expect(calculation1.prettyPrint()).toEqual("⌀([Jahr6], [MatPr1])");
  expect(calculation2.prettyPrint()).toEqual("|⌀([Jahr6], [MatPr1], [MatPr2])|");
  expect(calculation3.prettyPrint()).toEqual("⌀([Jahr6] (Gew. 0.2), [MatPr1] (Gew. 0.8))");
});

test("getWeights tests", () => {
  const calculation1 = new GradeCalculation("Avg(Jahr6, MatPr1)");
  const calculation2 = new GradeCalculation("Round(Avg(Jahr6, MatPr1, MatPr2))");
  const calculation3 = new GradeCalculation("Avg(WeightedAvg(Jahr6, 0.2, MatPr1, 0.8), MatPr2)");

  expect(calculation1.getWeights()).toEqual({ Jahr6: 0.5, MatPr1: 0.5 });
  expect(calculation2.getWeights()).toEqual({ Jahr6: 1 / 3, MatPr1: 1 / 3, MatPr2: 1 / 3 });
  expect(calculation3.getWeights()).toEqual({ Jahr6: 0.1, MatPr1: 0.4, MatPr2: 0.5 });
});
