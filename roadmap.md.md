### Fase 1: Arquitectura, Entrada Métrica e Indicadores Base (Acero Compresión)
*   **UI/UX:** Layout Split-Screen inicial. Formulario de entradas del perfil a la izquierda, visualización del ratio \(D/C\) con barra de progreso tipo semáforo a la derecha.
*   **Domain:** Implementar `buckling.ts` con tests unitarios en Jest/Vitest.
*   **Hito de Validación:** Validación de entrada intuitiva y velocidad de respuesta (instantánea).

### Fase 2: Flexocompresión, Gráficos SVG Interactivos y Unidades
*   **UI/UX:** Implementación del sistema de cambio de unidades instantáneo (Métrico a Inglés). Dibujo de la sección del perfil en el visualizador 2D SVG respondiendo en tiempo real a las dimensiones físicas ingresadas.
*   **Domain:** Añadir ecuaciones de flexocompresión biaxial y torsión.
*   **Hito de Validación:** Comprobación de que las escalas geométricas y las cotas físicas se leen correctamente en el diagrama SVG.

### Fase 3: Concreto Armado y Trazado de Curva de Interacción P-M
*   **UI/UX:** Visualizador del gráfico de curva de interacción \(P-M\). Permitir al usuario añadir "puntos de carga" visualizables en el plano bidimensional.
*   **Domain:** Implementar el motor de equilibrio tensional del concreto según ACI 318.
*   **Hito de Validación:** Control visual e interactivo de los puntos de diseño estructural que fallan por tensión/compresión.

### Fase 4: Exportación de PDF Inteligente
*   **UI/UX:** Añadir panel de "Configuración de Reporte" para personalizar el nombre del proyecto, ingeniero a cargo, logo, y selección de pasos a mostrar.
*   **Infrastructure:** Desarrollo del motor `pdfReportGenerator.ts`.
*   **Hito de Validación:** Presentación de la memoria generada a ingenieros externos para validar la estructura del PDF comercial.

### Fase 5: Estructura Multimódulo (Vigas y Cimentaciones)
*   **UI/UX:** Menú de navegación lateral colapsable para cambiar entre módulos (Columnas, Vigas, Zapatas) sin perder los parámetros globales del proyecto (f'c, Fy, unidades).
