# Sistema de Roles y Control de Acceso (RBAC) - UNIDOSLAB

Este documento describe la arquitectura de control de acceso basado en roles (**Role-Based Access Control - RBAC**) implementada en el sistema LIS (Laboratory Information System) de **UNIDOSLAB**.

---

## 1. Definición de Roles

El sistema cuenta con tres roles principales tipados de manera estricta:

| Rol (Código) | Etiqueta en UI | Perfil y Responsabilidad |
|---|---|---|
| **`ADMINISTRADOR`** | Administrador | Dirección general, supervisión de sedes, gestión de cuentas de usuario, inventario global y reportes. |
| **`DOCTOR`** | Médico / Biólogo / Analista | Personal clínico del área analítica. Carga y validación de resultados de análisis, generación de informes clínicos y control del stock de reactivos. |
| **`RECEPCIONISTA`** | Recepción / Secretaría | Personal de admisión y atención al paciente. Registro de pacientes (con autocompletado RENIEC), emisión de órdenes y entrega de resultados PDF completados. |

---

## 2. Matriz de Acceso por Módulo

| Módulo | Ruta | `ADMINISTRADOR` | `DOCTOR` | `RECEPCIONISTA` |
|---|---|:---:|:---:|:---:|
| **Resumen General** | `/dashboard` | Acceso Total | Métricas Clínicas | Métricas de Pacientes |
| **Pacientes** | `/dashboard/pacientes` | Acceso Total | Consulta de Historial | Registro / RENIEC / Órdenes |
| **Resultados Clínicos** | `/dashboard/resultados` | Acceso Total | Carga, Edición y Validación | Descarga y Entrega de PDF |
| **Inventario / Reactivos** | `/dashboard/inventario` | Acceso Total | Control de Insumos y Consumo | ❌ Bloqueado |
| **Sedes** | `/dashboard/sedes` | Configuración Global | ❌ Bloqueado | ❌ Bloqueado |
| **Usuarios y Accesos** | `/dashboard/usuarios` | Gestión de Cuentas | ❌ Bloqueado | ❌ Bloqueado |

---

## 3. Implementación Técnica

### Fuente Única de Verdad (Single Source of Truth)
Definida en [`src/types/roles.ts`](file:///Users/parzival/JOse/demo-lab/src/types/roles.ts):

```typescript
export const ROLES = {
  ADMIN: 'ADMINISTRADOR',
  DOCTOR: 'DOCTOR',
  RECEPCIONISTA: 'RECEPCIONISTA',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [ROLES.ADMIN]: [
    '/dashboard',
    '/dashboard/pacientes',
    '/dashboard/resultados',
    '/dashboard/inventario',
    '/dashboard/sedes',
    '/dashboard/usuarios',
  ],
  [ROLES.DOCTOR]: [
    '/dashboard',
    '/dashboard/pacientes',
    '/dashboard/resultados',
    '/dashboard/inventario',
  ],
  [ROLES.RECEPCIONISTA]: [
    '/dashboard',
    '/dashboard/pacientes',
    '/dashboard/resultados',
  ],
};
```

### Funciones Helper
```typescript
export function hasPermission(role: UserRole | string | undefined | null, path: string): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role as UserRole];
  if (!permissions) return false;
  return permissions.includes(path);
}
```

---

## 4. Usuarios Iniciales de Prueba (Seed)

Para entornos de desarrollo y pruebas, el sistema precarga los siguientes usuarios iniciales:

| Usuario | Contraseña | Rol Asignado |
|---|---|---|
| `admin` | `admin` | `ADMINISTRADOR` |
| `doctor` | `doctor` | `DOCTOR` |
| `recepcion` | `recepcion` | `RECEPCIONISTA` |
