# Plan & Checklist de Tipografía UNIDOSLAB

## Objetivo
Garantizar la coherencia y uniformidad tipográfica en todos los componentes de la aplicación UNIDOSLAB, solucionando discrepancias en la navegación del Header, títulos, botones y cuerpo de texto.

---

## 1. Definición del Estándar Tipográfico

| Rol Visual | Fuente Tailwind Class | Fuente CSS Real | Aplicación Recomendada |
| :--- | :--- | :--- | :--- |
| **Navegación Header & Menús** | `font-jakarta` | Plus Jakarta Sans | Opciones del menú (INICIO, SERVICIOS, etc.), botones y dropdowns |
| **Encabezados Principales (`h1`, `h2`)** | `font-jakarta` | Plus Jakarta Sans | Títulos de Hero, Secciones y Modales (`font-extrabold` / `font-bold`) |
| **Subtítulos y Tarjetas (`h3`, `h4`)** | `font-jakarta` | Plus Jakarta Sans | Nombres de servicios, títulos de sedes y tarjetas (`font-bold`) |
| **Botones de Acción (CTAs)** | `font-jakarta` | Plus Jakarta Sans | Botones de WhatsApp, Acceso a Resultados, Filtros (`font-bold`) |
| **Cuerpo de Texto & Párrafos (`p`, `span`)** | `font-plex` | IBM Plex Sans | Descripciones, texto informativo, direcciones y notas (`font-normal` / `font-medium`) |

---

## 2. Checklist de Verificación por Componente

- [x] **`Header.tsx`**:
  - Aplicar `font-jakarta` a los enlaces de navegación desktop (`INICIO`, `SERVICIOS`, `SOY MÉDICO`, `SEDES`, `RESULTADOS`).
  - Aplicar `font-jakarta` a los ítems del menú desplegable de servicios.
  - Aplicar `font-jakarta` al menú móvil desplegable.
- [x] **`Home.tsx`**:
  - `font-jakarta` en el título del Hero ("Diagnóstico en análisis clínicos...").
  - `font-jakarta` en las 4 tarjetas oscuras de servicios.
  - `font-jakarta` en el bloque de estadísticas ("¿Por qué atenderse en UNIDOSLAB?").
  - `font-jakarta` en la sección de 3 pasos ("Recibe Tus Resultados...").
- [x] **`Services.tsx`**:
  - `font-jakarta` en el buscador, botones de categoría y nombres de exámenes.
- [x] **`Sedes.tsx`**:
  - `font-jakarta` en los nombres de sedes y botones de Google Maps.
- [x] **`Login.tsx`**:
  - `font-jakarta` en títulos del portal de médicos.
- [x] **`page.tsx` (Resultados & Footer)**:
  - `font-jakarta` en los títulos de consulta y reportes de resultados.
