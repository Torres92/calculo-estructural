import { useState, useEffect, useRef } from "react";
import { useDesignSettings } from "../context/DesignSettingsContext";
import { calculateSteelCompression } from "../../domain/steel/engines/compressionEngine";
import type { CompressionOutput } from "../../domain/steel/engines/compressionEngine";
import {
  calculateBiaxialInteraction,
  calculateFlexuralDesignStrength,
} from "../../domain/steel/engines/interactionEngine";
import type { InteractionOutput } from "../../domain/steel/engines/interactionEngine";
import { convertSteelDesignInputs } from "../../domain/shared/units";
import type { UnitSystem } from "../../domain/shared/units";

export interface SteelDesignInputs {
  Ag: number;
  r: number;
  L: number;
  K: number;
  Fy: number;
  E: number;
  Pu: number;
  /** Profundidad de la sección (cm / in) */
  d: number;
  /** Ancho de ala (cm / in) */
  bf: number;
  /** Espesor de ala (cm / in) */
  tf: number;
  /** Espesor de alma (cm / in) */
  tw: number;
  /** Momento requerido eje x (t·m / kip·ft) */
  Mux: number;
  /** Momento requerido eje y (t·m / kip·ft) */
  Muy: number;
  /** Módulo plástico eje x (cm³ / in³) */
  Zx: number;
  /** Módulo plástico eje y (cm³ / in³) */
  Zy: number;
}

export function useSteelDesign() {
  const { unitSystem, defaults } = useDesignSettings();
  const prevUnitSystemRef = useRef<UnitSystem>(unitSystem);

  const [inputs, setInputs] = useState<SteelDesignInputs>({
    Ag: 15.0,
    r: 3.5,
    L: 3.0,
    K: 1.0,
    Fy: defaults.Fy,
    E: defaults.E,
    Pu: 15.0,
    d: 20.0,
    bf: 15.0,
    tf: 1.0,
    tw: 0.6,
    Mux: 0,
    Muy: 0,
    Zx: 150.0,
    Zy: 50.0,
  });

  const [results, setResults] = useState<CompressionOutput | null>(null);
  const [interaction, setInteraction] = useState<InteractionOutput | null>(null);
  const [demandCapacityRatio, setDemandCapacityRatio] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Convertir (si cambió el sistema) y calcular en el mismo efecto para evitar
  // un frame con inputs en unidades viejas y unitSystem nuevo.
  useEffect(() => {
    const from = prevUnitSystemRef.current;
    let working = inputs;

    if (from !== unitSystem) {
      working = convertSteelDesignInputs(inputs, from, unitSystem);
      prevUnitSystemRef.current = unitSystem;
      setInputs(working);
    }

    try {
      setError(null);

      const lengthInConsistentUnits =
        unitSystem === "metric" ? working.L * 100 : working.L * 12;

      const output = calculateSteelCompression({
        Ag: working.Ag,
        r: working.r,
        L: lengthInConsistentUnits,
        K: working.K,
        Fy: working.Fy,
        E: working.E,
      });

      setResults(output);

      const designCapacityAxial =
        unitSystem === "metric" ? output.phiPn / 1000 : output.phiPn;

      // Fy·Z → kg·cm (métrico) o kip·in (imperial); UI usa t·m / kip·ft
      const phiMnxInternal = calculateFlexuralDesignStrength(working.Fy, working.Zx);
      const phiMnyInternal = calculateFlexuralDesignStrength(working.Fy, working.Zy);

      const phiMnx =
        unitSystem === "metric"
          ? phiMnxInternal / (1000 * 100)
          : phiMnxInternal / 12;

      const phiMny =
        unitSystem === "metric"
          ? phiMnyInternal / (1000 * 100)
          : phiMnyInternal / 12;

      const interactionOutput = calculateBiaxialInteraction({
        Pr: working.Pu,
        Pc: designCapacityAxial,
        Mrx: working.Mux,
        Mry: working.Muy,
        Mcx: phiMnx,
        Mcy: phiMny,
      });

      setInteraction(interactionOutput);
      setDemandCapacityRatio(interactionOutput.interactionRatio);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error en el cálculo estructural.";
      setError(message);
      setResults(null);
      setInteraction(null);
      setDemandCapacityRatio(0);
    }
  }, [inputs, unitSystem]);

  const updateInput = (key: keyof SteelDesignInputs, value: number) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return {
    inputs,
    updateInput,
    results,
    interaction,
    demandCapacityRatio,
    error,
  };
}
