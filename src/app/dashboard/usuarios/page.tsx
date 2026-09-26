"use client";

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useDashboardContext } from '../layout';
import { database, Usuario } from '@/services/db';
import { IconUsers, IconPlus, IconShieldLock, IconX } from '@tabler/icons-react';
import { ROLES, ROLE_LABELS, UserRole, hasPermission } from '@/types/roles';

export default function UsuariosPage() {
  const { usuario } = useDashboardContext();
  const [usuariosList, setUsuariosList] = useState<Usuario[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nombreInput, setNombreInput] = useState('');
  const [rolInput, setRolInput] = useState<UserRole>(ROLES.DOCTOR);

  const loadUsuarios = async () => {
    const list = await database.getUsuarios();
    setUsuariosList(list);
  };

  useEffect(() => {
    if (hasPermission(usuario?.rol, '/dashboard/usuarios')) {
      loadUsuarios();
    }
  }, [usuario?.rol]);

  if (!hasPermission(usuario?.rol, '/dashboard/usuarios')) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] font-sans">
        <IconShieldLock className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="font-jakarta text-lg font-extrabold text-slate-900 mb-2">Acceso Restringido</h3>
        <p className="text-slate-500 text-xs max-w-md mx-auto">Tu rol actual ({usuario?.rol || 'Sin Rol'}) no tiene permisos para administrar Usuarios y Accesos.</p>
      </div>
    );
  }

  const handleCrearUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput || !passwordInput || !nombreInput) return;

    const ok = await database.crearUsuario({
      username: usernameInput,
      password: passwordInput,
      nombre: nombreInput,
      rol: rolInput,
    });

    if (ok) {
      Swal.fire('Éxito', 'Usuario creado correctamente.', 'success');
      setShowModal(false);
      setUsernameInput('');
      setPasswordInput('');
      setNombreInput('');
      setRolInput(ROLES.DOCTOR);
      loadUsuarios();
    } else {
      Swal.fire('Error', 'No se pudo crear el usuario.', 'error');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-jakarta text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <IconUsers className="text-[#fb5962] w-5 h-5" />
              <span>Gestión de Usuarios y Accesos</span>
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">Control de cuentas de acceso clínico y roles autorizados</p>
          </div>
          {usuario?.rol === ROLES.ADMIN && (
            <button
              onClick={() => setShowModal(true)}
              className="px-3.5 py-2 bg-[#fb5962] hover:bg-[#e54550] text-white font-bold text-xs rounded-xl shadow-md shadow-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <IconPlus className="w-4 h-4" />
              <span>Nuevo Usuario</span>
            </button>
          )}
        </div>

        <div className="border border-slate-200/70 rounded-2xl overflow-x-auto shadow-2xs">
          <table className="w-full text-left text-xs border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/70 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4">Usuario</th>
                <th className="py-3.5 px-4">Nombre Completo</th>
                <th className="py-3.5 px-4">Rol Asignado</th>
                <th className="py-3.5 px-4 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usuariosList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{u.username}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{u.nombre}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-600">
                    <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-md bg-[#fff0f1] text-[#fb5962] border border-[#fb5962]/20">
                      {ROLE_LABELS[u.rol as UserRole] || u.rol}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-extrabold uppercase rounded-md border ${
                        u.activo ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' : 'bg-rose-50 text-rose-700 border-rose-200/60'
                      }`}
                    >
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear Usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200/80">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <h3 className="font-jakarta text-base font-extrabold text-slate-900">
                Crear Nuevo Usuario
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCrearUsuario} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-1.5 block">
                  Username / Identificador
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="ej. jperez"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#fb5962] focus:bg-white transition-all font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-1.5 block">
                  Contraseña Temporal
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#fb5962] focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-1.5 block">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={nombreInput}
                  onChange={(e) => setNombreInput(e.target.value)}
                  placeholder="Juan Pérez García"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#fb5962] focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-1.5 block">
                  Rol Clínico Asignado
                </label>
                <select
                  value={rolInput}
                  onChange={(e) => setRolInput(e.target.value as UserRole)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#fb5962] focus:bg-white cursor-pointer"
                >
                  {Object.entries(ROLES).map(([_, roleValue]) => (
                    <option key={roleValue} value={roleValue}>
                      {ROLE_LABELS[roleValue]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#fb5962] hover:bg-[#e54550] text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md shadow-rose-500/20 transition-all cursor-pointer"
                >
                  Guardar Usuario
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="py-3 px-4 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
