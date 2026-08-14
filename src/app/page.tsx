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
  IconBrandWhatsapp,
  IconMail,
  IconHexagon,
  IconLock,
  IconDeviceDesktop,
  IconArrowRight,
  IconFileCheck,
  IconRefresh,
  IconFileDownload
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
    doc.setTextColor(229, 35, 32); // UNIDOSLAB Red
    doc.text("UNIDOSLAB", 20, 20);
    
    doc.setFontSize(8);
    doc.setTextColor(30, 58, 76); // UNIDOSLAB Navy
    doc.text("UNIDOS POR TU SALUD", 20, 25);
    
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
    doc.text("Nota: Este reporte es un modelo demo de UNIDOSLAB. El diseno y contenido de este documento PDF es 100% personalizable.", 20, 125);
    
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
          <main className="relative overflow-hidden px-5 py-8 sm:px-8 sm:py-12 lg:min-h-[calc(100vh-132px)] lg:py-14 font-plex select-none" id="resultados">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(circle at 80% 8%, rgba(229, 35, 32, 0.06), transparent 24rem)' }}></div>
            
            <div className="relative mx-auto grid w-full max-w-[1180px] items-stretch gap-6 lg:min-h-[560px] lg:grid-cols-[1.04fr_.96fr] lg:gap-8">
              {/* Panel Izquierdo: Imagen Clínica Redondeada */}
              <section className="relative min-h-[360px] overflow-hidden rounded-3xl bg-slate-900 shadow-xl lg:min-h-0 border border-slate-100">
                <img 
                  src="https://images.pexels.com/photos/8442574/pexels-photo-8442574.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80" 
                  alt="Técnica de laboratorio trabajando en microscopio" 
                  className="absolute inset-0 h-full w-full object-cover" 
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-slate-900/40"></div>
                <div aria-hidden="true" className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                
                <div className="relative flex h-full min-h-[360px] flex-col justify-between p-8 text-white sm:p-10 lg:min-h-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
                      <span className="w-1.5 h-1.5 bg-[#E52320] rounded-full animate-pulse"></span>
                      Consulta segura
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center border border-white/20 bg-white/10 text-white/90 backdrop-blur-md rounded-full">
                      <IconShieldCheck className="text-xl" />
                    </div>
                  </div>

                  <div className="max-w-[460px] my-8">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
                      Portal de Pacientes UNIDOSLAB
                    </p>
                    <h1 className="font-jakarta text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl">
                      Tus resultados, claros y disponibles cuando los necesites.
                    </h1>
                    <p className="mt-5 max-w-[390px] text-xs leading-relaxed text-white/75 font-medium">
                      Consulta tus análisis clínicos de forma privada y segura ingresando tu número de documento.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-white/75">
                      <span className="inline-flex items-center gap-2 border border-white/15 bg-white/10 px-3.5 py-2 rounded-full backdrop-blur-md">
                        <IconLock className="text-sm text-emerald-400" />
                        Acceso protegido
                      </span>
                      <span className="inline-flex items-center gap-2 border border-white/15 bg-white/10 px-3.5 py-2 rounded-full backdrop-blur-md">
                        <IconDeviceDesktop className="text-sm text-sky-300" />
                        Desde cualquier dispositivo
                      </span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-4 border-t border-white/15 pt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">
                    <span>UNIDOSLAB</span>
                    <span>Unidos por tu salud</span>
                  </div>
                </div>
              </section>

              {/* Panel Derecho: Formulario Redondeado */}
              {!showResults ? (
                <section aria-labelledby="results-heading" className="glass-panel relative flex flex-col justify-center p-8 sm:p-12 lg:p-14 shadow-xl rounded-3xl border border-slate-200/80 bg-white">
                  <header className="mb-8">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-red-50 border border-red-100 rounded-full mb-4">
                      <span className="w-1.5 h-1.5 bg-[#E52320] rounded-full"></span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#E52320]">Consulta de Resultados</span>
                    </div>
                    <h2 id="results-heading" className="font-jakarta text-3xl font-extrabold text-[#1E3A4C] tracking-tight leading-tight">Consulte sus Resultados</h2>
                    <p className="text-slate-500 mt-2 text-xs font-medium leading-relaxed">Ingrese su número de documento de identidad para verificar sus exámenes.</p>
                  </header>

                  <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setShowResults(true); }}>
                    <div className="group relative">
                      <label htmlFor="document-number" className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2 block group-focus-within:text-[#E52320] transition-colors">
                        Número de Documento (DNI / C.E.)
                      </label>
                      <div className="relative">
                        <input 
                          id="document-number"
                          type="text" 
                          required 
                          value={dni} 
                          onChange={(e) => setDni(e.target.value)} 
                          placeholder="Ingrese DNI..." 
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold text-sm focus:outline-none focus:border-[#E52320] focus:bg-white focus:ring-4 focus:ring-red-500/10 transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button 
                        type="submit" 
                        className="w-full bg-[#E52320] hover:bg-red-700 text-white py-4.5 px-8 rounded-full font-extrabold uppercase tracking-[0.2em] text-xs shadow-lg shadow-red-500/20 flex items-center justify-center gap-3 cursor-pointer group transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        Buscar Resultados
                        <IconArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </form>

                  <footer className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    <IconLock className="text-sm text-emerald-500" />
                    Tus datos se consultan de forma privada
                  </footer>
                </section>
              ) : (
                <section className="glass-panel relative flex flex-col justify-between p-8 sm:p-10 shadow-xl rounded-3xl border border-slate-200/80 bg-white">
                  <div className="flex flex-col gap-4 border-b border-slate-100 pb-6">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 border border-red-100 bg-red-50 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#E52320]">
                        <IconFileCheck className="text-xs" /> Informe Clínico
                      </div>
                      <button 
                        onClick={() => { setShowResults(false); setDni(''); }} 
                        className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:border-[#E52320] hover:text-[#E52320] rounded-full text-slate-600 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        <IconRefresh className="w-3.5 h-3.5" />
                        Nueva Consulta
                      </button>
                    </div>
                    <div>
                      <h2 className="font-jakarta text-2xl font-extrabold text-[#1E3A4C] tracking-tight">Resultado de Análisis</h2>
                      <p className="text-slate-500 text-xs mt-1 font-mono uppercase tracking-wider">Documento: <span className="font-bold text-slate-800">{dni || '70855'}</span></p>
                    </div>
                  </div>

                  <div className="my-6 space-y-5">
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex justify-between items-center text-xs">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Paciente</p>
                        <p className="font-bold text-slate-800 text-sm mt-0.5">JUAN PÉREZ GARCÍA</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Fecha de Emisión</p>
                        <p className="font-bold text-slate-800 text-sm mt-0.5">03/07/2026</p>
                      </div>
                    </div>

                    <div className="border border-slate-200/80 rounded-2xl overflow-hidden overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse min-w-[400px]">
                        <thead>
                          <tr className="bg-slate-100/70 border-b border-slate-200/80 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            <th className="p-3.5">Examen</th>
                            <th className="p-3.5">Resultado</th>
                            <th className="p-3.5">Unidades</th>
                            <th className="p-3.5">Valores Ref.</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                          <tr>
                            <td className="p-3.5 font-bold text-slate-800">Hemoglobina</td>
                            <td className="p-3.5 font-bold text-[#E52320]">14.5</td>
                            <td className="p-3.5 text-slate-500">g/dL</td>
                            <td className="p-3.5 text-slate-400">13.8 - 17.2</td>
                          </tr>
                          <tr>
                            <td className="p-3.5 font-bold text-slate-800">Glucosa en Ayunas</td>
                            <td className="p-3.5 font-bold text-emerald-600">85</td>
                            <td className="p-3.5 text-slate-500">mg/dL</td>
                            <td className="p-3.5 text-slate-400">70 - 100</td>
                          </tr>
                          <tr>
                            <td className="p-3.5 font-bold text-slate-800">Colesterol Total</td>
                            <td className="p-3.5 font-bold text-amber-600">198</td>
                            <td className="p-3.5 text-slate-500">mg/dL</td>
                            <td className="p-3.5 text-slate-400">&lt; 200</td>
                          </tr>
                          <tr>
                            <td className="p-3.5 font-bold text-slate-800">Triglicéridos</td>
                            <td className="p-3.5 font-bold text-[#E52320]">135</td>
                            <td className="p-3.5 text-slate-500">mg/dL</td>
                            <td className="p-3.5 text-slate-400">&lt; 150</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      onClick={handleDownloadPDF} 
                      className="w-full bg-[#E52320] hover:bg-red-700 text-white py-4.5 px-8 rounded-full font-extrabold uppercase tracking-[0.2em] text-xs shadow-lg shadow-red-500/20 flex items-center justify-center gap-3 cursor-pointer transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <IconFileDownload className="w-5 h-5" />
                      Descargar Reporte PDF
                    </button>
                  </div>
                </section>
              )}
            </div>
          </main>
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

      {/* Botón flotante de WhatsApp con expansión al pasar el cursor (hover) */}
      <a
        href="https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20deseo%20mayor%20informaci%C3%B3n"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacto por WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-xl shadow-emerald-600/30 transition-all duration-300 hover:scale-105 group overflow-hidden"
      >
        <IconBrandWhatsapp className="w-7 h-7 shrink-0" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-[120px] transition-all duration-300 ease-in-out text-xs font-bold uppercase tracking-wider group-hover:pl-2.5 group-hover:pr-1.5 opacity-0 group-hover:opacity-100">
          WhatsApp
        </span>
      </a>

      {/* Footer - Suave y limpio para Lab */}
      <footer className="w-full bg-slate-100 text-slate-500 pt-16 pb-8 border-t border-slate-200 font-plex text-center sm:text-left">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          
          {/* Columna 1: Branding */}
          <div className="flex flex-col items-center sm:items-start gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logo-unidoslab.webp" 
                alt="UNIDOSLAB - Unidos por tu Salud" 
                className="h-10 w-auto object-contain" 
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mt-2 text-center sm:text-left">
              Comprometidos con brindarte diagnósticos con la mayor precisión, velocidad y calidez humana. Unidos por tu Salud.
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

          {/* Columna 4: Redes Sociales & Contacto */}
          <div className="flex flex-col items-center sm:items-start">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-700 mb-4">Contacto & Redes</h4>
            <a 
              href="mailto:uniilab.laboratorioclinico@outlook.es" 
              className="flex items-center gap-2 text-xs text-slate-500 hover:text-cerulean transition-colors mb-4 text-center sm:text-left"
            >
              <IconMail className="w-4 h-4 text-cerulean shrink-0" />
              <span>uniilab.laboratorioclinico@outlook.es</span>
            </a>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <a 
                href="https://www.facebook.com/UNIIDOSLAB.Laboratorio.Clinico/" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Facebook UNIDOSLAB"
                className="p-2.5 bg-white hover:bg-cerulean/10 border border-slate-200 hover:border-cerulean/30 text-slate-500 hover:text-cerulean rounded-xl transition-all shadow-sm"
              >
                <IconBrandFacebook className="w-4 h-4" />
              </a>
              <a 
                href="https://www.instagram.com/uniilab_laboratorio_clinico" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Instagram UNIDOSLAB"
                className="p-2.5 bg-white hover:bg-cerulean/10 border border-slate-200 hover:border-cerulean/30 text-slate-500 hover:text-cerulean rounded-xl transition-all shadow-sm"
              >
                <IconBrandInstagram className="w-4 h-4" />
              </a>
              <a 
                href="https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20deseo%20mayor%20informaci%C3%B3n" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="WhatsApp UNIDOSLAB"
                className="p-2.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-emerald-600 rounded-xl transition-all shadow-sm flex items-center gap-1.5 font-semibold text-xs px-3"
              >
                <IconBrandWhatsapp className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Línea Divisoria Inferior */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-medium text-center sm:text-left">
          <span>&copy; {new Date().getFullYear()} UNIDOSLAB. Todos los derechos reservados.</span>
          <div className="flex justify-center sm:justify-start gap-6">
            <a href="#" className="hover:text-cerulean transition-colors">Términos de servicio</a>
            <a href="#" className="hover:text-cerulean transition-colors">Política de privacidad</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
