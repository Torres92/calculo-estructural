import { describe, it, expect } from "vitest";
import { convertSteelDesignInputs, FACTORS, type ConvertibleSteelInputs } from "../units";

const sampleMetric: ConvertibleSteelInputs = {
  Ag: 15.0,
  r: 3.5,
  L: 3.0,
  Fy: 3515,
  E: 2040000,
  Pu: 15.0,
  d: 20.0,
  bf: 15.0,
  tf: 1.0,
  tw: 0.6,
  Mux: 2.5,
  Muy: 1.0,
  Zx: 150.0,
  Zy: 50.0,
};

describe("convertSteelDesignInputs", () => {
  it("no modifica valores si from === to", () => {
    const result = convertSteelDesignInputs(sampleMetric, "metric", "metric");
    expect(result).toEqual(sampleMetric);
  });

  it("convierte métrico → imperial con factores correctos", () => {
    const imperial = convertSteelDesignInputs(sampleMetric, "metric", "imperial");

    expect(imperial.L).toBeCloseTo(3.0 * FACTORS.length, 6);
    expect(imperial.r).toBeCloseTo(3.5 * FACTORS.sectionLength, 6);
    expect(imperial.Ag).toBeCloseTo(15.0 * FACTORS.area, 6);
    expect(imperial.Fy).toBeCloseTo(3515 * FACTORS.stress, 4);
    expect(imperial.Pu).toBeCloseTo(15.0 * FACTORS.force, 6);
    expect(imperial.Mux).toBeCloseTo(2.5 * FACTORS.moment, 6);
    expect(imperial.Zx).toBeCloseTo(150.0 * FACTORS.sectionModulus, 6);
    expect(imperial.d).toBeCloseTo(20.0 * FACTORS.sectionLength, 6);
  });

  it("ida y vuelta métrico → imperial → métrico preserva valores", () => {
    const roundTrip = convertSteelDesignInputs(
      convertSteelDesignInputs(sampleMetric, "metric", "imperial"),
      "imperial",
      "metric"
    );

    (Object.keys(sampleMetric) as (keyof ConvertibleSteelInputs)[]).forEach((key) => {
      expect(roundTrip[key]).toBeCloseTo(sampleMetric[key], 8);
    });
  });

  it("preserva K y campos no dimensionales vía spread", () => {
    const withK = { ...sampleMetric, K: 1.0 };
    const converted = convertSteelDesignInputs(withK, "metric", "imperial");
    expect(converted.K).toBe(1.0);
  });
});
