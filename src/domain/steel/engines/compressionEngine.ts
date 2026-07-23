/**
 * Motor de cálculo para columnas de acero bajo compresión axial simple
 * Basado en la especificación AISC 360-16, Capítulo E.
 * 
 * Este motor es puramente matemático (independiente de React) para facilitar unit testing.
 * Recibe variables en unidades consistentes (fuerza, longitud).
 */

export interface CompressionInput {
  Ag: number; // Área bruta de la sección (ej. cm² o in²)
  r: number;  // Radio de giro mínimo respecto al eje de pandeo (ej. cm o in)
  L: number;  // Longitud libre no arriostrada (ej. cm o in)
  K: number;  // Factor de longitud efectiva (adimensional, ej. 1.0 para articulado-articulado)
  Fy: number; // Límite de fluencia del acero (ej. kg/cm² o ksi)
  E: number;  // Módulo de elasticidad del acero (ej. kg/cm² o ksi)
}

export interface CompressionOutput {
  slendernessRatio: number;   // Relación de esbeltez (KL/r)
  isSlenderLimitExceeded: boolean; // Si KL/r > 200 (límite recomendado por AISC)
  Fe: number;                 // Esfuerzo de pandeo elástico de Euler (Fe)
  Fcr: number;                // Esfuerzo crítico de pandeo (Fcr)
  Pn: number;                 // Resistencia nominal a compresión (Pn = Fcr * Ag)
  phiPn: number;              // Resistencia de diseño LRFD (phi = 0.90)
  PnOmega: number;            // Resistencia permisible ASD (Omega = 1.67)
  slendernessLimit: number;   // Límite de esbeltez límite (4.71 * sqrt(E/Fy))
}

/**
 * Calcula la capacidad axial de una columna de acero según AISC 360-16.
 */
export function calculateSteelCompression(input: CompressionInput): CompressionOutput {
  const { Ag, r, L, K, Fy, E } = input;

  if (Ag <= 0 || r <= 0 || L <= 0 || K <= 0 || Fy <= 0 || E <= 0) {
    throw new Error("Todos los parámetros de entrada deben ser mayores que cero.");
  }

  // 1. Relación de esbeltez (KL/r)
  const slendernessRatio = (K * L) / r;
  const isSlenderLimitExceeded = slendernessRatio > 200;

  // 2. Esfuerzo de pandeo elástico de Euler (Fe)
  // Fe = (pi^2 * E) / (KL/r)^2
  const Fe = (Math.PI * Math.PI * E) / (slendernessRatio * slendernessRatio);

  // 3. Límite divisorio de esbeltez para pandeo inelástico vs elástico
  // Límite = 4.71 * sqrt(E / Fy)
  const slendernessLimit = 4.71 * Math.sqrt(E / Fy);

  // 4. Determinar Esfuerzo Crítico (Fcr)
  let Fcr = 0;
  if (slendernessRatio <= slendernessLimit) {
    // Pandeo Inelástico: Fcr = [0.658^(Fy/Fe)] * Fy
    Fcr = Math.pow(0.658, Fy / Fe) * Fy;
  } else {
    // Pandeo Elástico: Fcr = 0.877 * Fe
    Fcr = 0.877 * Fe;
  }

  // 5. Resistencias nominales y de diseño
  const Pn = Fcr * Ag;
  const phiPn = 0.90 * Pn; // LRFD (phi = 0.90)
  const PnOmega = Pn / 1.67; // ASD (Omega = 1.67)

  return {
    slendernessRatio,
    isSlenderLimitExceeded,
    Fe,
    Fcr,
    Pn,
    phiPn,
    PnOmega,
    slendernessLimit,
  };
}
