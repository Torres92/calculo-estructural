/**
 * Conversión entre sistema métrico (t, m, cm, kg/cm²) e imperial (kips, ft, in, ksi).
 * Funciones puras, sin React.
 */

export type UnitSystem = "metric" | "imperial";

/** Factores: valor_imperial = valor_metrico * factor */
export const FACTORS = {
  /** m → ft */
  length: 3.280839895,
  /** cm → in */
  sectionLength: 1 / 2.54,
  /** cm² → in² */
  area: 1 / (2.54 * 2.54),
  /** cm³ → in³ (módulo plástico Z) */
  sectionModulus: 1 / (2.54 * 2.54 * 2.54),
  /** kg/cm² → ksi (1 ksi = 70.3069578291 kg/cm²) */
  stress: 1 / 70.3069578291,
  /** t (tonelada-fuerza) → kips */
  force: 2.2046226218,
  /** t·m → kip·ft */
  moment: 2.2046226218 * 3.280839895,
} as const;

function convertQuantity(
  value: number,
  metricToImperial: number,
  from: UnitSystem,
  to: UnitSystem
): number {
  if (from === to) return value;
  if (from === "metric" && to === "imperial") return value * metricToImperial;
  return value / metricToImperial;
}

/** Campos dimensionales de diseño de acero (K queda fuera: adimensional). */
export interface ConvertibleSteelInputs {
  Ag: number;
  r: number;
  L: number;
  Fy: number;
  E: number;
  Pu: number;
  d: number;
  bf: number;
  tf: number;
  tw: number;
  Mux: number;
  Muy: number;
  Zx: number;
  Zy: number;
}

export function convertSteelDesignInputs<T extends ConvertibleSteelInputs>(
  inputs: T,
  from: UnitSystem,
  to: UnitSystem
): T {
  if (from === to) return inputs;

  return {
    ...inputs,
    Ag: convertQuantity(inputs.Ag, FACTORS.area, from, to),
    r: convertQuantity(inputs.r, FACTORS.sectionLength, from, to),
    L: convertQuantity(inputs.L, FACTORS.length, from, to),
    Fy: convertQuantity(inputs.Fy, FACTORS.stress, from, to),
    E: convertQuantity(inputs.E, FACTORS.stress, from, to),
    Pu: convertQuantity(inputs.Pu, FACTORS.force, from, to),
    d: convertQuantity(inputs.d, FACTORS.sectionLength, from, to),
    bf: convertQuantity(inputs.bf, FACTORS.sectionLength, from, to),
    tf: convertQuantity(inputs.tf, FACTORS.sectionLength, from, to),
    tw: convertQuantity(inputs.tw, FACTORS.sectionLength, from, to),
    Mux: convertQuantity(inputs.Mux, FACTORS.moment, from, to),
    Muy: convertQuantity(inputs.Muy, FACTORS.moment, from, to),
    Zx: convertQuantity(inputs.Zx, FACTORS.sectionModulus, from, to),
    Zy: convertQuantity(inputs.Zy, FACTORS.sectionModulus, from, to),
  };
}
