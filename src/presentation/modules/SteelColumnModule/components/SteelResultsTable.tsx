import React from "react";
import type { CompressionOutput } from "../../../../domain/steel/engines/compressionEngine";
import type { InteractionOutput } from "../../../../domain/steel/engines/interactionEngine";
import { useDesignSettings } from "../../../../application/context/DesignSettingsContext";

interface SteelResultsTableProps {
  results: CompressionOutput | null;
  interaction: InteractionOutput | null;
  demandCapacityRatio: number;
  Pu: number;
  Mux: number;
  Muy: number;
}

export const SteelResultsTable: React.FC<SteelResultsTableProps> = ({
  results,
  interaction,
  demandCapacityRatio,
  Pu,
  Mux,
  Muy,
}) => {
  const { units, unitSystem } = useDesignSettings();

  if (!results || !interaction) {
    return (
      <div className="flex items-center justify-center h-48 border border-dashed border-gray-800 rounded-xl bg-gray-950/20">
        <p className="text-gray-500 text-sm">
          Ingrese parámetros válidos para ver los resultados.
        </p>
      </div>
    );
  }

  const displayPn = unitSystem === "metric" ? results.Pn / 1000 : results.Pn;
  const displayPhiPn = unitSystem === "metric" ? results.phiPn / 1000 : results.phiPn;
  const displayPnOmega =
    unitSystem === "metric" ? results.PnOmega / 1000 : results.PnOmega;

  let ratioColorClass = "text-green-400 bg-green-500/10 border-green-500/20";
  let ratioBarColor = "bg-green-500";
  if (demandCapacityRatio >= 1.0) {
    ratioColorClass = "text-red-400 bg-red-500/10 border-red-500/20";
    ratioBarColor = "bg-red-500";
  } else if (demandCapacityRatio >= 0.9) {
    ratioColorClass = "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    ratioBarColor = "bg-yellow-500";
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="glass-panel p-5 rounded-xl flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Ratio de interacción LRFD
          </span>
          <span
            className={`text-xl font-bold px-3 py-1 rounded-lg border ${ratioColorClass}`}
          >
            {demandCapacityRatio.toFixed(3)}
          </span>
        </div>
        <div className="w-full bg-gray-800/50 rounded-full h-3.5 overflow-hidden border border-white/5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${ratioBarColor}`}
            style={{ width: `${Math.min(demandCapacityRatio * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 font-medium gap-2 flex-wrap">
          <span>
            Ecuación {interaction.equationUsed}
          </span>
          <span>
            Pu: {Pu.toFixed(2)} {units.force} · φPn: {displayPhiPn.toFixed(2)}{" "}
            {units.force}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 font-medium gap-2 flex-wrap">
          <span>
            Mux: {Mux.toFixed(2)} {units.moment}
          </span>
          <span>
            Muy: {Muy.toFixed(2)} {units.moment}
          </span>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">
            Interacción Cap. H (H1)
          </h3>
        </div>
        <div className="divide-y divide-white/5">
          <div className="px-5 py-3.5 flex justify-between items-center hover:bg-white/[0.01] transition-colors">
            <span className="text-sm font-semibold text-gray-200">
              Pr / Pc (axial)
            </span>
            <span className="text-sm font-mono text-gray-300">
              {interaction.axialRatio.toFixed(4)}
            </span>
          </div>
          <div className="px-5 py-3.5 flex justify-between items-center hover:bg-white/[0.01] transition-colors">
            <span className="text-sm font-semibold text-gray-200">
              Mrx / Mcx
            </span>
            <span className="text-sm font-mono text-gray-300">
              {interaction.momentRatioX.toFixed(4)}
            </span>
          </div>
          <div className="px-5 py-3.5 flex justify-between items-center hover:bg-white/[0.01] transition-colors">
            <span className="text-sm font-semibold text-gray-200">
              Mry / Mcy
            </span>
            <span className="text-sm font-mono text-gray-300">
              {interaction.momentRatioY.toFixed(4)}
            </span>
          </div>
          <div className="px-5 py-3.5 flex justify-between items-center hover:bg-white/[0.01] transition-colors bg-blue-500/5">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-blue-400">
                Ratio de interacción
              </span>
              <span className="text-xs text-gray-500">
                AISC {interaction.equationUsed}
              </span>
            </div>
            <span className="text-base font-bold text-blue-400 font-mono">
              {interaction.interactionRatio.toFixed(4)}
            </span>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">
            Estados límite Cap. E (compresión)
          </h3>
        </div>
        <div className="divide-y divide-white/5">
          <div className="px-5 py-3.5 flex justify-between items-center hover:bg-white/[0.01] transition-colors">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-200">
                Relación de esbeltez (KL/r)
              </span>
              <span className="text-xs text-gray-500">Límite recomendado: 200</span>
            </div>
            <div className="text-right">
              <span
                className={`text-sm font-bold ${
                  results.isSlenderLimitExceeded ? "text-red-400" : "text-gray-200"
                }`}
              >
                {results.slendernessRatio.toFixed(2)}
              </span>
              {results.isSlenderLimitExceeded && (
                <div className="text-[10px] text-red-400 font-bold uppercase tracking-wider mt-0.5">
                  Excede límite
                </div>
              )}
            </div>
          </div>

          <div className="px-5 py-3.5 flex justify-between items-center hover:bg-white/[0.01] transition-colors">
            <span className="text-sm font-semibold text-gray-200">
              Esfuerzo de Euler (Fe)
            </span>
            <span className="text-sm font-mono text-gray-400">
              {results.Fe.toFixed(2)} {units.stress}
            </span>
          </div>

          <div className="px-5 py-3.5 flex justify-between items-center hover:bg-white/[0.01] transition-colors">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-200">
                Esfuerzo crítico (Fcr)
              </span>
              <span className="text-xs text-gray-500">
                {results.slendernessRatio <= results.slendernessLimit
                  ? "Pandeo inelástico"
                  : "Pandeo elástico"}
              </span>
            </div>
            <span className="text-sm font-mono text-gray-300 font-bold">
              {results.Fcr.toFixed(2)} {units.stress}
            </span>
          </div>

          <div className="px-5 py-3.5 flex justify-between items-center hover:bg-white/[0.01] transition-colors">
            <span className="text-sm font-semibold text-gray-200">
              Resistencia axial nominal (Pn)
            </span>
            <span className="text-sm font-mono text-gray-400">
              {displayPn.toFixed(2)} {units.force}
            </span>
          </div>

          <div className="px-5 py-3.5 flex justify-between items-center hover:bg-white/[0.01] transition-colors bg-blue-500/5">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-blue-400">
                Resistencia de diseño LRFD (φPn)
              </span>
              <span className="text-xs text-gray-500">Factor φ = 0.90</span>
            </div>
            <span className="text-base font-bold text-blue-400 font-mono">
              {displayPhiPn.toFixed(2)} {units.force}
            </span>
          </div>

          <div className="px-5 py-3.5 flex justify-between items-center hover:bg-white/[0.01] transition-colors">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-300">
                Resistencia permisible ASD (Pn/Ω)
              </span>
              <span className="text-xs text-gray-500">Factor Ω = 1.67</span>
            </div>
            <span className="text-sm font-mono text-gray-300">
              {displayPnOmega.toFixed(2)} {units.force}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
