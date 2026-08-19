"use client";

import React from 'react';
import { IconHexagon, IconSearch, IconMenu, IconAward } from '@tabler/icons-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = React.useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  const isHome = activeTab === 'inicio';

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const servicesSubitems = [
    'Exámenes',
    'Ecografías',
    'Domicilio',
    'Consultas Médicas'
  ];

  const menuItems = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'servicios', label: 'Servicios', isDropdown: true },
    { id: 'soy_medico', label: 'Soy Médico' },
    { id: 'sedes', label: 'Sedes' },
    { id: 'resultados', label: 'Resultados' },
  ];

  const handleNavClick = (tabId: string) => {
    if (tabId === 'sedes') {
      if (activeTab !== 'inicio') {
        setActiveTab('inicio');
        setTimeout(() => {
          const el = document.getElementById('sedes');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById('sedes');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setActiveTab(tabId);
    }
    setMobileMenuOpen(false);
  };

  const headerContainerClass = 'fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/70 shadow-xs z-50 transition-all duration-300 pointer-events-auto';

  return (
    <header className={headerContainerClass}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-6 h-20 transition-all duration-300">
        
        {/* Brand Logo (100% nítido sobre fondo blanco limpio) */}
        <div 
          className="flex items-center gap-2 cursor-pointer shrink-0 pointer-events-auto" 
          onClick={() => handleNavClick('inicio')}
        >
          <img 
            src="/logo-unidoslab.webp" 
            alt="UNIDOSLAB - Unidos por tu Salud" 
            className="h-11 md:h-13 w-auto object-contain" 
          />
        </div>

        {/* Navigation Menu - Desktop (Siempre visible y accesible) */}
        <nav className="hidden md:block transition-all duration-300">
          <ul className="flex items-center gap-8">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;

              if (item.isDropdown) {
                return (
                  <li 
                    key={item.id} 
                    className="relative"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setServicesDropdownOpen(!servicesDropdownOpen);
                      }}
                      className={`font-jakarta relative py-2 text-xs font-extrabold uppercase tracking-wider transition-colors duration-300 cursor-pointer flex items-center gap-1.5 ${
                        isActive 
                          ? 'text-[#FF5A5F]' 
                          : 'text-[#1E3A4C] hover:text-[#FF5A5F]'
                      }`}
                    >
                      {item.label}
                      <span className={`text-[9px] transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180 text-[#FF5A5F]' : ''}`}>▼</span>
                      {isActive && (
                        <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#FF5A5F] rounded-t-full transition-all duration-300"></span>
                      )}
                    </button>

                    {/* Desplegable de Servicios Superior */}
                    {servicesDropdownOpen && (
                      <div className="absolute top-full left-0 w-60 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {servicesSubitems.map((sub, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setActiveTab('servicios');
                              setServicesDropdownOpen(false);
                            }}
                            className="font-jakarta w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:text-[#FF5A5F] hover:bg-red-50/50 transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            <span className="text-[#FF5A5F] font-bold">•</span>
                            <span>{sub}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </li>
                );
              }

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`font-jakarta relative py-2 text-xs font-extrabold uppercase tracking-wider transition-colors duration-300 cursor-pointer ${
                      isActive 
                        ? 'text-[#FF5A5F]' 
                        : 'text-[#1E3A4C] hover:text-[#FF5A5F]'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#FF5A5F] rounded-t-full transition-all duration-300"></span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right CTA Button & Mobile Menu Trigger */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleNavClick('resultados')}
            className="hidden lg:inline-flex items-center gap-2 px-6 py-2.5 bg-[#FF5A5F] hover:bg-[#E84A4F] text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-md shadow-red-500/20 transition-all transform hover:scale-105 cursor-pointer"
          >
            <span>Consultar Resultados</span>
            <span className="font-bold">›</span>
          </button>

          <button 
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors md:hidden"
          >
            <IconMenu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Navigation Menu - Mobile */}
      {mobileMenuOpen && (
        <nav className="w-full border-t border-slate-100 bg-white md:hidden">
          <ul className="flex flex-col divide-y divide-slate-50 py-2">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;

              if (item.isDropdown) {
                return (
                  <li key={item.id} className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className={`font-jakarta w-full text-left py-4 px-6 text-sm font-extrabold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-between ${
                        isActive 
                          ? 'text-[#E52320] bg-red-50/30' 
                          : 'text-[#1E3A4C] hover:text-[#E52320] hover:bg-slate-50/30'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className={`text-xs transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`}>▼</span>
                    </button>

                    {/* Submenú en móvil */}
                    {mobileServicesOpen && (
                      <div className="bg-slate-50 py-2 px-8 flex flex-col space-y-2">
                        {servicesSubitems.map((sub, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setActiveTab('servicios');
                              setMobileMenuOpen(false);
                            }}
                            className="text-left text-xs font-bold text-slate-600 hover:text-[#E52320] py-1.5 flex items-center gap-2 cursor-pointer"
                          >
                            <span className="text-[#E52320]">•</span>
                            <span>{sub}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </li>
                );
              }

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`font-jakarta w-full text-left py-4 px-6 text-sm font-extrabold uppercase tracking-wider transition-colors cursor-pointer ${
                      isActive 
                        ? 'text-[#E52320] bg-red-50/30' 
                        : 'text-[#1E3A4C] hover:text-[#E52320] hover:bg-slate-50/30'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
