import React from "react";
import { useSteelDesign } from "../../../application/hooks/useSteelDesign";
import { useDesignSettings } from "../../../application/context/DesignSettingsContext";
import { SteelInputs } from "./components/SteelInputs";
import { SteelResultsTable } from "./components/SteelResultsTable";
import { Section2DViewer } from "../../components/visualizers/Section2DViewer";

export const SteelColumnDesignPage: React.FC = () => {
  const { inputs, updateInput, results, interaction, demandCapacityRatio, error } =
    useSteelDesign();
  const { unitSystem, setUnitSystem, units } = useDesignSettings();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0b0f19]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-400/80">
              Cálculo estructural
            </p>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Columna de Acero — Compresión / Flexocompresión
            </h1>
            <p className="mt-0.5 text-xs text-gray-500">
              AISC 360-16 · Capítulos E y H · LRFD / ASD
            </p>
          </div>

          <div
            className="inline-flex rounded-lg border border-white/10 bg-gray-900/60 p-1"
            role="group"
            aria-label="Sistema de unidades"
          >
            <button
              type="button"
              onClick={() => setUnitSystem("metric")}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                unitSystem === "metric"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Métrico
            </button>
            <button
              type="button"
              onClick={() => setUnitSystem("imperial")}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                unitSystem === "imperial"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Inglés
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-2 lg:gap-8 sm:px-6">
        <aside className="flex flex-col gap-4 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
              Parámetros de diseño
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Geometría, materiales y cargas. Los resultados se actualizan al instante.
            </p>
          </div>
          <SteelInputs
            inputs={inputs}
            updateInput={updateInput}
            error={error}
          />
        </aside>

        <section className="flex flex-col gap-6 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pl-1">
          <Section2DViewer
            d={inputs.d}
            bf={inputs.bf}
            tf={inputs.tf}
            tw={inputs.tw}
            sectionLengthUnit={units.sectionLength}
            demandCapacityRatio={demandCapacityRatio}
          />
          <SteelResultsTable
            results={results}
            interaction={interaction}
            demandCapacityRatio={demandCapacityRatio}
            Pu={inputs.Pu}
            Mux={inputs.Mux}
            Muy={inputs.Muy}
          />
        </section>
      </main>
    </div>
  );
};
