"use client";

import React from 'react';
import { IconFileText, IconShieldCheck, IconArrowLeft, IconCheck } from '@tabler/icons-react';

interface TerminosProps {
  onBack?: () => void;
}

const Terminos: React.FC<TerminosProps> = ({ onBack }) => {
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

        {/* Tarjeta Principal de Términos */}
        <article className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 sm:p-12 text-slate-700 space-y-8">
          
          <header className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-100 text-[10px] font-extrabold uppercase tracking-widest text-[#E52320] mb-3">
              <IconFileText className="w-3.5 h-3.5" />
              Documento Legal
            </div>
            <h1 className="font-jakarta text-3xl sm:text-4xl font-extrabold text-[#1E3A4C] tracking-tight">
              Términos y Condiciones de Servicio
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-2">
              Última actualización: 2026 · UNIDOSLAB Tacna, Perú
            </p>
          </header>

          {/* Sección 1: Aceptación */}
          <section className="space-y-3">
            <h2 className="font-jakarta text-lg font-extrabold text-[#1E3A4C] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-50 text-[#E52320] text-xs flex items-center justify-center font-bold">1</span>
              Aceptación y Alcance del Servicio
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Al acceder al sitio web, consultar resultados en línea o solicitar servicios en cualquiera de las sedes de <strong>UNIDOSLAB</strong>, usted acepta los presentes Términos de Servicio. Estos regulan la toma de muestras, procesamiento de análisis clínicos y la entrega digital o física de informes diagnósticos.
            </p>
          </section>

          {/* Sección 2: Identificación y Ubicación */}
          <section className="space-y-3">
            <h2 className="font-jakarta text-lg font-extrabold text-[#1E3A4C] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-50 text-[#E52320] text-xs flex items-center justify-center font-bold">2</span>
              Identificación del Laboratorio
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>UNIDOSLAB</strong> es un laboratorio clínico especializado con sede principal y sucursales en la ciudad de Tacna, Perú, debidamente autorizado para la ejecución de pruebas analíticas, microbiológicas, hormonales y de patología clínica.
            </p>
          </section>

          {/* Sección 3: Consulta y Entrega de Resultados */}
          <section className="space-y-3">
            <h2 className="font-jakarta text-lg font-extrabold text-[#1E3A4C] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-50 text-[#E52320] text-xs flex items-center justify-center font-bold">3</span>
              Emisión y Consulta de Resultados en Línea
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <IconCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>La consulta web de resultados requiere el número de documento de identidad (DNI o Carné de Extranjería) y/o el código de orden emitido al momento de la toma.</span>
              </li>
              <li className="flex items-start gap-2">
                <IconCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Los reportes en formato PDF descargables tienen validez informativa oficial y cuentan con los controles de calidad analítica correspondientes.</span>
              </li>
              <li className="flex items-start gap-2">
                <IconCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Los resultados deben ser siempre interpretados por su médico tratante en conjunto con su historial clínico.</span>
              </li>
            </ul>
          </section>

          {/* Sección 4: Responsabilidad del Paciente */}
          <section className="space-y-3">
            <h2 className="font-jakarta text-lg font-extrabold text-[#1E3A4C] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-50 text-[#E52320] text-xs flex items-center justify-center font-bold">4</span>
              Veracidad de la Información
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              El paciente o usuario es responsable de brindar datos de identidad correctos y seguir las indicaciones previas a cada prueba (ayuno, recolección de muestras, medicación previa) para asegurar la precisión y validez técnica de los análisis.
            </p>
          </section>

          {/* Sección 5: Modificaciones */}
          <section className="space-y-3">
            <h2 className="font-jakarta text-lg font-extrabold text-[#1E3A4C] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-50 text-[#E52320] text-xs flex items-center justify-center font-bold">5</span>
              Modificaciones y Contacto
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              UNIDOSLAB se reserva el derecho de actualizar estos términos para cumplir con mejoras operativas o normativas sanitarias peruanas. Para cualquier duda, puede contactarnos a través de nuestros canales oficiales en Tacna o al correo <strong>uniilab.laboratorioclinico@outlook.es</strong>.
            </p>
          </section>

        </article>
      </div>
    </main>
  );
};

export default Terminos;
