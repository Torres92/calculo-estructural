import React, { createContext, useContext, useState } from "react";

export type UnitSystem = "metric" | "imperial";

export interface UnitDefinition {
  force: string;
  length: string;
  sectionLength: string;
  stress: string;
  area: string;
  moment: string;
  sectionModulus: string;
}

export const UNITS: Record<UnitSystem, UnitDefinition> = {
  metric: {
    force: "t",          // Toneladas métricas
    length: "m",         // Metros (para longitud de columna)
    sectionLength: "cm", // Centímetros (para radio de giro y dimensiones de sección)
    stress: "kg/cm²",    // Kilogramo por centímetro cuadrado
    area: "cm²",
    moment: "t·m",
    sectionModulus: "cm³",
  },
  imperial: {
    force: "kips",       // Kilo-libras
    length: "ft",        // Pies
    sectionLength: "in", // Pulgadas
    stress: "ksi",       // Kilo-libras por pulgada cuadrada
    area: "in²",
    moment: "kip·ft",
    sectionModulus: "in³",
  },
};

interface DesignSettingsContextType {
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
  units: UnitDefinition;
  // Valores típicos por defecto para facilitar el llenado automático
  defaults: {
    E: number;  // Módulo de elasticidad
    Fy: number; // Límite de fluencia
  };
}

const DesignSettingsContext = createContext<DesignSettingsContextType | undefined>(undefined);

export const DesignSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");

  const units = UNITS[unitSystem];

  // Acero: E = 2,040,000 kg/cm² (29,000 ksi). Fy = 2530 kg/cm² (A36, ~36 ksi) o 3515 kg/cm² (Grado 50, 50 ksi)
  const defaults = {
    E: unitSystem === "metric" ? 2040000 : 29000,
    Fy: unitSystem === "metric" ? 3515 : 50, // Por defecto Grado 50 / A572
  };

  return (
    <DesignSettingsContext.Provider value={{ unitSystem, setUnitSystem, units, defaults }}>
      {children}
    </DesignSettingsContext.Provider>
  );
};

export const useDesignSettings = () => {
  const context = useContext(DesignSettingsContext);
  if (!context) {
    throw new Error("useDesignSettings debe usarse dentro de un DesignSettingsProvider");
  }
  return context;
};
