import { describe, it, expect } from "vitest";
import { calculateSteelCompression } from "../compressionEngine";

describe("calculateSteelCompression - AISC 360-16", () => {
  it("debería calcular correctamente bajo pandeo inelástico (KL/r <= 4.71*sqrt(E/Fy))", () => {
    // Caso de prueba con unidades imperiales (kips, in, ksi)
    // Perfil con:
    // Ag = 10.0 in²
    // r = 2.0 in
    // L = 120 in (10 ft)
    // K = 1.0 (Apoyos articulados)
    // Fy = 50.0 ksi
    // E = 29000.0 ksi
    const input = {
      Ag: 10.0,
      r: 2.0,
      L: 120.0,
      K: 1.0,
      Fy: 50.0,
      E: 29000.0,
    };

    const result = calculateSteelCompression(input);

    // KL/r = 1.0 * 120 / 2 = 60
    expect(result.slendernessRatio).toBe(60);
    expect(result.isSlenderLimitExceeded).toBe(false);

    // Fe = (pi^2 * 29000) / 60^2 = 79.5056 ksi
    expect(result.Fe).toBeCloseTo(79.5056, 3);

    // Límite de esbeltez = 4.71 * sqrt(29000/50) = 113.43
    expect(result.slendernessLimit).toBeCloseTo(113.43, 2);

    // Como 60 <= 113.43 -> Fcr = [0.658^(50/79.4976)] * 50 = 38.429 ksi
    expect(result.Fcr).toBeCloseTo(38.429, 2);

    // Pn = Fcr * Ag = 38.429 * 10 = 384.29 kips
    expect(result.Pn).toBeCloseTo(384.29, 1);

    // phiPn = 0.90 * Pn = 345.86 kips
    expect(result.phiPn).toBeCloseTo(345.86, 1);

    // PnOmega = Pn / 1.67 = 230.11 kips
    expect(result.PnOmega).toBeCloseTo(230.11, 1);
  });

  it("debería calcular correctamente bajo pandeo elástico (KL/r > 4.71*sqrt(E/Fy))", () => {
    // Caso de prueba con esbeltez muy alta
    // Ag = 10.0 in²
    // r = 1.0 in (menor radio de giro)
    // L = 240 in (20 ft)
    // K = 1.0
    // Fy = 50.0 ksi
    // E = 29000.0 ksi
    const input = {
      Ag: 10.0,
      r: 1.0,
      L: 240.0,
      K: 1.0,
      Fy: 50.0,
      E: 29000.0,
    };

    const result = calculateSteelCompression(input);

    // KL/r = 240
    expect(result.slendernessRatio).toBe(240);
    expect(result.isSlenderLimitExceeded).toBe(true); // Excede límite de 200

    // Fe = (pi^2 * 29000) / 240^2 = 4.969 ksi
    expect(result.Fe).toBeCloseTo(4.969, 3);

    // Como 240 > 113.43 -> Fcr = 0.877 * Fe = 0.877 * 4.969 = 4.358 ksi
    expect(result.Fcr).toBeCloseTo(4.358, 2);

    // Pn = 4.358 * 10 = 43.58 kips
    expect(result.Pn).toBeCloseTo(43.58, 1);
  });

  it("debería lanzar un error ante parámetros geométricos o físicos no válidos", () => {
    expect(() =>
      calculateSteelCompression({
        Ag: 0, // Invalido
        r: 2.0,
        L: 120.0,
        K: 1.0,
        Fy: 50.0,
        E: 29000.0,
      })
    ).toThrow();
  });
});
