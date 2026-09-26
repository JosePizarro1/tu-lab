# Sistema de Diseño y Guía de Estilos UI (Design System) - UNIDOSLAB LIS

Este documento define la **identidad visual, paleta de colores oficial, componentes atómicos, tipografía y lineamientos de UX/UI** para el sistema interno de **UNIDOSLAB**, alineados con la identidad de marca (Coral & Rosado Suave) y la arquitectura de interfaz SaaS de alta gama.

---

## 1. Filosofía Visual y Principios de Diseño

1. **Claridad Clínica & Identidad de Marca (Coral & Rosado Suave):**
   * Fondos neutros y limpios con una superficie suave (`#F4F6FA`), tarjetas en blanco puro (`#FFFFFF`) con bordes microscópicos (`border border-slate-200/80`) y sombras de elevación difusas (`shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]`).
   * **Acento Institucional**: El color principal de interacción es el **Coral UNIDOSLAB (`#FB5962`)** acompañado por fondos en **Rosado Suave (`#FFF0F1`)**, logrando coherencia visual absoluta entre la Landing Page y el Dashboard interno.

2. **Jerarquía Visual Inmediata:**
   * La vista de un médico o recepcionista encuentra la información en menos de 2 segundos: datos del paciente en tipografía destacada, estados con micro-badges semánticos y acciones primarias con contraste claro.

3. **Interactividad y Micro-animaciones:**
   * Botones con elevación sutil al hacer hover (`shadow-md shadow-rose-500/20`).
   * Transiciones suaves (`transition-all duration-200 ease-out`).
   * Backdrops con desenfoque de cristal (`backdrop-blur-md bg-slate-900/40`).

---

## 2. Paleta de Colores Oficial (Design Tokens)

### A. Colores Primarios y de Marca
| Token | Código HEX | Tailwind Class | Uso |
|---|---|---|---|
| **UNIDOSLAB Coral (Principal)** | `#FB5962` | `bg-[#fb5962]` / `text-[#fb5962]` | Botones primarios, enlaces activos, selecciones activas en sidebar. |
| **UNIDOSLAB Coral Dark (Hover)** | `#E54550` | `hover:bg-[#e54550]` | Estado hover en botones primarios. |
| **Coral Soft (Rosado Suave)** | `#FFF0F1` | `bg-[#fff0f1]` / `text-[#fb5962]` | Badges de acento, fondos de iconos activos, selector de sedes. |
| **Navy Deep (Texto & Cabeceras)** | `#0F172A` | `text-slate-900` | Títulos principales, códigos de orden, nombres de pacientes. |

### B. Superficies y Neutros (Backgrounds & Cards)
| Token | Código HEX | Tailwind Class | Uso |
|---|---|---|---|
| **App Canvas (Fondo Global)** | `#F4F6FA` | `bg-[#F4F6FA]` | Fondo general de todo el dashboard. |
| **Surface Card (Tarjetas)** | `#FFFFFF` | `bg-white` | Contenedores de tablas, modales, widgets y formularios. |
| **Subtle Fill (Inputs & Badges)** | `#F8FAFC` | `bg-slate-50` / `bg-slate-100/70` | Fondos de campos de texto, tablas alternas y toolbars. |
| **Border Soft (Bordes de Contenedor)** | `#E2E8F0` | `border-slate-200/80` | Líneas divisorias y delimitadores suaves. |
| **Muted Text (Etiquetas y Leyendas)** | `#64748B` | `text-slate-500` / `text-slate-400` | Subtítulos, unidades de medida y valores normales. |

### C. Colores Semánticos (Estados Clínicos)
| Estado | Color Fondo | Color Texto | Borde |
|---|---|---|---|
| **Completado / Validado** | `bg-emerald-50` | `text-emerald-700` | `border-emerald-200/60` |
| **En Proceso / Pendiente** | `bg-amber-50` | `text-amber-700` | `border-amber-200/60` |
| **Crítico / Alerta de Stock** | `bg-rose-50` | `text-rose-700` | `border-rose-200/60` |

---

## 3. Especificación de Componentes UI

### A. Botones (Button Styles)

1. **Botón Primario (Coral CTA):**
   ```tsx
   className="px-3.5 py-2 bg-[#fb5962] hover:bg-[#e54550] text-white font-bold text-xs rounded-xl shadow-md shadow-rose-500/20 transition-all cursor-pointer flex items-center gap-1.5"
   ```

2. **Botón Suave (Rosado Soft Outline):**
   ```tsx
   className="px-3 py-1.5 bg-[#fff0f1] hover:bg-[#fb5962] text-[#fb5962] hover:text-white font-bold text-xs rounded-xl border border-[#fb5962]/20 transition-all cursor-pointer shadow-2xs"
   ```

3. **Botón de Acción Rápida (Icon Button):**
   ```tsx
   className="p-2 bg-slate-50 hover:bg-[#fff0f1] text-slate-600 hover:text-[#fb5962] rounded-xl border border-slate-200/70 transition-all cursor-pointer shadow-2xs"
   ```

---

## 4. Módulos Estandarizados

* **Sidebar:** Enlace activo en coral institucional (`bg-[#fb5962] text-white`) con avatar y cierre de sesión discreto.
* **Header:** Barra translúcida con badge de versión en rosado suave (`bg-[#fff0f1] text-[#fb5962]`) y selector de sedes con icono tematizado.
* **Resultados Clínicos:** Métricas, tabla con micro-badges, modal de captura con inputs y live preview en tiempo real.
* **Pacientes:** Formularios con validación RENIEC, emisión rápida de órdenes conectada al Catálogo Maestro.
* **Inventario:** Control de reactivos con alertas automáticas de stock.
* **Sedes:** Integración en vivo con Google Maps y creación/edición dinámica.
* **Usuarios:** Administración con RBAC para roles `ADMINISTRADOR`, `DOCTOR` y `RECEPCIONISTA`.
