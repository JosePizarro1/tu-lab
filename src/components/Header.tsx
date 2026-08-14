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

  return (
    <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-6">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => handleNavClick('inicio')}>
          <img 
            src="/logo-unidoslab.webp" 
            alt="UNIDOSLAB - Unidos por tu Salud" 
            className="h-10 md:h-12 w-auto object-contain" 
          />
        </div>

        {/* Navigation Menu - Desktop */}
        <nav className="hidden md:block">
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
                    {/* Al hacer clic en Servicios solo abre/cierra el desplegable de arriba y no cambia la vista de la página */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setServicesDropdownOpen(!servicesDropdownOpen);
                      }}
                      className={`font-jakarta relative py-2 text-xs font-extrabold uppercase tracking-wider transition-colors duration-300 cursor-pointer flex items-center gap-1.5 ${
                        isActive 
                          ? 'text-[#E52320]' 
                          : 'text-[#1E3A4C] hover:text-[#E52320]'
                      }`}
                    >
                      {item.label}
                      <span className={`text-[9px] transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180 text-[#E52320]' : ''}`}>▼</span>
                      {isActive && (
                        <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#E52320] rounded-t-full transition-all duration-300"></span>
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
                            className="font-jakarta w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:text-[#E52320] hover:bg-red-50/50 transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            <span className="text-[#E52320] font-bold">•</span>
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
                        ? 'text-[#E52320]' 
                        : 'text-[#1E3A4C] hover:text-[#E52320]'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#E52320] rounded-t-full transition-all duration-300"></span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center md:hidden">
          <button 
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
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
