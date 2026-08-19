"use client";

import React from 'react';
import { IconShieldCheck, IconLock, IconArrowLeft, IconCheck, IconUserCheck, IconEyeCheck } from '@tabler/icons-react';

interface PrivacidadProps {
  onBack?: () => void;
}

const Privacidad: React.FC<PrivacidadProps> = ({ onBack }) => {
  return (
    <main className="w-full min-h-[calc(100vh-140px)] bg-slate-50/60 py-12 px-4 sm:px-6 lg:px-8 font-plex select-none">
      <div className="max-w-4xl mx-auto">
        
        {/* Botón Volver */}
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#E52320] mb-6 transition-colors cursor-pointer uppercase tracking-wider"
          >
            <IconArrowLeft className="w-4 h-4" />
            <span>Volver al Inicio</span>
          </button>
        )}

        {/* Tarjeta Principal de Privacidad */}
        <article className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 sm:p-12 text-slate-700 space-y-8">
          
          <header className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 mb-3">
              <IconShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Protección de Datos en Salud
            </div>
            <h1 className="font-jakarta text-3xl sm:text-4xl font-extrabold text-[#1E3A4C] tracking-tight">
              Política de Privacidad y Confidencialidad
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-2">
              Conforme a la Ley N° 29733 (Ley de Protección de Datos Personales del Perú) · UNIDOSLAB Tacna
            </p>
          </header>

          {/* Sección 1: Compromiso de Privacidad */}
          <section className="space-y-3">
            <h2 className="font-jakarta text-lg font-extrabold text-[#1E3A4C] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 text-xs flex items-center justify-center font-bold">1</span>
              Compromiso con tus Datos de Salud
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              En <strong>UNIDOSLAB</strong> garantizamos la máxima confidencialidad, integridad y seguridad en el tratamiento de los datos personales y de salud de nuestros pacientes, cumpliendo estrictamente con la legislación peruana y las normas del Ministerio de Salud (MINSA).
            </p>
          </section>

          {/* Sección 2: Información que Recopilamos */}
          <section className="space-y-3">
            <h2 className="font-jakarta text-lg font-extrabold text-[#1E3A4C] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 text-xs flex items-center justify-center font-bold">2</span>
              Información Recopilada
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Recopilamos únicamente la información estrictamente necesaria para la prestación del servicio médico:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 pl-2">
              <li className="flex items-start gap-2">
                <IconCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Datos de identificación:</strong> Nombres, apellidos, tipo y número de documento (DNI, C.E.), fecha de nacimiento, teléfono y correo electrónico.</span>
              </li>
              <li className="flex items-start gap-2">
                <IconCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Datos de salud:</strong> Tipo de examen solicitado, orden médica, valores analíticos y resultados de patología clínica.</span>
              </li>
            </ul>
          </section>

          {/* Sección 3: Finalidad del Tratamiento */}
          <section className="space-y-3">
            <h2 className="font-jakarta text-lg font-extrabold text-[#1E3A4C] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 text-xs flex items-center justify-center font-bold">3</span>
              Finalidad del Tratamiento
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Tus datos son utilizados exclusivamente para:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 font-medium">
                ✔ Procesamiento y emisión de resultados de análisis clínicos.
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 font-medium">
                ✔ Notificación del estado de entrega y acceso seguro al portal web.
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 font-medium">
                ✔ Coordinación de tomas de muestra a domicilio o en sedes.
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 font-medium">
                ✔ Cumplimiento de obligaciones epidemiológicas y regulatorias de ley.
              </div>
            </div>
          </section>

          {/* Sección 4: Seguridad y Confidencialidad */}
          <section className="space-y-3">
            <h2 className="font-jakarta text-lg font-extrabold text-[#1E3A4C] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 text-xs flex items-center justify-center font-bold">4</span>
              Seguridad y Cifrado
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Implementamos protocolos de seguridad informática (cifrado SSL en tránsito, bases de datos protegidas y acceso por roles) para impedir la adulteración, pérdida o acceso no autorizado a los historiales clínicos. Nunca vendemos ni compartimos sus datos con terceros con fines comerciales.
            </p>
          </section>

          {/* Sección 5: Derechos ARCO */}
          <section className="space-y-3">
            <h2 className="font-jakarta text-lg font-extrabold text-[#1E3A4C] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 text-xs flex items-center justify-center font-bold">5</span>
              Ejercicio de Derechos ARCO
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Como titular de sus datos, usted puede ejercer en cualquier momento sus derechos de <strong>Acceso, Rectificación, Cancelación y Oposición (ARCO)</strong> enviando una solicitud a <strong>uniilab.laboratorioclinico@outlook.es</strong> o presentándose con su documento de identidad en nuestra sede principal de Tacna.
            </p>
          </section>

        </article>
      </div>
    </main>
  );
};

export default Privacidad;
