"use client";

import React, { useState, useEffect } from 'react';
import { IconMenu, IconX, IconArrowRight } from '@tabler/icons-react';
import WhatsAppIcon from './icons/WhatsAppIcon';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'servicios', label: 'Servicios' },
    { id: 'proceso', label: 'Cómo funciona' },
    { id: 'sedes', label: 'Sedes' },
    { id: 'soy_medico', label: 'Soy médico' },
  ];

  const handleNavClick = (tabId: string) => {
    if (tabId === 'proceso') {
      if (activeTab !== 'inicio') {
        setActiveTab('inicio');
        setTimeout(() => {
          const el = document.getElementById('proceso');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        const el = document.getElementById('proceso');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (tabId === 'sedes') {
      if (activeTab !== 'inicio') {
        setActiveTab('inicio');
        setTimeout(() => {
          const el = document.getElementById('sedes');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        const el = document.getElementById('sedes');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setActiveTab(tabId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const isHome = activeTab === 'inicio';
  const showHeader = !isHome || isScrolled;

  return (
    <header className={`fixed top-0 left-0 w-full z-50 h-[78px] flex items-center transition-all duration-300 ${
      showHeader
        ? 'translate-y-0 opacity-100 pointer-events-auto bg-[#ffffff]/95 backdrop-blur-[16px] border-b border-[#dce6ec] shadow-xs'
        : '-translate-y-full opacity-0 pointer-events-none'
    }`}>
      <div className="w-[min(1240px,100%-48px)] mx-auto flex items-center justify-between gap-8 h-full">

        {/* Brand Logo */}
        <div
          className="w-[170px] cursor-pointer shrink-0 transition-transform hover:scale-102 flex items-center"
          onClick={() => handleNavClick('inicio')}
        >
          <img
            src="/logo-unidoslab-opt.webp"
            alt="UNIDOSLAB · Unidos por tu salud"
            width={170}
            height={52}
            fetchPriority="high"
            decoding="async"
            className="w-full h-[48px] sm:h-[52px] object-contain object-left"
          />
        </div>

        {/* Menú de Navegación Principal (Desktop) */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-[30px]" aria-label="Navegación principal">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`font-manrope text-[13px] font-[750] transition-colors duration-200 cursor-pointer py-[26px] relative group ${
                  isActive
                    ? 'text-[#fb5962]'
                    : 'text-[#12354a] hover:text-[#fb5962]'
                }`}
              >
                <span>{item.label}</span>
                <span className={`absolute bottom-[16px] left-0 h-[2px] bg-[#fb5962] transition-all duration-200 ${
                  isActive ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </button>
            );
          })}
        </nav>

        {/* Botón CTA Derecho y Trigger Móvil */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleNavClick('resultados')}
            className="hidden sm:inline-flex items-center justify-center gap-2 min-h-[44px] px-[19px] bg-[#fb5962] hover:bg-[#e54550] text-white font-manrope font-[800] text-[13px] rounded-[13px] shadow-[0_11px_24px_rgba(251,89,98,0.23)] hover:shadow-[0_14px_28px_rgba(229,69,80,0.28)] transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>Consultar resultados</span>
            <IconArrowRight className="w-4 h-4 stroke-[2.2]" />
          </button>

          {/* Botón Menú Hamburguesa en Mobile */}
          <button
            type="button"
            aria-label="Abrir menú de navegación"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-[44px] h-[44px] flex items-center justify-center border border-[#dce6ec] bg-white rounded-[12px] text-[#12354a] hover:bg-slate-50 cursor-pointer transition-colors md:hidden"
          >
            {mobileMenuOpen ? <IconX className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Menú Desplegable Móvil */}
      {mobileMenuOpen && (
        <div className="w-full border-t border-[#dce6ec] bg-white md:hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 absolute top-[78px] left-0">
          <div className="px-6 py-5 space-y-3">
            <nav className="flex flex-col space-y-1">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`font-manrope text-left py-3 px-4 rounded-xl text-sm font-[800] tracking-wide transition-colors flex items-center justify-between ${
                      isActive
                        ? 'text-[#fb5962] bg-[#fff0f1]'
                        : 'text-[#12354a] hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    <IconArrowRight className={`w-4 h-4 opacity-40 ${isActive ? 'text-[#fb5962] opacity-100' : ''}`} />
                  </button>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-[#dce6ec] flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => handleNavClick('resultados')}
                className="w-full min-h-[48px] bg-[#fb5962] hover:bg-[#e54550] text-white font-manrope font-[800] text-xs uppercase tracking-wider rounded-[13px] shadow-[0_11px_24px_rgba(251,89,98,0.23)] flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Consultar resultados</span>
                <IconArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20deseo%20agendar%20una%20atenci%C3%B3n"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[44px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-manrope font-[800] text-xs uppercase tracking-wider rounded-[13px] border border-emerald-200 flex items-center justify-center gap-2 transition-all"
              >
                <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
                <span>Agendar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
