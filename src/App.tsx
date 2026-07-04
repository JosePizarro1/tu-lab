import React, { useState } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Services from './components/Services';
import Sedes from './components/Sedes';
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

function App() {
  const [activeTab, setActiveTab] = useState<string>('inicio');

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return <Home setActiveTab={setActiveTab} />;
      
      case 'soy_medico':
        return <Login />;
      
      case 'servicios':
        return <Services />;

      case 'sedes':
        return <Sedes />;

      case 'resultados':
        return (
          <div className="max-w-md mx-auto px-6 py-20 font-plex">
            <div className="bg-white border border-slate-100 rounded-2xl shadow-lg p-10">
              <header className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-azure-mist border border-lab-border rounded-full mb-4">
                  <IconShieldCheck className="text-cerulean w-8 h-8" />
                </div>
                <h2 className="font-jakarta text-2xl font-extrabold text-slate-900 tracking-tight">Consulte sus Resultados</h2>
                <p className="text-slate-500 mt-2 text-xs">Ingrese los datos indicados en su orden de atención.</p>
              </header>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 block">Número de Documento</label>
                  <input type="text" placeholder="DNI / C.E." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cerulean focus:bg-white text-slate-700 font-medium text-sm transition-all" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 block">Código de Orden</label>
                  <input type="text" placeholder="Ej: ORD-998877" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cerulean focus:bg-white text-slate-700 font-medium text-sm transition-all" />
                </div>
                <button type="button" className="w-full py-4 bg-cerulean hover:bg-cerulean/95 text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md transition-colors">
                  Buscar Resultados
                </button>
              </form>
            </div>
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

      {/* Footer - Rediseñado Premium en Slate Oscuro */}
      <footer className="w-full bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-slate-900 font-plex">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Columna 1: Branding */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-8 h-8 rounded-full bg-cerulean/20 animate-pulse"></div>
                <div className="relative w-6 h-6 border border-cerulean/40 flex items-center justify-center rotate-45">
                  <IconHexagon className="text-cerulean w-4 h-4 -rotate-45" />
                </div>
              </div>
              <div>
                <span className="font-jakarta font-extrabold text-lg tracking-tighter text-white leading-none">
                  AQUA<span className="text-cerulean">LAB</span>
                </span>
                <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-slate-500">Clinical Operations</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mt-2">
              Comprometidos con brindarte diagnósticos con la mayor precisión, velocidad y calidez humana.
            </p>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Secciones</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setActiveTab('inicio')} className="hover:text-cerulean transition-colors cursor-pointer text-left">Inicio</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('servicios')} className="hover:text-cerulean transition-colors cursor-pointer text-left">Servicios</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('sedes')} className="hover:text-cerulean transition-colors cursor-pointer text-left">Sedes</button>
              </li>
            </ul>
          </div>

          {/* Columna 3: Portales */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Accesos</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setActiveTab('soy_medico')} className="hover:text-cerulean transition-colors cursor-pointer text-left">Soy Médico</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('resultados')} className="hover:text-cerulean transition-colors cursor-pointer text-left">Resultados en Línea</button>
              </li>
            </ul>
          </div>

          {/* Columna 4: Redes Sociales */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Síguenos</h4>
            <p className="text-xs text-slate-500 mb-4">Mantente al día con nuestros servicios y consejos de salud.</p>
            <div className="flex items-center gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-900 hover:bg-cerulean/10 border border-slate-800 hover:border-cerulean/30 text-slate-400 hover:text-cerulean rounded-xl transition-all">
                <IconBrandFacebook className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-900 hover:bg-cerulean/10 border border-slate-800 hover:border-cerulean/30 text-slate-400 hover:text-cerulean rounded-xl transition-all">
                <IconBrandInstagram className="w-4 h-4" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-900 hover:bg-cerulean/10 border border-slate-800 hover:border-cerulean/30 text-slate-400 hover:text-cerulean rounded-xl transition-all">
                <IconBrandTiktok className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Línea Divisoria Inferior */}
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-600">
          <span>&copy; {new Date().getFullYear()} AquaLab. Todos los derechos reservados.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-cerulean transition-colors">Términos de servicio</a>
            <a href="#" className="hover:text-cerulean transition-colors">Política de privacidad</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
