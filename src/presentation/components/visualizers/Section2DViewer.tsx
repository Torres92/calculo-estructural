import React from "react";

interface Section2DViewerProps {
  d: number;
  bf: number;
  tf: number;
  tw: number;
  sectionLengthUnit: string;
  demandCapacityRatio: number;
}

/**
 * Visualizador SVG de sección W a escala según dimensiones físicas.
 * Usa un lienzo fijo en px y mapea d/bf/tf/tw manteniendo la proporción real.
 */
export const Section2DViewer: React.FC<Section2DViewerProps> = ({
  d,
  bf,
  tf,
  tw,
  sectionLengthUnit,
  demandCapacityRatio,
}) => {
  let strokeColor = "#10b981";
  let glowColor = "rgba(16, 185, 129, 0.15)";
  if (demandCapacityRatio >= 1.0) {
    strokeColor = "#ef4444";
    glowColor = "rgba(239, 68, 68, 0.2)";
  } else if (demandCapacityRatio >= 0.9) {
    strokeColor = "#f59e0b";
    glowColor = "rgba(245, 158, 11, 0.15)";
  }

  const safeD = Math.max(d, 0.01);
  const safeBf = Math.max(bf, 0.01);
  const safeTf = Math.min(Math.max(tf, 0.001), safeD / 2);
  const safeTw = Math.min(Math.max(tw, 0.001), safeBf);

  // Lienzo fijo (evita width="100%" colapsado en flex)
  const canvas = 200;
  const pad = 36; // espacio para cotas
  const drawW = canvas - pad * 2;
  const drawH = canvas - pad * 2;

  // Escala uniforme para conservar proporción física
  const scale = Math.min(drawW / safeBf, drawH / safeD);
  const w = safeBf * scale;
  const h = safeD * scale;
  const flangeT = safeTf * scale;
  const webT = safeTw * scale;

  const ox = (canvas - w) / 2;
  const oy = (canvas - h) / 2;

  const halfW = w / 2;
  const halfWeb = webT / 2;
  const webTop = flangeT;
  const webBottom = h - flangeT;

  const pathD = [
    `M ${ox},${oy}`,
    `H ${ox + w}`,
    `V ${oy + flangeT}`,
    `H ${ox + halfW + halfWeb}`,
    `V ${oy + webBottom}`,
    `H ${ox + w}`,
    `V ${oy + h}`,
    `H ${ox}`,
    `V ${oy + webBottom}`,
    `H ${ox + halfW - halfWeb}`,
    `V ${oy + webTop}`,
    `H ${ox}`,
    `Z`,
  ].join(" ");

  const fmt = (v: number) => (v >= 10 ? v.toFixed(1) : v.toFixed(2));
  const dimGap = 14;
  const tick = 4;

  return (
    <div className="glass-panel p-5 rounded-xl flex flex-col items-center justify-center gap-4 relative overflow-hidden min-h-80">
      <div className="absolute top-4 left-5 z-10">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Sección W a escala
        </span>
      </div>

      <svg
        width={canvas}
        height={canvas}
        viewBox={`0 0 ${canvas} ${canvas}`}
        className="mt-4 shrink-0 transition-transform duration-300 hover:scale-[1.02]"
        style={{ filter: `drop-shadow(0 0 10px ${glowColor})` }}
        aria-label={`Sección W ${fmt(safeD)}×${fmt(safeBf)} ${sectionLengthUnit}`}
      >
        {/* Ejes de referencia */}
        <line
          x1={ox + halfW}
          y1={oy - 6}
          x2={ox + halfW}
          y2={oy + h + 6}
          stroke="rgba(255,255,255,0.08)"
          strokeDasharray="4 4"
          strokeWidth={1}
        />
        <line
          x1={ox - 6}
          y1={oy + h / 2}
          x2={ox + w + 6}
          y2={oy + h / 2}
          stroke="rgba(255,255,255,0.08)"
          strokeDasharray="4 4"
          strokeWidth={1}
        />

        <path
          d={pathD}
          fill="rgba(55, 65, 81, 0.85)"
          stroke={strokeColor}
          strokeWidth={2.5}
          strokeLinejoin="round"
          className="transition-all duration-300"
        />

        {/* Cota profundidad d (izquierda) */}
        <g stroke="#94a3b8" strokeWidth={1} fill="#94a3b8">
          <line x1={ox - dimGap} y1={oy} x2={ox - dimGap} y2={oy + h} />
          <line x1={ox - dimGap - tick} y1={oy} x2={ox - dimGap + tick} y2={oy} />
          <line
            x1={ox - dimGap - tick}
            y1={oy + h}
            x2={ox - dimGap + tick}
            y2={oy + h}
          />
          <text
            x={ox - dimGap - 8}
            y={oy + h / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#94a3b8"
            fontSize={11}
            transform={`rotate(-90, ${ox - dimGap - 8}, ${oy + h / 2})`}
          >
            {`d = ${fmt(safeD)} ${sectionLengthUnit}`}
          </text>
        </g>

        {/* Cota ancho bf (abajo) */}
        <g stroke="#94a3b8" strokeWidth={1} fill="#94a3b8">
          <line
            x1={ox}
            y1={oy + h + dimGap}
            x2={ox + w}
            y2={oy + h + dimGap}
          />
          <line
            x1={ox}
            y1={oy + h + dimGap - tick}
            x2={ox}
            y2={oy + h + dimGap + tick}
          />
          <line
            x1={ox + w}
            y1={oy + h + dimGap - tick}
            x2={ox + w}
            y2={oy + h + dimGap + tick}
          />
          <text
            x={ox + halfW}
            y={oy + h + dimGap + 12}
            textAnchor="middle"
            dominantBaseline="hanging"
            fill="#94a3b8"
            fontSize={11}
          >
            {`bf = ${fmt(safeBf)} ${sectionLengthUnit}`}
          </text>
        </g>

        {/* Cotas tf / tw */}
        <g fill="#94a3b8" fontSize={10}>
          <text
            x={ox + w + 6}
            y={oy + flangeT / 2}
            dominantBaseline="middle"
          >
            {`tf ${fmt(safeTf)}`}
          </text>
          <text
            x={ox + halfW + halfWeb + 6}
            y={oy + (webTop + webBottom) / 2}
            dominantBaseline="middle"
          >
            {`tw ${fmt(safeTw)}`}
          </text>
        </g>
      </svg>

      <div className="flex flex-wrap justify-center gap-3 text-xs font-semibold text-gray-400">
        <span>
          d×bf = {fmt(safeD)}×{fmt(safeBf)} {sectionLengthUnit}
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: strokeColor }}
          />
          <span>Ratio interacción</span>
        </div>
      </div>
    </div>
  );
};
