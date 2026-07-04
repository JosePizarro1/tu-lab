"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import Home from '../components/Home';
import Login from '../components/Login';
import Services from '../components/Services';
import Sedes from '../components/Sedes';
import { 
  IconMapPin, 
  IconClock, 
  IconPhone, 
  IconShieldCheck, 
  IconMicroscope,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconHexagon
} from '@tabler/icons-react';

export default function Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [dni, setDni] = useState<string>('');
  const [orderCode, setOrderCode] = useState<string>('');
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleDownloadPDF = () => {
    const { jsPDF } = require('jspdf');
    const doc = new jsPDF();
    
    // Encabezado del reporte
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(14, 165, 233); // Color cerulean
    doc.text("AQUALAB", 20, 20);
    
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("CLINICAL OPERATIONS", 20, 25);
    
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 28, 190, 28);
    
    // Información del Paciente
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Paciente: JUAN PÉREZ GARCÍA`, 20, 38);
    doc.text(`DNI: ${dni || '12345678'}`, 20, 44);
    doc.text(`Codigo de Orden: ${orderCode || 'ORD-2026-8871'}`, 20, 50);
    doc.text(`Fecha de Emision: 03/07/2026`, 130, 38);
    doc.text(`Estado: Completado`, 130, 44);
    
    doc.line(20, 55, 190, 55);
    
    // Tabla de Exámenes
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("Resultados de Analisis Clinico", 20, 65);
    
    doc.setFontSize(10);
    doc.text("Examen", 20, 75);
    doc.text("Resultado", 80, 75);
    doc.text("Unidades", 120, 75);
    doc.text("Valores de Referencia", 150, 75);
    
    doc.line(20, 78, 190, 78);
    
    doc.setFont("helvetica", "normal");
    // Fila 1
    doc.text("Hemoglobina", 20, 86);
    doc.setFont("helvetica", "bold");
    doc.text("14.5", 80, 86);
    doc.setFont("helvetica", "normal");
    doc.text("g/dL", 120, 86);
    doc.text("13.8 - 17.2", 150, 86);
    
    // Fila 2
    doc.text("Glucosa en Ayunas", 20, 94);
    doc.setFont("helvetica", "bold");
    doc.text("85", 80, 94);
    doc.setFont("helvetica", "normal");
    doc.text("mg/dL", 120, 94);
    doc.text("70 - 100", 150, 94);
    
    // Fila 3
    doc.text("Colesterol Total", 20, 102);
    doc.setFont("helvetica", "bold");
    doc.text("198", 80, 102);
    doc.setFont("helvetica", "normal");
    doc.text("mg/dL", 120, 102);
    doc.text("< 200", 150, 102);
    
    // Fila 4
    doc.text("Trigliceridos", 20, 110);
    doc.setFont("helvetica", "bold");
    doc.text("135", 80, 110);
    doc.setFont("helvetica", "normal");
    doc.text("mg/dL", 120, 110);
    doc.text("< 150", 150, 110);
    
    doc.line(20, 115, 190, 115);
    
    // Nota de personalización solicitada
    doc.setFont("helvetica", "oblique");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("Nota: Este reporte es un modelo demo de AquaLab. El diseno y contenido de este documento PDF es 100% personalizable.", 20, 125);
    
    doc.save(`reporte-${orderCode || 'ORD-8871'}.pdf`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return <Home setActiveTab={setActiveTab} />;
      
      case 'soy_medico':
        return <Login onLoginSuccess={() => {
          sessionStorage.setItem('isLoggedIn', 'true');
          router.push('/dashboard');
        }} />;
      
      case 'servicios':
        return <Services />;

      case 'sedes':
        return <Sedes />;

      case 'resultados':
        return (
          <div className="max-w-2xl mx-auto px-6 py-12 font-plex">
            {!showResults ? (
              <div className="max-w-md mx-auto bg-white border border-slate-100 rounded-2xl shadow-lg p-10">
                <header className="mb-8 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-azure-mist border border-lab-border rounded-full mb-4">
                    <IconShieldCheck className="text-cerulean w-8 h-8" />
                  </div>
                  <h2 className="font-jakarta text-2xl font-extrabold text-slate-900 tracking-tight">Consulte sus Resultados</h2>
                  <p className="text-slate-500 mt-2 text-xs">Ingrese los datos indicados en su orden de atención.</p>
                </header>
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setShowResults(true); }}>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 block">Número de Documento</label>
                    <input 
                      type="text" 
                      required 
                      value={dni} 
                      onChange={(e) => setDni(e.target.value)} 
                      placeholder="DNI / C.E." 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cerulean focus:bg-white text-slate-700 font-medium text-sm transition-all" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 block">Código de Orden</label>
                    <input 
                      type="text" 
                      required 
                      value={orderCode} 
                      onChange={(e) => setOrderCode(e.target.value)} 
                      placeholder="Ej: ORD-998877" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cerulean focus:bg-white text-slate-700 font-medium text-sm transition-all" 
                    />
                  </div>
                  <button type="submit" className="w-full py-4 bg-cerulean hover:bg-cerulean/95 text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md transition-colors cursor-pointer">
                    Buscar Resultados
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-2xl shadow-lg p-5 sm:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-150 pb-6 mb-6">
                  <div>
                    <h2 className="font-jakarta text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Resultado de Análisis</h2>
                    <p className="text-slate-450 text-xs mt-1">Orden: {orderCode || 'ORD-2026-8871'} | Documento: {dni || '12345678'}</p>
                  </div>
                  <button 
                    onClick={() => { setShowResults(false); setDni(''); setOrderCode(''); }} 
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-semibold transition-colors cursor-pointer w-full sm:w-auto text-center"
                  >
                    Nueva Consulta
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-2 text-xs">
                    <div>
                      <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Paciente</p>
                      <p className="font-bold text-slate-800 mt-1">JUAN PÉREZ GARCÍA</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Fecha de Emisión</p>
                      <p className="font-bold text-slate-855 mt-1">03/07/2026</p>
                    </div>
                  </div>

                  <div className="border border-slate-100 rounded-xl overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse min-w-[500px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-550">
                          <th className="p-4">Examen</th>
                          <th className="p-4">Resultado</th>
                          <th className="p-4">Unidades</th>
                          <th className="p-4">Valores de Referencia</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        <tr>
                          <td className="p-4 font-semibold text-slate-800">Hemoglobina</td>
                          <td className="p-4 font-bold text-cerulean">14.5</td>
                          <td className="p-4">g/dL</td>
                          <td className="p-4 text-slate-400">13.8 - 17.2</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold text-slate-800">Glucosa en Ayunas</td>
                          <td className="p-4 font-bold text-emerald-600">85</td>
                          <td className="p-4">mg/dL</td>
                          <td className="p-4 text-slate-400">70 - 100</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold text-slate-800">Colesterol Total</td>
                          <td className="p-4 font-bold text-amber-600">198</td>
                          <td className="p-4">mg/dL</td>
                          <td className="p-4 text-slate-400">&lt; 200</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold text-slate-800">Triglicéridos</td>
                          <td className="p-4 font-bold text-cerulean">135</td>
                          <td className="p-4">mg/dL</td>
                          <td className="p-4 text-slate-400">&lt; 150</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      onClick={handleDownloadPDF} 
                      className="w-full sm:w-auto px-5 py-3 bg-cerulean text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md hover:bg-cerulean/95 transition-colors cursor-pointer text-center"
                    >
                      Descargar Reporte PDF
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };



  return (
    <div className="min-h-screen bg-slate-50/30 flex flex-col justify-between">
      <div>
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <main>
          {renderContent()}
        </main>
      </div>

      {/* Footer - Suave y limpio para Lab */}
      <footer className="w-full bg-slate-100 text-slate-500 pt-16 pb-8 border-t border-slate-200 font-plex text-center sm:text-left">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          
          {/* Columna 1: Branding */}
          <div className="flex flex-col items-center sm:items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-8 h-8 rounded-full bg-cerulean/15 animate-pulse"></div>
                <div className="relative w-6 h-6 border border-cerulean/40 flex items-center justify-center rotate-45">
                  <IconHexagon className="text-cerulean w-4 h-4 -rotate-45" />
                </div>
              </div>
              <div>
                <span className="font-jakarta font-extrabold text-lg tracking-tighter text-slate-800 leading-none">
                  AQUA<span className="text-cerulean">LAB</span>
                </span>
                <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-slate-400">Clinical Operations</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mt-2 text-center sm:text-left">
              Comprometidos con brindarte diagnósticos con la mayor precisión, velocidad y calidez humana.
            </p>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div className="flex flex-col items-center sm:items-start">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-700 mb-4">Secciones</h4>
            <ul className="space-y-2.5 text-xs text-center sm:text-left">
              <li>
                <button onClick={() => setActiveTab('inicio')} className="hover:text-cerulean transition-colors cursor-pointer text-center sm:text-left w-full sm:w-auto">Inicio</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('servicios')} className="hover:text-cerulean transition-colors cursor-pointer text-center sm:text-left w-full sm:w-auto">Servicios</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('sedes')} className="hover:text-cerulean transition-colors cursor-pointer text-center sm:text-left w-full sm:w-auto">Sedes</button>
              </li>
            </ul>
          </div>

          {/* Columna 3: Portales */}
          <div className="flex flex-col items-center sm:items-start">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-700 mb-4">Accesos</h4>
            <ul className="space-y-2.5 text-xs text-center sm:text-left">
              <li>
                <button onClick={() => setActiveTab('soy_medico')} className="hover:text-cerulean transition-colors cursor-pointer text-center sm:text-left w-full sm:w-auto">Soy Médico</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('resultados')} className="hover:text-cerulean transition-colors cursor-pointer text-center sm:text-left w-full sm:w-auto">Resultados en Línea</button>
              </li>
            </ul>
          </div>

          {/* Columna 4: Redes Sociales */}
          <div className="flex flex-col items-center sm:items-start">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-700 mb-4">Síguenos</h4>
            <p className="text-xs text-slate-400 mb-4 text-center sm:text-left">Mantente al día con nuestros servicios y consejos de salud.</p>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white hover:bg-cerulean/10 border border-slate-200 hover:border-cerulean/30 text-slate-400 hover:text-cerulean rounded-xl transition-all shadow-sm">
                <IconBrandFacebook className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white hover:bg-cerulean/10 border border-slate-200 hover:border-cerulean/30 text-slate-400 hover:text-cerulean rounded-xl transition-all shadow-sm">
                <IconBrandInstagram className="w-4 h-4" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white hover:bg-cerulean/10 border border-slate-200 hover:border-cerulean/30 text-slate-400 hover:text-cerulean rounded-xl transition-all shadow-sm">
                <IconBrandTiktok className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Línea Divisoria Inferior */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-medium text-center sm:text-left">
          <span>&copy; {new Date().getFullYear()} AquaLab. Todos los derechos reservados.</span>
          <div className="flex justify-center sm:justify-start gap-6">
            <a href="#" className="hover:text-cerulean transition-colors">Términos de servicio</a>
            <a href="#" className="hover:text-cerulean transition-colors">Política de privacidad</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
