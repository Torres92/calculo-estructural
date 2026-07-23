/**
 * Interacción flexocompresión biaxial — AISC 360-16 Capítulo H (H1-1a / H1-1b).
 * Motor puro (sin React), unidades consistentes de fuerza y momento.
 */

export type InteractionEquation = "H1-1a" | "H1-1b";

export interface InteractionInput {
  /** Demanda axial requerida Pr (LRFD: Pu) */
  Pr: number;
  /** Capacidad axial disponible Pc (LRFD: φc Pn) */
  Pc: number;
  /** Momento requerido eje x */
  Mrx: number;
  /** Momento requerido eje y */
  Mry: number;
  /** Capacidad a flexión eje x (LRFD: φb Mnx) */
  Mcx: number;
  /** Capacidad a flexión eje y (LRFD: φb Mny) */
  Mcy: number;
}

export interface InteractionOutput {
  interactionRatio: number;
  equationUsed: InteractionEquation;
  axialRatio: number;
  momentRatioX: number;
  momentRatioY: number;
}

/**
 * Capacidad a flexión simplificada para secciones compactas doblemente simétricas:
 * Mn = Fy · Z  →  φb Mn = 0.90 · Fy · Z  (sin LTB detallado).
 */
export function calculateFlexuralDesignStrength(Fy: number, Z: number): number {
  if (Fy <= 0 || Z <= 0) {
    throw new Error("Fy y Z deben ser mayores que cero.");
  }
  const Mn = Fy * Z;
  return 0.9 * Mn;
}

/**
 * Evalúa las ecuaciones de interacción H1-1a / H1-1b (AISC 360-16).
 */
export function calculateBiaxialInteraction(input: InteractionInput): InteractionOutput {
  const { Pr, Pc, Mrx, Mry, Mcx, Mcy } = input;

  if (Pc <= 0 || Mcx <= 0 || Mcy <= 0) {
    throw new Error("Las capacidades Pc, Mcx y Mcy deben ser mayores que cero.");
  }
  if (Pr < 0 || Mrx < 0 || Mry < 0) {
    throw new Error("Las demandas Pr, Mrx y Mry no pueden ser negativas.");
  }

  const axialRatio = Pr / Pc;
  const momentRatioX = Mrx / Mcx;
  const momentRatioY = Mry / Mcy;

  let interactionRatio: number;
  let equationUsed: InteractionEquation;

  if (axialRatio >= 0.2) {
    // H1-1a: Pr/Pc + (8/9)(Mrx/Mcx + Mry/Mcy) ≤ 1.0
    equationUsed = "H1-1a";
    interactionRatio = axialRatio + (8 / 9) * (momentRatioX + momentRatioY);
  } else {
    // H1-1b: Pr/(2·Pc) + (Mrx/Mcx + Mry/Mcy) ≤ 1.0
    equationUsed = "H1-1b";
    interactionRatio = Pr / (2 * Pc) + momentRatioX + momentRatioY;
  }

  return {
    interactionRatio,
    equationUsed,
    axialRatio,
    momentRatioX,
    momentRatioY,
  };
}
