import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import anime from 'animejs';
import { 
  IconHexagon, 
  IconUserCheck, 
  IconLockAccess, 
  IconChevronRight,
  IconEye,
  IconEyeOff
} from '@tabler/icons-react';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const moleculeRef = useRef<HTMLImageElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // GSAP Entrance: Slide in from right for form
    if (formRef.current) {
      gsap.fromTo(formRef.current, 
        { autoAlpha: 0, xPercent: 20 },
        { autoAlpha: 1, xPercent: 0, duration: 1.2, ease: "power4.out", delay: 0.2 }
      );
    }

    // GSAP Entrance: Fade in for left content
    if (leftContentRef.current) {
      const elements = leftContentRef.current.querySelectorAll('.animate-entry');
      gsap.fromTo(elements, 
        { autoAlpha: 0, y: 15 },
        { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.9, ease: "power2.out" }
      );
    }

    // Anime.js: Ambient Float for Molecule (v3 syntax)
    if (moleculeRef.current) {
      anime({
        targets: moleculeRef.current,
        translateY: [-15, 15],
        rotate: [0, 2],
        scale: [1, 1.02],
        duration: 4000,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutQuad'
      });
    }

    // Mouse movement interaction for the molecule container
    const handleMouseMove = (e: MouseEvent) => {
      const container = document.getElementById('molecule-container');
      if (container) {
        const x = (e.clientX - window.innerWidth / 4) / 50;
        const y = (e.clientY - window.innerHeight / 2) / 50;
        gsap.to(container, {
          x: x,
          y: y,
          duration: 2,
          ease: "power2.out"
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleButtonHover = (isEnter: boolean) => {
    if (buttonRef.current) {
      anime({
        targets: buttonRef.current,
        translateY: isEnter ? -4 : 0,
        scale: isEnter ? 1.01 : 1,
        backgroundColor: isEnter ? '#359ecb' : '#42B5E8',
        duration: isEnter ? 300 : 400,
        easing: 'easeOutQuad'
      });
    }
  };

  return (
    <main className="flex min-h-screen w-full overflow-x-clip bg-white font-plex select-none">
      {/* Left Section: Illustration & Branding */}
      <section 
        ref={leftContentRef}
        className="relative hidden lg:flex w-1/2 flex-col justify-between p-16 bg-white overflow-hidden"
      >
        {/* Background Blobs for sterile atmosphere */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-azure-mist/50 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cerulean/5 rounded-full blur-3xl"></div>

        {/* Central Illustration: Molecule Animation */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div id="molecule-container" className="relative w-full h-full flex items-center justify-center">
            {/* HUD/Lab Overlay Elements */}
            <div className="absolute top-[30%] left-[35%] w-4 h-4 border border-cerulean/40 rounded-full animate-ping z-20"></div>
            <div className="absolute bottom-[40%] right-[30%] w-3 h-3 border border-cerulean/30 rounded-xs rotate-45 animate-pulse z-20"></div>
            <div className="absolute top-[45%] right-[25%] flex flex-col gap-1 z-20 opacity-40">
              <div className="w-8 h-[1px] bg-cerulean"></div>
              <span className="text-[8px] font-bold text-cerulean uppercase tracking-tighter">Portal_Medico:Active</span>
            </div>
            
            <img 
              ref={moleculeRef}
              id="molecule-main" 
              src="https://images.unsplash.com/photo-1773984203491-7262e4b9284f?auto=format&w=1600&q=90&fit=crop" 
              alt="3D Molecular Protein" 
              className="w-[110%] max-w-none h-auto object-contain mix-blend-multiply opacity-80" 
              decoding="async"
              loading="lazy"
            />
          </div>
        </div>

        {/* Bottom Description */}
        <div className="relative z-20">
          <div className="flex flex-col gap-2">
            <div className="animate-entry w-12 h-[2px] bg-cerulean"></div>
            <h3 className="animate-entry font-jakarta font-bold text-slate-700 max-w-xs text-lg">
              Portal de Médicos & <br /> Gestión de Resultados
            </h3>
            <p className="animate-entry text-xs text-slate-400 font-medium">Acceso exclusivo para personal de salud</p>
          </div>
        </div>
      </section>

      {/* Right Section: Login Form */}
      <section className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 relative overflow-hidden">
        {/* Subtle Grid Background Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(#42B5E8 1px, transparent 1px), linear-gradient(90deg, #42B5E8 1px, transparent 1px)', 
            backgroundSize: '40px 40px' 
          }}
        ></div>

        {/* Login Panel */}
        <div 
          ref={formRef}
          className="w-full max-w-md glass-panel p-12 lg:p-14 relative z-10 shadow-[0_30px_60px_-15px_rgba(0,123,167,0.08)] rounded-xs"
        >
          <header className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-azure-mist border border-lab-border mb-4">
              <span className="w-1.5 h-1.5 bg-cerulean rounded-full"></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-cerulean">Ingreso Clínico</span>
            </div>
            <h2 className="font-jakarta text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">Portal Médico</h2>
          </header>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            {/* Input: Scientist ID */}
            <div className="group relative">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2 block group-focus-within:text-cerulean transition-colors">
                Código de Médico (C.M.P.)
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  defaultValue="CMP-72489" 
                  className="input-terminal"
                  placeholder="Ej: CMP-12345" 
                />
                <IconUserCheck className="absolute right-0 bottom-4 w-5 h-5 text-slate-300 group-focus-within:text-cerulean transition-colors" />
              </div>
            </div>

            {/* Input: Passcode */}
            <div className="group relative">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2 block group-focus-within:text-cerulean transition-colors">
                Contraseña
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  defaultValue="••••••••" 
                  className="input-terminal"
                  placeholder="••••••••" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-4 text-slate-400 hover:text-cerulean transition-colors cursor-pointer"
                >
                  {showPassword ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4">
              <button 
                ref={buttonRef}
                type="button" 
                onPointerEnter={() => handleButtonHover(true)}
                onPointerLeave={() => handleButtonHover(false)}
                className="w-full bg-cerulean text-white py-5 px-8 font-extrabold uppercase tracking-[0.2em] text-xs shadow-lg shadow-cerulean/20 flex items-center justify-center gap-3 cursor-pointer group"
              >
                Ingresar al Portal
                <IconChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </form>

          {/* Footer Links */}
          <footer className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-between">
            <button className="text-[11px] text-slate-400 font-bold uppercase tracking-widest hover:text-cerulean transition-colors cursor-pointer">
              Recuperar Contraseña
            </button>
            <button className="text-[11px] text-cerulean font-bold uppercase tracking-widest hover:underline decoration-2 underline-offset-4 cursor-pointer">
              Soporte TI
            </button>
          </footer>
        </div>
      </section>
    </main>
  );
};

export default Login;
