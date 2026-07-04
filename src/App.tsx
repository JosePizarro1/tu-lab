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
  IconBrandTiktok
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
        return (
          <div className="max-w-7xl mx-auto px-6 py-16 font-plex">
            <header className="mb-12 text-center">
              <h2 className="font-jakarta text-4xl font-extrabold text-slate-900 tracking-tight">Nuestros Servicios</h2>
              <p className="text-slate-500 mt-2 text-base">Contamos con una amplia cartera de análisis y pruebas de diagnóstico con alta precisión.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Inmunología', desc: 'Pruebas hormonales, marcadores tumorales e infecciosos con alta sensibilidad.' },
                { title: 'Bioquímica Clínica', desc: 'Perfiles metabólicos, renales, hepáticos y lípidos automatizados.' },
                { title: 'Hematología', desc: 'Hemogramas completos y estudios especiales de coagulación.' },
                { title: 'Microbiología', desc: 'Cultivos bacterianos, identificación y antibiogramas rápidos.' },
                { title: 'Biología Molecular', desc: 'Detección por PCR de patógenos virales y estudios genéticos.' },
                { title: 'Ecografías y Diagnóstico', desc: 'Imágenes ecográficas en 3D/4D con tecnología avanzada.' },
              ].map((srv, idx) => (
                <div key={idx} className="p-8 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-azure-mist border border-lab-border flex items-center justify-center rounded-xl mb-6">
                    <IconMicroscope className="text-cerulean w-6 h-6" />
                  </div>
                  <h3 className="font-jakarta text-xl font-bold text-slate-800 mb-3">{srv.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{srv.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

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

      {/* Footer */}
      <footer className="w-full py-10 bg-white border-t border-slate-100 text-xs text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <span>&copy; {new Date().getFullYear()} AquaLab. Todos los derechos reservados.</span>
          
          {/* Social Media Links */}
          <div className="flex items-center gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 hover:bg-azure-mist border border-slate-100 hover:border-lab-border text-slate-400 hover:text-cerulean rounded-xl transition-all">
              <IconBrandFacebook className="w-5 h-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 hover:bg-azure-mist border border-slate-100 hover:border-lab-border text-slate-400 hover:text-cerulean rounded-xl transition-all">
              <IconBrandInstagram className="w-5 h-5" />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 hover:bg-azure-mist border border-slate-100 hover:border-lab-border text-slate-400 hover:text-cerulean rounded-xl transition-all">
              <IconBrandTiktok className="w-5 h-5" />
            </a>
          </div>

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
