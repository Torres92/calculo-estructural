# Cálculo de columnas

Software web de cálculo estructural para columnas de acero, basado en **AISC 360-16** (compresión axial Cap. E y flexocompresión biaxial Cap. H).

Orientado a ingenieros: entradas a la izquierda, resultados y sección 2D a la derecha, con conversión métrico ↔ inglés sin perder los valores ingresados.

## Qué incluye hoy

- Compresión axial (KL/r, Fe, Fcr, Pn, φPn, ASD)
- Interacción biaxial H1-1a / H1-1b (Pu, Mux, Muy)
- Ratio demanda/capacidad con semáforo (verde / amarillo / rojo)
- Visualizador SVG de sección W a escala con cotas
- Unidades métricas (t, m, cm, kg/cm²) e imperiales (kips, ft, in, ksi)

## Stack

React · TypeScript · Vite · Tailwind CSS · Vitest

Arquitectura en capas: `domain` (motores puros) → `application` (hooks/contexto) → `presentation` (UI).

## Cómo correrlo

```bash
npm install
npm run dev
```

Otros comandos:

```bash
npm test        # tests unitarios (Vitest)
npm run build   # build de producción
npm run lint    # Oxlint
```

## Roadmap

Ver [roadmap.md](roadmap.md) para el plan por fases (concreto ACI, PDF, multimódulo, etc.).

## Licencia

Proyecto privado (`private` en `package.json`). Ajusta la licencia si lo publicas de forma abierta.
