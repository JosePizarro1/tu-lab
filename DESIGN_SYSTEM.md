# UNIDOSLAB — Design System & Guidelines

## 1. Typography System

The application uses a two-tier typography architecture to ensure maximum visual hierarchy, clinical trust, and legibility across all devices.

### Primary Typography (Headings & Titles)
- **Font Family**: `Plus Jakarta Sans`, sans-serif (`font-jakarta`)
- **Usage**: Page titles (`h1`), section titles (`h2`), card headers (`h3`, `h4`), metric numbers, and prominent callouts.
- **Weights**: 
  - **Extrabold (800)**: `h1` headlines, metric numbers (e.g. "+5", "5,125+").
  - **Bold (700)**: Section titles, card headlines, buttons.
  - **Semibold (600)**: Subheadings, badges.

### Body Typography (Content & UI Copy)
- **Font Family**: `IBM Plex Sans`, sans-serif (`font-plex`)
- **Usage**: Paragraphs, descriptions, form labels, table cells, modal copy, and footer text.
- **Weights**:
  - **Regular (400)**: Long text, descriptive paragraphs.
  - **Medium (500)**: Secondary labels, metadata.
  - **Bold (700)**: Important highlights, status labels.

---

## 2. Corner Radius & Shape System (Estilo Redondeado Moderno)

To maintain a friendly, human-centric, and state-of-the-art medical aesthetics, UNIDOSLAB adopts **soft rounded shapes** across all components. Strict square edges (`rounded-none`, `rounded-xs`) are replaced with the following scale:

| Level | Class | Application |
| :--- | :--- | :--- |
| **Hero & Main Containers** | `rounded-3xl` (24px) | Hero cards, main section containers, outer cards in Sedes/Resultados |
| **Cards & Modals** | `rounded-2xl` (16px) | Feature cards, modal windows, form panels, result report boxes |
| **Inputs & Sub-cards** | `rounded-xl` (12px) | Text inputs, dropdowns, table wrappers, search boxes |
| **Badges & CTAs** | `rounded-full` (9999px) | Primary action buttons, status pills, floating WhatsApp button |

---

## 3. Brand Color Palette

- **Unidos Red (Accent)**: `#E52320` (`--color-unidos-red`)
- **Unidos Navy (Header/Primary)**: `#1E3A4C` (`--color-unidos-navy`)
- **Dark Neutral (Cards)**: `#2D3139`
- **Light Slate (Backgrounds)**: `#F8FAFC` (`bg-slate-50`)
- **Clinical Emerald (Status/Success)**: `#10B981` / `#25D366`

---

## 4. Iconography Standards

- **Library**: `@tabler/icons-react` & Custom Vector SVGs.
- **Style**: 2px stroke weight, clean linear vectors.
- **Icon Enclosures**: Contained inside `rounded-full` or `rounded-3xl` backgrounds with soft subtle shadows (`shadow-sm`, `shadow-lg shadow-slate-200/70`).
