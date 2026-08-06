# 🧪 Demo Lab - Sistema de Gestión de Laboratorio Clínico

[![Next.js](https://img.shields.io/badge/Next.js-16.2.10-black?style=for-the-badge&logo=next.js)](https.nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![JWT](https://img.shields.io/badge/JWT-Session_Auth-000000?style=for-the-badge&logo=jsonwebtokens)](https://jwt.io)
[![Zod](https://img.shields.io/badge/Zod-Validation-3E67B1?style=for-the-badge&logo=zod)](https://zod.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql)](https://neon.tech)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

Sistema de gestión integral para laboratorios clínicos diseñado para administrar sedes, usuarios, pacientes, reactivos, pruebas clínicas y consulta de identidad en tiempo real mediante integración RENIEC.

---

## 🏗️ Arquitectura del Sistema

El proyecto sigue una arquitectura **Full-Stack Monolítica Modulada** impulsada por **Next.js App Router**:

```text
               ┌────────────────────────────────────────────────────────┐
               │                    CLIENTE (BROWSER)                   │
               └───────────────────────────┬────────────────────────────┘
                                           │ (HTTP / JSON)
                                           │ Cookies HttpOnly (session_token)
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│ NEXT.JS APPLICATION (FULL-STACK)                                                 │
│                                                                                 │
│  [ SECURITY & MIDDLEWARE ]                                                      │
│  └── Next.js Middleware (src/middleware.ts)                                     │
│      ├── Validación de JWT en Cookie session_token                              │
│      └── Protege /dashboard/* y endpoints en /api/*                             │
│                                                                                 │
│  [ FRONTEND / VIEW LAYER ]                                                      │
│  ├── React 19 (Server & Client Components)                                      │
│  ├── Tailwind CSS v4 & Tabler Icons                                             │
│  └── GSAP / Anime.js (Micro-animaciones)                                        │
│                                                                                 │
│  [ BACKEND / API LAYER ]                                                        │
│  └── Next.js Route Handlers (src/app/api/*)                                     │
│      ├── Zod Schemas       -> Validación estricta de entradas y sanitización    │
│      ├── /api/login        -> Autenticación + Firma JWT + Cookie HttpOnly       │
│      ├── /api/logout       -> Limpieza de Cookie de Sesión                      │
│      ├── /api/pacientes    -> CRUD de Pacientes                                 │
│      ├── /api/pruebas      -> Gestión de Pruebas Clínicas                      │
│      ├── /api/reactivos    -> Control de Inventario & Alertas                  │
│      ├── /api/sedes        -> Administración de Sedes                           │
│      ├── /api/usuarios     -> Control de Acceso y Roles                         │
│      ├── /api/reniec       -> Integración Consulta DNI                          │
│      └── /api/seed         -> Poblado Inicial de la DB                          │
└──────────────────────────────────────────┬──────────────────────────────────────┘
                                           │ Neon Serverless Client (@neondatabase/serverless)
                                           ▼
                               ┌───────────────────────┐
                               │   BASE DE DATOS       │
                               │   Neon PostgreSQL     │
                               └───────────────────────┘
```

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** Next.js 16 (App Router)
- **Biblioteca UI:** React 19
- **Estilos:** Tailwind CSS v4
- **Iconos & Animaciones:** Tabler Icons, GSAP, Anime.js
- **Generación de Reportes:** jsPDF

### **Backend, Autenticación & Validación**
- **API Runtime:** Next.js Route Handlers (Node.js / Edge Runtime compatible)
- **Autenticación & Sesiones:** **JWT (`jose`) + Cookies HTTP-Only** (Duración de 30 días con renovación por actividad y protección middleware)
- **Validación de Datos:** **Zod** (Seguridad, inferencia de tipos TypeScript y sanitización de peticiones)
- **Base de Datos:** PostgreSQL en la nube via [Neon Database](https://neon.tech)
- **Cliente DB:** `@neondatabase/serverless` (driver SQL HTTP serverless)

---

## 🚀 Instalación y Ejecución

### 1. Requisitos Previos
- Node.js (v18+ recomendado)
- npm, yarn, pnpm o bun

### 2. Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto y define la conexión a PostgreSQL y la clave secreta de JWT:

```env
DATABASE_URL=postgresql://<usuario>:<password>@<host>/<database>?sslmode=require
JWT_SECRET=tu-clave-secreta-larga-y-segura
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Modo Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

### 5. Construcción para Producción

```bash
npm run build
npm run start
```
