import React from "react";
import { InputField } from "../../../components/ui/InputField";
import { useDesignSettings } from "../../../../application/context/DesignSettingsContext";
import type { SteelDesignInputs } from "../../../../application/hooks/useSteelDesign";

interface SteelInputsProps {
  inputs: SteelDesignInputs;
  updateInput: (key: keyof SteelDesignInputs, value: number) => void;
  error: string | null;
}

export const SteelInputs: React.FC<SteelInputsProps> = ({
  inputs,
  updateInput,
  error,
}) => {
  const { units } = useDesignSettings();

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <section className="glass-panel rounded-xl p-5 flex flex-col gap-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300">
          Geometría de diseño
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            id="Ag"
            label="Área bruta (Ag)"
            value={inputs.Ag}
            onChange={(v) => updateInput("Ag", v)}
            unit={units.area}
            description="Sección transversal"
          />
          <InputField
            id="r"
            label="Radio de giro (r)"
            value={inputs.r}
            onChange={(v) => updateInput("r", v)}
            unit={units.sectionLength}
            description="Eje de pandeo"
          />
          <InputField
            id="L"
            label="Longitud libre (L)"
            value={inputs.L}
            onChange={(v) => updateInput("L", v)}
            unit={units.length}
            step={0.1}
            description="No arriostrada"
          />
          <InputField
            id="K"
            label="Factor K"
            value={inputs.K}
            onChange={(v) => updateInput("K", v)}
            unit="—"
            step={0.05}
            min={0.5}
            description="Longitud efectiva"
          />
        </div>
      </section>

      <section className="glass-panel rounded-xl p-5 flex flex-col gap-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300">
          Dimensiones de sección (W)
        </h2>
        <p className="text-xs text-gray-500 -mt-2">
          Para visualización a escala. Ag y r siguen siendo entradas de diseño independientes.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            id="d"
            label="Profundidad (d)"
            value={inputs.d}
            onChange={(v) => updateInput("d", v)}
            unit={units.sectionLength}
            step={0.1}
          />
          <InputField
            id="bf"
            label="Ancho de ala (bf)"
            value={inputs.bf}
            onChange={(v) => updateInput("bf", v)}
            unit={units.sectionLength}
            step={0.1}
          />
          <InputField
            id="tf"
            label="Espesor de ala (tf)"
            value={inputs.tf}
            onChange={(v) => updateInput("tf", v)}
            unit={units.sectionLength}
            step={0.05}
          />
          <InputField
            id="tw"
            label="Espesor de alma (tw)"
            value={inputs.tw}
            onChange={(v) => updateInput("tw", v)}
            unit={units.sectionLength}
            step={0.05}
          />
        </div>
      </section>

      <section className="glass-panel rounded-xl p-5 flex flex-col gap-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300">
          Materiales
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            id="Fy"
            label="Límite de fluencia (Fy)"
            value={inputs.Fy}
            onChange={(v) => updateInput("Fy", v)}
            unit={units.stress}
            step={1}
          />
          <InputField
            id="E"
            label="Módulo de elasticidad (E)"
            value={inputs.E}
            onChange={(v) => updateInput("E", v)}
            unit={units.stress}
            step={1000}
          />
        </div>
      </section>

      <section className="glass-panel rounded-xl p-5 flex flex-col gap-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300">
          Cargas (LRFD)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            id="Pu"
            label="Carga axial (Pu)"
            value={inputs.Pu}
            onChange={(v) => updateInput("Pu", v)}
            unit={units.force}
            step={0.5}
            description="Demanda axial"
            min={0}
          />
          <InputField
            id="Mux"
            label="Momento Mux"
            value={inputs.Mux}
            onChange={(v) => updateInput("Mux", v)}
            unit={units.moment}
            step={0.1}
            description="Eje fuerte"
            min={0}
          />
          <InputField
            id="Muy"
            label="Momento Muy"
            value={inputs.Muy}
            onChange={(v) => updateInput("Muy", v)}
            unit={units.moment}
            step={0.1}
            description="Eje débil"
            min={0}
          />
        </div>
      </section>

      <section className="glass-panel rounded-xl p-5 flex flex-col gap-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300">
          Capacidad a flexión (simplificada)
        </h2>
        <p className="text-xs text-gray-500 -mt-2">
          φb Mn = 0.90 · Fy · Z (sección compacta, sin LTB).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            id="Zx"
            label="Módulo plástico Zx"
            value={inputs.Zx}
            onChange={(v) => updateInput("Zx", v)}
            unit={units.sectionModulus}
            step={1}
          />
          <InputField
            id="Zy"
            label="Módulo plástico Zy"
            value={inputs.Zy}
            onChange={(v) => updateInput("Zy", v)}
            unit={units.sectionModulus}
            step={1}
          />
        </div>
      </section>
    </div>
  );
};
