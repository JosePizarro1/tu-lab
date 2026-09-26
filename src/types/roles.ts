export const ROLES = {
  ADMIN: 'ADMINISTRADOR',
  DOCTOR: 'DOCTOR',
  RECEPCIONISTA: 'RECEPCIONISTA',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

export const ROLE_LABELS: Record<UserRole, string> = {
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.DOCTOR]: 'Médico / Doctor',
  [ROLES.RECEPCIONISTA]: 'Recepción / Secretaría',
};

export const ALL_ROLES = Object.values(ROLES) as [UserRole, ...UserRole[]];

export const ROLE_DEFAULT_ROUTES: Record<UserRole, string> = {
  [ROLES.ADMIN]: '/dashboard',
  [ROLES.DOCTOR]: '/dashboard',
  [ROLES.RECEPCIONISTA]: '/dashboard/pacientes',
};

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

export function hasPermission(role: UserRole | string | undefined | null, path: string): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role as UserRole];
  if (!permissions) return false;
  return permissions.includes(path);
}

export function getRoleGreeting(role: UserRole | string | undefined | null, nombre: string): string {
  if (role === ROLES.DOCTOR) return `Bienvenido(a), Dr(a). ${nombre}`;
  if (role === ROLES.ADMIN) return `Bienvenido(a), Administrador(a) ${nombre}`;
  if (role === ROLES.RECEPCIONISTA) return `Bienvenido(a), ${nombre} (Recepción / Admisión)`;
  return `Bienvenido(a), ${nombre}`;
}
