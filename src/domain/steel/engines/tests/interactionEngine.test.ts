import { describe, it, expect } from "vitest";
import {
  calculateBiaxialInteraction,
  calculateFlexuralDesignStrength,
} from "../interactionEngine";

describe("calculateFlexuralDesignStrength", () => {
  it("calcula φb Mn = 0.90 · Fy · Z", () => {
    // Fy = 50 ksi, Z = 100 in³ → Mn = 5000 kip·in → φMn = 4500 kip·in
    expect(calculateFlexuralDesignStrength(50, 100)).toBeCloseTo(4500, 6);
  });

  it("lanza error si Fy o Z ≤ 0", () => {
    expect(() => calculateFlexuralDesignStrength(0, 100)).toThrow();
    expect(() => calculateFlexuralDesignStrength(50, -1)).toThrow();
  });
});

describe("calculateBiaxialInteraction - AISC H1", () => {
  it("usa H1-1a cuando Pr/Pc ≥ 0.2", () => {
    // Pr/Pc = 0.5 ≥ 0.2 → H1-1a
    // ratio = 0.5 + (8/9)(0.2 + 0.1) = 0.5 + (8/9)(0.3) = 0.5 + 0.2666... = 0.7666...
    const result = calculateBiaxialInteraction({
      Pr: 50,
      Pc: 100,
      Mrx: 20,
      Mry: 10,
      Mcx: 100,
      Mcy: 100,
    });

    expect(result.equationUsed).toBe("H1-1a");
    expect(result.axialRatio).toBeCloseTo(0.5, 6);
    expect(result.interactionRatio).toBeCloseTo(0.5 + (8 / 9) * 0.3, 6);
  });

  it("usa H1-1b cuando Pr/Pc < 0.2", () => {
    // Pr/Pc = 0.1 < 0.2 → H1-1b
    // ratio = 0.1/2 + 0.3 + 0.2 = 0.05 + 0.5 = 0.55
    const result = calculateBiaxialInteraction({
      Pr: 10,
      Pc: 100,
      Mrx: 30,
      Mry: 20,
      Mcx: 100,
      Mcy: 100,
    });

    expect(result.equationUsed).toBe("H1-1b");
    expect(result.interactionRatio).toBeCloseTo(0.55, 6);
  });

  it("con Mux=Muy=0 degenera a Pr/Pc (vía H1-1a si Pr/Pc ≥ 0.2)", () => {
    const result = calculateBiaxialInteraction({
      Pr: 40,
      Pc: 100,
      Mrx: 0,
      Mry: 0,
      Mcx: 100,
      Mcy: 100,
    });

    expect(result.equationUsed).toBe("H1-1a");
    expect(result.interactionRatio).toBeCloseTo(0.4, 6);
  });

  it("lanza error ante capacidades no válidas", () => {
    expect(() =>
      calculateBiaxialInteraction({
        Pr: 10,
        Pc: 0,
        Mrx: 0,
        Mry: 0,
        Mcx: 100,
        Mcy: 100,
      })
    ).toThrow();
  });
});
