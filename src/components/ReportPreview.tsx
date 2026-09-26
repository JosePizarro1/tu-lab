"use client";

import React, { useRef } from 'react';
import { 
  IconPrinter, 
  IconFileTypePdf, 
  IconFileTypeDocx,
  IconCheck
} from '@tabler/icons-react';
import { Paciente, PruebaClinica, Sede } from '@/services/db';
import { getExamenByIdOrName, ParametroExamen } from '@/lib/catalogExamenes';
import { downloadReportPDF, downloadReportWord, parseResultadosMap } from '@/lib/reportGenerator';

interface ReportPreviewProps {
  paciente?: Partial<Paciente> | null;
  prueba: PruebaClinica;
  sede?: Sede | string;
  valoresResultados?: Record<string, string>;
  onDownload?: () => void;
  showActions?: boolean;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({
  paciente,
  prueba,
  sede,
  valoresResultados,
  showActions = true,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const examenDef = getExamenByIdOrName(prueba.examen);
  const categoria = examenDef?.categoria || 'HEMATOLOGÍA';

  // Si no se pasaron valores en tiempo real, parsear los de la prueba
  const currentValues = valoresResultados || parseResultadosMap(prueba.resultado);

  const parametros: ParametroExamen[] = examenDef?.parametros || [
    { id: 'default_val', nombre: prueba.examen, unidad: '', valorReferencial: 'Dentro de límites normales' },
  ];

  const nombreCompleto = paciente ? `${paciente.nombre || ''} ${paciente.apellido || ''}`.trim() : (prueba.pacienteDni || 'NO ESPECIFICADO');
  const fechaDoc = prueba.fecha || new Date().toISOString().split('T')[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    await downloadReportPDF({
      paciente: paciente || { dni: prueba.pacienteDni },
      prueba,
      sede,
      valoresResultados: currentValues,
    });
  };

  const handleDownloadWord = () => {
    downloadReportWord({
      paciente: paciente || { dni: prueba.pacienteDni },
      prueba,
      sede,
      valoresResultados: currentValues,
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
      {/* Barra superior de acciones limpias */}
      {showActions && (
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-2.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Formato Oficial UNIDOSLAB
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Botón Imprimir */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-700/60"
              title="Imprimir Informe"
            >
              <IconPrinter className="w-4 h-4 text-slate-300" />
              <span>Imprimir</span>
            </button>

            {/* Botón Word */}
            <button
              type="button"
              onClick={handleDownloadWord}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-900/60 hover:bg-sky-800 text-sky-200 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer border border-sky-700/50"
              title="Descargar en formato Word (.doc)"
            >
              <IconFileTypeDocx className="w-4 h-4 text-sky-300" />
              <span>Word</span>
            </button>

            {/* Botón PDF */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-600/20 cursor-pointer"
              title="Descargar Informe en PDF"
            >
              <IconFileTypePdf className="w-4 h-4" />
              <span>PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Contenedor de la Hoja A4 con fondo membretado */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center bg-slate-200/70">
        <div 
          ref={printRef}
          className="relative w-full max-w-[650px] bg-white rounded-xl shadow-2xl overflow-hidden p-8 sm:p-12 flex flex-col justify-between min-h-[920px] font-sans print:m-0 print:p-8 print:shadow-none print:border-none"
          style={{ 
            aspectRatio: '1 / 1.414',
            backgroundImage: 'url(/plantilla-membrete-oficial.png)',
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center top'
          }}
        >
          {/* Contenido Superior / Cuerpo del Informe */}
          <div className="pt-24 sm:pt-28">
            
            {/* Metadatos del Paciente (Alineado con dos puntos) */}
            <div className="text-[11px] sm:text-xs font-bold text-slate-900 leading-relaxed max-w-[420px] mb-6 space-y-1 font-mono">
              <div className="grid grid-cols-[110px_12px_1fr] items-center">
                <span className="font-extrabold tracking-wider text-slate-900 font-sans">PACIENTE</span>
                <span>:</span>
                <span className="font-extrabold text-slate-900 uppercase font-sans">{nombreCompleto}</span>
              </div>
              <div className="grid grid-cols-[110px_12px_1fr] items-center">
                <span className="font-extrabold tracking-wider text-slate-900 font-sans">EDAD</span>
                <span>:</span>
                <span className="font-normal text-slate-800 font-sans">ADULTO</span>
              </div>
              <div className="grid grid-cols-[110px_12px_1fr] items-center">
                <span className="font-extrabold tracking-wider text-slate-900 font-sans">INDICACIÓN</span>
                <span>:</span>
                <span className="font-normal text-slate-800 font-sans">PARTICULAR</span>
              </div>
              <div className="grid grid-cols-[110px_12px_1fr] items-center">
                <span className="font-extrabold tracking-wider text-slate-900 font-sans">FECHA</span>
                <span>:</span>
                <span className="font-normal text-slate-800 font-sans">{fechaDoc}</span>
              </div>
            </div>

            {/* Título Principal Centrado */}
            <div className="text-center my-5">
              <h2 className="font-extrabold text-sm sm:text-base text-slate-950 uppercase tracking-wide inline-block border-b-2 border-slate-900 pb-0.5">
                INFORME DE LABORATORIO
              </h2>
            </div>

            {/* Área Médica Subrayada */}
            <div className="mb-4">
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-950 uppercase tracking-wide inline-block border-b-2 border-slate-900 pb-0.5">
                {categoria}
              </h3>
            </div>

            {/* Cabeceras de Columnas Subrayadas */}
            <div className="grid grid-cols-12 gap-2 text-xs font-extrabold text-slate-950 border-b border-slate-300 pb-1.5 mb-3">
              <div className="col-span-6 underline">Análisis</div>
              <div className="col-span-3 text-center underline">Resultado</div>
              <div className="col-span-3 text-right underline">Valores Normales</div>
            </div>

            {/* Filas de Parámetros y Resultados */}
            <div className="space-y-2 text-[11px] sm:text-xs">
              {parametros.map((param, index) => {
                const rawVal = currentValues[param.id] || (index === 0 && currentValues['default_val']) || '';
                const hasVal = Boolean(rawVal && String(rawVal).trim());

                // Detectar si es un sub-encabezado o parámetro anidado
                const isNested = param.nombre.startsWith('N.º') || param.nombre.startsWith('Nº') || 
                  param.nombre === 'Eosinófilos' || param.nombre === 'Basófilos' || 
                  param.nombre === 'Monocitos' || param.nombre === 'Linfocitos';

                return (
                  <div 
                    key={param.id} 
                    className="grid grid-cols-12 gap-2 items-baseline hover:bg-slate-100/40 rounded px-1 transition-colors"
                  >
                    {/* Columna Análisis */}
                    <div className={`col-span-6 flex items-baseline gap-1 font-bold text-slate-900 ${isNested ? 'pl-6' : ''}`}>
                      <span className="truncate">{param.nombre}</span>
                      <span className="text-slate-500 font-mono">:</span>
                    </div>

                    {/* Columna Resultado + Unidad */}
                    <div className="col-span-3 text-center font-extrabold text-slate-900">
                      {hasVal ? (
                        <span>
                          {rawVal} {param.unidad && <span className="font-normal text-[10px] text-slate-600 ml-1">{param.unidad}</span>}
                        </span>
                      ) : (
                        <span className="text-slate-300 italic text-[10px] font-mono">
                          (pendiente)
                        </span>
                      )}
                    </div>

                    {/* Columna Valores Normales */}
                    <div className="col-span-3 text-right font-medium text-slate-700 text-[10px] sm:text-[11px]">
                      {param.valorReferencial}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Sello y Firma Oficial en la esquina inferior derecha */}
          <div className="flex justify-end pb-24 sm:pb-28">
            <div className="text-center inline-block">
              <img 
                src="/sello-firma-oficial.png" 
                alt="Sello y Firma Oficial Biólogo" 
                className="w-36 sm:w-44 h-auto object-contain mix-blend-multiply opacity-90"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
