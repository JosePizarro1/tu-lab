"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconSearch, 
  IconX, 
  IconBrandWhatsapp, 
  IconMicroscope, 
  IconActivity, 
  IconHomeHeart, 
  IconStethoscope,
  IconChevronRight,
  IconClock,
  IconDroplet,
  IconShieldCheck,
  IconSparkles,
  IconInfoCircle,
  IconSend
} from '@tabler/icons-react';
import {
  IconOrganLiver,
  IconOrganGallbladder,
  IconOrganPancreas,
  IconOrganSpleen,
  IconOrganStomach,
  IconOrganProstate,
  IconOrganUterus,
  IconOrganKidneys,
  IconOrganBladder
} from './OrganIcons';

export interface ExamItem {
  id: string;
  name: string;
  category: 'Hematología' | 'Bioquímica' | 'Orina y heces' | 'Hormonas y perfil tiroideo' | 'Infecciosas / despistaje' | 'Ecografías' | 'Servicio a domicilio';
  subCategory?: string;
  summary: string;
  sampleType: string;
  popular?: boolean;
}

const EXAMS_CATALOG: ExamItem[] = [
  // 1. HEMATOLOGÍA
  {
    id: 'hemograma-completo',
    name: 'Hemograma completo',
    category: 'Hematología',
    subCategory: 'Hematología',
    summary: 'Evaluación integral de glóbulos rojos, glóbulos blancos, plaquetas y hemoglobina.',
    sampleType: 'Muestra de Sangre',
    popular: true
  },
  {
    id: 'grupo-sanguineo-rh',
    name: 'Grupo Sanguíneo y Factor RH',
    category: 'Hematología',
    subCategory: 'Tipificación',
    summary: 'Determinación de grupo sanguíneo (A, B, AB, O) y factor Rh (positivo o negativo).',
    sampleType: 'Muestra de Sangre',
    popular: true
  },
  {
    id: 'tiempo-coagulacion-sangria',
    name: 'Tiempo de Coagulación / Sangría',
    category: 'Hematología',
    subCategory: 'Hemostasia',
    summary: 'Evaluación de tiempos de coagulación y sangría sanguínea.',
    sampleType: 'Muestra de Sangre'
  },

  // 2. BIOQUÍMICA
  {
    id: 'glucosa',
    name: 'Glucosa',
    category: 'Bioquímica',
    subCategory: 'Metabolismo',
    summary: 'Medición de glucosa en sangre en ayunas para control y descarte de diabetes.',
    sampleType: 'Muestra de Sangre',
    popular: true
  },
  {
    id: 'hemoglobina-glicosilada',
    name: 'Hemoglobina Glicosilada (control de diabetes)',
    category: 'Bioquímica',
    subCategory: 'Control Metabólico',
    summary: 'Control y monitoreo de niveles promedio de glucosa de los últimos meses.',
    sampleType: 'Muestra de Sangre',
    popular: true
  },
  {
    id: 'perfil-lipidico',
    name: 'Perfil Lipídico (Colesterol total, HDL, LDL, Triglicéridos)',
    category: 'Bioquímica',
    subCategory: 'Lípidos',
    summary: 'Evaluación de colesterol total, HDL, LDL y triglicéridos en sangre.',
    sampleType: 'Muestra de Sangre',
    popular: true
  },
  {
    id: 'perfil-hepatico',
    name: 'Perfil Hepático (TGO, TGP, Bilirrubinas)',
    category: 'Bioquímica',
    subCategory: 'Función Hepática',
    summary: 'Evaluación de enzimas TGO, TGP y bilirrubinas para la función del hígado.',
    sampleType: 'Muestra de Sangre'
  },
  {
    id: 'perfil-renal',
    name: 'Perfil Renal (Creatinina, Urea, Ácido Úrico)',
    category: 'Bioquímica',
    subCategory: 'Función Renal',
    summary: 'Medición de creatinina, urea y ácido úrico para la función renal.',
    sampleType: 'Muestra de Sangre'
  },

  // 3. ORINA Y HECES
  {
    id: 'examen-orina-completo',
    name: 'Examen de Orina Completo',
    category: 'Orina y heces',
    subCategory: 'Urianálisis',
    summary: 'Análisis físico, químico y microscópico del sedimento urinario.',
    sampleType: 'Muestra de Orina',
    popular: true
  },
  {
    id: 'examen-heces-graham',
    name: 'Examen de Heces / Test de Graham (parásitos, muy pedido para niños)',
    category: 'Orina y heces',
    subCategory: 'Parasitología',
    summary: 'Estudio de heces y cinta de Graham para detección de parásitos y oxiuros.',
    sampleType: 'Muestra de Heces / Cinta Graham',
    popular: true
  },
  {
    id: 'urocultivo',
    name: 'Urocultivo',
    category: 'Orina y heces',
    subCategory: 'Microbiología',
    summary: 'Cultivo microbiológico de orina para identificación de bacterias.',
    sampleType: 'Muestra de Orina estéril'
  },

  // 4. HORMONAS Y PERFIL TIROIDEO
  {
    id: 'perfil-tiroideo',
    name: 'TSH, T3, T4 Libre (perfil tiroideo)',
    category: 'Hormonas y perfil tiroideo',
    subCategory: 'Endocrinología',
    summary: 'Dosaje de hormonas tiroideas TSH, T3 y T4 libre en sangre.',
    sampleType: 'Muestra de Sangre',
    popular: true
  },
  {
    id: 'beta-hcg-embarazo',
    name: 'Beta HCG (prueba de embarazo)',
    category: 'Hormonas y perfil tiroideo',
    subCategory: 'Salud Femenina',
    summary: 'Detección cuantitativa y cualitativa de la hormona Beta HCG en sangre.',
    sampleType: 'Muestra de Sangre',
    popular: true
  },

  // 5. INFECCIOSAS / DESPISTAJE
  {
    id: 'hiv-prueba-rapida',
    name: 'HIV (prueba rápida)',
    category: 'Infecciosas / despistaje',
    subCategory: 'Inmunología',
    summary: 'Prueba rápida de descarte de VIH con atención confidencial.',
    sampleType: 'Muestra de Sangre',
    popular: true
  },
  {
    id: 'vdrl-rpr-sifilis',
    name: 'VDRL / RPR (sífilis)',
    category: 'Infecciosas / despistaje',
    subCategory: 'Serología',
    summary: 'Prueba serológica de descarte para sífilis (VDRL / RPR).',
    sampleType: 'Muestra de Sangre'
  },
  {
    id: 'hepatitis-b-c',
    name: 'Hepatitis B y C',
    category: 'Infecciosas / despistaje',
    subCategory: 'Marcadores Virales',
    summary: 'Descarte y marcadores serológicos de Hepatitis B y Hepatitis C.',
    sampleType: 'Muestra de Sangre'
  },
  {
    id: 'helicobacter-pylori',
    name: 'Helicobacter Pylori',
    category: 'Infecciosas / despistaje',
    subCategory: 'Gastroenterología',
    summary: 'Detección de la bacteria Helicobacter Pylori para control gástrico.',
    sampleType: 'Muestra de Sangre / Prueba de Aliento',
    popular: true
  },

  // 6. ECOGRAFÍAS
  {
    id: 'ecografias-evaluacion',
    name: 'Ecografías y Evaluación de Órganos',
    category: 'Ecografías',
    subCategory: 'Imágenes',
    summary: 'Evaluación por ultrasonido: Hígado, Vesícula, Páncreas, Bazo, Anillo Gástrico, Próstata, Útero, Riñones y Vejiga.',
    sampleType: 'Ultrasonido en Sede',
    popular: true
  },

  // 7. SERVICIO A DOMICILIO
  {
    id: 'servicio-a-domicilio',
    name: 'Toma de Muestras a Domicilio',
    category: 'Servicio a domicilio',
    subCategory: 'Atención a Domicilio',
    summary: 'Servicio de toma de muestras clínicas en tu hogar en toda la ciudad de Tacna.',
    sampleType: 'Atención en tu hogar',
    popular: true
  }
];

const CATEGORIES_LIST = [
  'Todos',
  'Hematología',
  'Bioquímica',
  'Orina y heces',
  'Hormonas y perfil tiroideo',
  'Infecciosas / despistaje',
  'Ecografías',
  'Servicio a domicilio'
];

// Íconos oficiales anatómicos de Health Icons para los 9 órganos de ecografía
const ECOGRAFIA_ORGANS = [
  { 
    name: 'Hígado', 
    desc: 'Hígado graso y control',
    whatsappText: 'Hola UNIDOSLAB, deseo consultar precio y disponibilidad para la Ecografía de Hígado en Tacna.',
    iconSvg: <IconOrganLiver className="w-5 h-5" />
  },
  { 
    name: 'Vesícula', 
    desc: 'Cálculos y pólipos',
    whatsappText: 'Hola UNIDOSLAB, deseo consultar precio y disponibilidad para la Ecografía de Vesícula en Tacna.',
    iconSvg: <IconOrganGallbladder className="w-5 h-5" />
  },
  { 
    name: 'Páncreas', 
    desc: 'Pancreatitis y tejido',
    whatsappText: 'Hola UNIDOSLAB, deseo consultar precio y disponibilidad para la Ecografía de Páncreas en Tacna.',
    iconSvg: <IconOrganPancreas className="w-5 h-5" />
  },
  { 
    name: 'Bazo', 
    desc: 'Estructura esplénica',
    whatsappText: 'Hola UNIDOSLAB, deseo consultar precio y disponibilidad para la Ecografía de Bazo en Tacna.',
    iconSvg: <IconOrganSpleen className="w-5 h-5" />
  },
  { 
    name: 'Anillo Gástrico', 
    desc: 'Control post-bariátrico',
    whatsappText: 'Hola UNIDOSLAB, deseo consultar precio y disponibilidad para la Ecografía de Anillo Gástrico en Tacna.',
    iconSvg: <IconOrganStomach className="w-5 h-5" />
  },
  { 
    name: 'Próstata', 
    desc: 'Control prostático y vías',
    whatsappText: 'Hola UNIDOSLAB, deseo consultar precio y disponibilidad para la Ecografía de Próstata en Tacna.',
    iconSvg: <IconOrganProstate className="w-5 h-5" />
  },
  { 
    name: 'Útero', 
    desc: 'Útero, ovarios y endometrio',
    whatsappText: 'Hola UNIDOSLAB, deseo consultar precio y disponibilidad para la Ecografía de Útero en Tacna.',
    iconSvg: <IconOrganUterus className="w-5 h-5" />
  },
  { 
    name: 'Riñones', 
    desc: 'Descarte de cálculos y quistes',
    whatsappText: 'Hola UNIDOSLAB, deseo consultar precio y disponibilidad para la Ecografía Renal (Riñones) en Tacna.',
    iconSvg: <IconOrganKidneys className="w-5 h-5" />
  },
  { 
    name: 'Vejiga', 
    desc: 'Paredes y residuo urinario',
    whatsappText: 'Hola UNIDOSLAB, deseo consultar precio y disponibilidad para la Ecografía de Vejiga en Tacna.',
    iconSvg: <IconOrganBladder className="w-5 h-5" />
  },
];

const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [activeModalExam, setActiveModalExam] = useState<ExamItem | null>(null);

  const filteredExams = useMemo(() => {
    return EXAMS_CATALOG.filter(exam => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = !term || 
        exam.name.toLowerCase().includes(term) || 
        exam.summary.toLowerCase().includes(term) ||
        (exam.subCategory && exam.subCategory.toLowerCase().includes(term));
      
      const matchesCategory = selectedCategory === 'Todos' || exam.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const getWhatsappUrl = (examName: string) => {
    const text = encodeURIComponent(`Hola UNIDOSLAB, deseo consultar precio, preparación y disponibilidad para el servicio: *${examName}* en Tacna.`);
    return `https://api.whatsapp.com/send/?phone=51952920616&text=${text}`;
  };

  const getCategoryCount = (catName: string) => {
    if (catName === 'Todos') return EXAMS_CATALOG.length;
    return EXAMS_CATALOG.filter(e => e.category === catName).length;
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/40 pt-20 sm:pt-28 pb-16 font-plex">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6">

        {/* 1. HERO HEADER DE SERVICIOS */}
        <section className="relative bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 shadow-xl shadow-slate-900/5 border border-slate-200/80 mb-6 sm:mb-8 overflow-hidden">
          
          {/* Acentos sutiles */}
          <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-gradient-to-bl from-red-500/8 via-rose-300/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 sm:w-80 h-64 sm:h-80 bg-gradient-to-tr from-sky-400/5 via-slate-100/50 to-transparent rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-3.5 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-red-50 text-[#FF5A5F] text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest border border-red-100/80">
                <span className="w-2 h-2 rounded-full bg-[#FF5A5F] animate-pulse"></span>
                <span>Laboratorio Clínico · Tacna, Perú</span>
              </div>

              <h1 className="font-jakarta text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E3A4C] tracking-tight leading-tight">
                Catálogo de Exámenes <br className="hidden sm:block" />
                <span className="text-[#FF5A5F]">y Servicios Médicos.</span>
              </h1>

              <p className="text-slate-500 text-xs sm:text-base max-w-2xl leading-relaxed font-medium">
                Resultados precisos, confidenciales y con entrega digital inmediata. Consulta y cotiza cualquiera de nuestros análisis clínicos o ecografías directamente por WhatsApp.
              </p>

              {/* 3 Badges de Valor */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 pt-1 sm:pt-2">
                <div className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-slate-50/80 border border-slate-100">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-red-100 text-[#FF5A5F] flex items-center justify-center shrink-0">
                    <IconClock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-[#1E3A4C]">Resultados Rápidos</span>
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-slate-50/80 border border-slate-100">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-red-100 text-[#FF5A5F] flex items-center justify-center shrink-0">
                    <IconShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-[#1E3A4C]">Control de Calidad</span>
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-slate-50/80 border border-slate-100">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <IconHomeHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-[#1E3A4C]">Atención a Domicilio</span>
                </div>
              </div>
            </div>

            {/* CTA Lateral WhatsApp */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center pt-2 sm:pt-0">
              <div className="w-full max-w-sm bg-gradient-to-b from-slate-50 to-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-md sm:shadow-lg text-center space-y-2.5 sm:space-y-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mx-auto shadow-inner">
                  <IconBrandWhatsapp className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h2 className="font-jakarta text-sm sm:text-base font-bold text-[#1E3A4C]">
                  ¿Buscas un examen específico?
                </h2>
                <p className="text-[11.5px] sm:text-xs text-slate-500 font-medium">
                  Escríbenos directamente y te brindamos precio, preparación y turno al instante.
                </p>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20deseo%20consultar%20por%20un%20examen%20cl%C3%ADnico%20en%20Tacna"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 sm:py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl sm:rounded-2xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <IconBrandWhatsapp className="w-4 h-4" />
                  <span>Consultar por WhatsApp</span>
                </motion.a>
              </div>
            </div>

          </div>
        </section>

        {/* 2. SECCIÓN ESPECIAL DESTACADA: ECOGRAFÍAS CON ÍCONOS SVG Y ACCIÓN DIRECTA */}
        <section className="bg-gradient-to-br from-white via-red-50/25 to-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 border-2 border-red-200/80 shadow-lg shadow-red-500/5 mb-6 sm:mb-8 relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 mb-5 sm:mb-6 pb-4 sm:pb-6 border-b border-red-100/80">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-red-100/70 text-[#FF5A5F] text-[9.5px] sm:text-[10px] font-extrabold uppercase tracking-widest">
                <IconSparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Servicio de Ecografías en Tacna</span>
              </div>
              <h2 className="font-jakarta text-xl sm:text-3xl font-extrabold text-[#1E3A4C] tracking-tight">
                Ecografías Especializadas
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm font-medium max-w-2xl">
                Diagnóstico por ultrasonido de alta resolución. Toca cualquier órgano para cotizar directamente por WhatsApp:
              </p>
            </div>

            <motion.a
              whileTap={{ scale: 0.97 }}
              href="https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20deseo%20consultar%20por%20el%20servicio%20de%20Ecograf%C3%ADas%20en%20Tacna"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <IconBrandWhatsapp className="w-4 h-4" />
              <span>Cotizar Ecografías</span>
            </motion.a>
          </div>

          {/* Grilla de Órganos con Íconos SVG Médicos y Enlace Directo a WhatsApp (Slider Horizontal Suave en Mobile) */}
          <div>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                Órganos evaluados:
              </span>
              <span className="sm:hidden text-[10px] font-semibold text-[#FF5A5F] flex items-center gap-1">
                <span>Desliza</span>
                <span>→</span>
              </span>
            </div>
            
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-2 sm:gap-2.5 pb-2 -mx-1 px-1 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 scrollbar-none">
              {ECOGRAFIA_ORGANS.map((organ, i) => (
                <motion.a 
                  key={i}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  href={`https://api.whatsapp.com/send/?phone=51952920616&text=${encodeURIComponent(organ.whatsappText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[124px] sm:w-auto shrink-0 snap-center sm:shrink p-3 sm:p-3.5 bg-white rounded-xl sm:rounded-2xl border border-red-100/90 shadow-2xs hover:shadow-md hover:border-red-300 transition-all flex flex-col items-center text-center group cursor-pointer"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-50 text-[#FF5A5F] group-hover:bg-[#FF5A5F] group-hover:text-white transition-colors flex items-center justify-center mb-1.5 sm:mb-2 shadow-2xs">
                    {organ.iconSvg}
                  </div>
                  <span className="text-xs font-extrabold text-[#1E3A4C] leading-tight group-hover:text-[#FF5A5F] transition-colors truncate w-full">
                    {organ.name}
                  </span>
                  <span className="text-[9px] sm:text-[9.5px] text-slate-400 mt-0.5 sm:mt-1 font-medium leading-tight line-clamp-1 sm:line-clamp-2">
                    {organ.desc}
                  </span>
                  <span className="mt-1.5 sm:mt-2 text-[8.5px] sm:text-[9px] text-[#25D366] font-bold uppercase tracking-wider flex items-center gap-0.5">
                    <span>Consultar</span>
                    <IconChevronRight className="w-2.5 h-2.5" />
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* 3. BUSCADOR Y FILTROS POR CATEGORÍAS */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-lg shadow-slate-900/5 border border-slate-200/80 mb-6 sm:mb-8 space-y-4 sm:space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-red-50 text-[#FF5A5F] flex items-center justify-center shrink-0 border border-red-100">
                <IconSearch className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h3 className="font-jakarta text-base sm:text-xl font-extrabold text-[#1E3A4C]">
                  Explora nuestros análisis clínicos
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  Selecciona una categoría o busca por nombre:
                </p>
              </div>
            </div>

            {/* Input Buscador */}
            <div className="relative w-full sm:w-80">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar glucosa, hemograma, orina..."
                className="w-full pl-9 sm:pl-10 pr-8 sm:pr-9 py-2.5 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-slate-700 font-medium text-xs sm:text-sm focus:outline-none focus:border-[#FF5A5F] focus:bg-white transition-all"
              />
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <IconX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Pills de Categorías con Conteo (Deslizable táctil suave) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 -mx-1 px-1 sm:mx-0 sm:px-0 scrollbar-none">
            {CATEGORIES_LIST.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = getCategoryCount(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl sm:rounded-full text-xs font-extrabold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 ${
                    isSelected 
                      ? 'bg-[#FF5A5F] text-white shadow-md shadow-red-500/20' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-500 border border-slate-200'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. LISTADO DE TARJETAS DE EXÁMENES CON BOTÓN DE WHATSAPP DIRECTO */}
        <section className="space-y-4">
          
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#1E3A4C]">
              Mostrando {filteredExams.length} análisis disponible(s)
            </span>
            {selectedCategory !== 'Todos' && (
              <button 
                onClick={() => setSelectedCategory('Todos')}
                className="text-xs font-bold text-[#FF5A5F] hover:underline cursor-pointer"
              >
                Ver todos
              </button>
            )}
          </div>

          {filteredExams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
              {filteredExams.map((exam) => (
                <motion.div
                  key={exam.id}
                  layout
                  whileHover={{ y: -3, transition: { duration: 0.15 } }}
                  className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-slate-200/80 hover:border-red-200/90 shadow-sm sm:shadow-md shadow-slate-900/5 hover:shadow-xl hover:shadow-red-500/5 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5 sm:space-y-3">
                    
                    {/* Header de la tarjeta */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-[#FF5A5F] border border-red-100 text-[9.5px] sm:text-[10px] font-extrabold uppercase tracking-wider">
                        {exam.category}
                      </span>
                      {exam.popular && (
                        <span className="text-[9.5px] sm:text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                          ★ Muy Solicitado
                        </span>
                      )}
                    </div>

                    {/* Título y Resumen directo */}
                    <div>
                      <h4 className="font-jakarta text-sm sm:text-base font-extrabold text-[#1E3A4C] leading-snug">
                        {exam.name}
                      </h4>
                      <p className="text-[11.5px] sm:text-xs text-slate-500 line-clamp-2 mt-1 sm:mt-1.5 leading-relaxed font-medium">
                        {exam.summary}
                      </p>
                    </div>

                    {/* Metadatos rápidos */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-[10.5px] sm:text-[11px] text-slate-600 font-medium">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 font-semibold">
                        <IconDroplet className="w-3.5 h-3.5 text-[#FF5A5F]" />
                        <span>{exam.sampleType}</span>
                      </span>
                    </div>

                  </div>

                  {/* Botón Principal y Botón Info */}
                  <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-slate-100 flex items-center gap-2">
                    <motion.a
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      href={getWhatsappUrl(exam.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3.5 bg-slate-50 hover:bg-[#25D366]/10 border border-slate-200 hover:border-[#25D366]/60 text-slate-700 hover:text-[#1EBE5D] font-bold text-xs rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer group/btn shadow-2xs"
                    >
                      <IconBrandWhatsapp className="w-4 h-4 text-[#25D366] shrink-0 transition-transform group-hover/btn:scale-110" />
                      <span>Consultar prueba</span>
                      <IconChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-[#1EBE5D] transition-transform group-hover/btn:translate-x-0.5" />
                    </motion.a>

                    <button
                      onClick={() => setActiveModalExam(exam)}
                      title="Ver información del examen"
                      className="p-2.5 bg-white hover:bg-slate-100 text-slate-400 hover:text-[#FF5A5F] border border-slate-200 rounded-xl sm:rounded-2xl transition-colors cursor-pointer shrink-0 shadow-2xs"
                    >
                      <IconInfoCircle className="w-4 h-4" />
                    </button>
                  </div>

                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-sm space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-50 text-[#FF5A5F] flex items-center justify-center mx-auto">
                <IconSearch className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-jakarta text-sm sm:text-base font-bold text-[#1E3A4C]">
                No encontramos resultados para &quot;{searchTerm}&quot;
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Contamos con más análisis especiales. Consúltanos directamente para ayudarte.
              </p>
              <a
                href={`https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20busco%20informaci%C3%B3n%20sobre:%20${encodeURIComponent(searchTerm)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider rounded-xl sm:rounded-2xl shadow-md cursor-pointer hover:bg-[#20ba5a]"
              >
                <IconBrandWhatsapp className="w-4 h-4" />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>
          )}

        </section>

        {/* 5. BANNER FINAL: SERVICIO A DOMICILIO EN TACNA */}
        <section className="mt-8 sm:mt-12 bg-gradient-to-r from-red-50 via-white to-red-50/50 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 border-2 border-red-200/80 shadow-lg shadow-red-500/5 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-3.5 sm:gap-4 text-center sm:text-left">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-red-200 text-[#FF5A5F] flex items-center justify-center shrink-0 shadow-sm">
              <IconHomeHeart className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF5A5F] block mb-1">
                Atención en la comodidad de tu hogar
              </span>
              <h3 className="font-jakarta text-lg sm:text-2xl font-extrabold text-[#1E3A4C]">
                ¿No puedes salir de casa? Vamos hacia ti.
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5 sm:mt-1">
                Toma de muestras de laboratorio a domicilio en toda la ciudad de Tacna.
              </p>
            </div>
          </div>

          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20deseo%20agendar%20una%20toma%20de%20muestra%20a%20domicilio%20en%20Tacna"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 sm:px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl sm:rounded-2xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer transition-all"
          >
            <IconBrandWhatsapp className="w-5 h-5" />
            <span>Agendar a Domicilio</span>
          </motion.a>
        </section>

      </div>

      {/* 6. MODAL DE INFORMACIÓN RÁPIDA */}
      <AnimatePresence>
        {activeModalExam && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3.5 sm:p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-8 shadow-2xl border border-slate-100 relative space-y-4 sm:space-y-5 max-h-[88vh] overflow-y-auto"
            >
              
              {/* Header del Modal */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-3.5 sm:pb-4">
                <div className="space-y-1">
                  <span className="text-[9.5px] sm:text-[10px] font-extrabold uppercase tracking-widest text-[#FF5A5F] bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full inline-block">
                    {activeModalExam.category}
                  </span>
                  <h3 className="font-jakarta text-lg sm:text-2xl font-extrabold text-[#1E3A4C] mt-1 leading-snug">
                    {activeModalExam.name}
                  </h3>
                </div>
                <button 
                  onClick={() => setActiveModalExam(null)}
                  className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                >
                  <IconX className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Resumen */}
              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="p-3.5 sm:p-4 bg-slate-50/80 rounded-xl sm:rounded-2xl border border-slate-100 space-y-1">
                  <span className="font-extrabold text-[#1E3A4C] uppercase tracking-wider text-[10px] sm:text-[11px] block">
                    ¿Para qué sirve este examen?
                  </span>
                  <p className="leading-relaxed text-slate-600 font-medium text-xs sm:text-sm">
                    {activeModalExam.summary}
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-3 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-slate-100 shadow-2xs">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-50 text-[#FF5A5F] flex items-center justify-center shrink-0">
                      <IconDroplet className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>
                    <div>
                      <span className="font-extrabold text-[#1E3A4C] block text-xs">Muestra requerida</span>
                      <span className="text-slate-600 text-xs font-medium">{activeModalExam.sampleType}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón WhatsApp de Cotización Directa */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-center">
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  Consulta precios, preparación y agenda tu turno al instante:
                </p>
                <motion.a 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={getWhatsappUrl(activeModalExam.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 sm:py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <IconBrandWhatsapp className="w-4 h-4" />
                  <span>Consultar por WhatsApp</span>
                </motion.a>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Services;
