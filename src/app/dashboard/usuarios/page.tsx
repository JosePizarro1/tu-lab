"use client";

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useDashboardContext } from '../layout';
import { database, Usuario } from '@/services/db';
import { IconUsers, IconPlus } from '@tabler/icons-react';

export default function UsuariosPage() {
  const { usuario } = useDashboardContext();
  const [usuariosList, setUsuariosList] = useState<Usuario[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nombreInput, setNombreInput] = useState('');
  const [rolInput, setRolInput] = useState('Tecnico');

  const loadUsuarios = async () => {
    const list = await database.getUsuarios();
    setUsuariosList(list);
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

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
      loadUsuarios();
    } else {
      Swal.fire('Error', 'No se pudo crear el usuario.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-jakarta text-base font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <IconUsers className="text-cerulean w-5 h-5" /> Gestión de Usuarios y Accesos
            </h3>
            <p className="text-slate-400 text-xs mt-1">Usuarios registrados en el sistema</p>
          </div>
          {usuario?.rol === 'Administrador' && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2.5 bg-cerulean text-white font-bold uppercase tracking-wider text-[10px] rounded-xl shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <IconPlus className="w-4 h-4" /> Nuevo Usuario
            </button>
          )}
        </div>

        <div className="border border-slate-100 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="p-4">Usuario</th>
                <th className="p-4">Nombre Completo</th>
                <th className="p-4">Rol</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usuariosList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-mono font-bold text-slate-700">{u.username}</td>
                  <td className="p-4 font-bold text-slate-800">{u.nombre}</td>
                  <td className="p-4 font-semibold text-slate-600">{u.rol}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 text-[9px] font-bold uppercase rounded-md ${
                        u.activo ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
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

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-jakarta text-base font-bold text-slate-800 uppercase tracking-wider mb-6">
              Crear Nuevo Usuario
            </h3>

            <form onSubmit={handleCrearUsuario} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 block">
                  Username / Usuario
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="ej. jperez"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-cerulean"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 block">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-cerulean"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 block">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={nombreInput}
                  onChange={(e) => setNombreInput(e.target.value)}
                  placeholder="Juan Pérez"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-cerulean"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 block">
                  Rol del Sistema
                </label>
                <select
                  value={rolInput}
                  onChange={(e) => setRolInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-cerulean cursor-pointer"
                >
                  <option value="Tecnico">Técnico / Biólogo</option>
                  <option value="Secretaria">Secretaría / Recepción</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-cerulean text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md cursor-pointer"
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
