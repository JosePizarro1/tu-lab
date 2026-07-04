import React from 'react';
import { IconHexagon, IconSearch, IconMenu, IconAward } from '@tabler/icons-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'servicios', label: 'Servicios' },
    { id: 'soy_medico', label: 'Soy Médico' },
    { id: 'sedes', label: 'Sedes' },
    { id: 'resultados', label: 'Resultados' },
  ];

  return (
    <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-50">
      {/* Top Banner: Logo, Search, Certifications */}
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('inicio')}>
          <div className="relative flex items-center justify-center">
            <div className="absolute w-10 h-10 rounded-full bg-cerulean/10 animate-pulse"></div>
            <div className="relative w-8 h-8 border border-cerulean/30 flex items-center justify-center rotate-45">
              <IconHexagon className="text-cerulean w-5 h-5 -rotate-45" />
            </div>
          </div>
          <div>
            <h1 className="font-jakarta font-extrabold text-xl tracking-tighter text-slate-800 leading-none">
              AQUA<span className="text-cerulean">LAB</span>
            </h1>
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-0.5">Clinical Operations</p>
          </div>
        </div>

        {/* Central Search Bar */}
        <div className="flex-1 max-w-2xl relative hidden md:block">
          <input 
            type="text" 
            placeholder="Busque exámenes, sedes, etc..." 
            className="w-full pl-14 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-full text-slate-700 font-medium text-sm focus:outline-none focus:border-cerulean/30 focus:bg-white focus:ring-4 focus:ring-cerulean/5 transition-all duration-300"
          />
          <IconSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center">
          <button className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
            <IconMenu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="w-full border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex justify-center">
          <ul className="flex items-center w-full md:w-auto justify-around md:justify-center gap-1 md:gap-8">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`relative py-4 px-2 md:px-4 text-sm font-bold uppercase tracking-wider transition-colors duration-300 cursor-pointer ${
                      isActive 
                        ? 'text-cerulean' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-cerulean rounded-t-full transition-all duration-300"></span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
