"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconSearch, 
  IconX, 
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
  IconSend,
  IconPhone
} from '@tabler/icons-react';
import WhatsAppIcon from './icons/WhatsAppIcon';
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
    <div className="w-full min-h-screen bg-[#f7fafc] pt-[104px] sm:pt-[128px] pb-[96px] font-manrope">
      <div className="w-[min(1180px,100%-48px)] mx-auto space-y-[32px] sm:space-y-[44px]">

        {/* 1. HERO HEADER DE SERVICIOS (.catalog-hero-grid) */}
        <section className="border border-[#dce6ec] bg-[radial-gradient(circle_at_79%_46%,rgba(251,89,98,0.07),transparent_27%),linear-gradient(135deg,#fff,#fbfdfe)] rounded-[28px] p-[28px_20px] sm:p-[48px] shadow-[0_16px_38px_rgba(23,55,74,0.08)] grid grid-cols-1 lg:grid-cols-[1.55fr_0.65fr] gap-[36px] lg:gap-[52px] items-center">
          <div className="flex flex-col items-start text-left">
            <p className="inline-flex items-center gap-[9px] text-[12px] font-[800] uppercase tracking-[0.14em] text-[#e54550] mb-[17px]">
              <span className="w-[7px] h-[7px] rounded-full bg-[#fb5962] shadow-[0_0_0_5px_#fff0f1] shrink-0"></span>
              <span>UNIDOSLAB · Catálogo de Servicios</span>
            </p>

            <h1 className="font-manrope text-[clamp(34px,4.5vw,64px)] font-[800] text-[#09283c] leading-[1.04] tracking-[-0.035em] mb-[20px]">
              Catálogo de exámenes <br />
              <span className="text-[#fb5962]">y servicios médicos.</span>
            </h1>

            <p className="font-manrope text-[15px] sm:text-[16px] text-[#60788a] leading-[1.72] max-w-[720px] mb-[25px]">
              Resultados precisos, confidenciales y con entrega digital inmediata. Consulta y cotiza cualquiera de nuestros análisis clínicos o ecografías directamente por WhatsApp.
            </p>

            {/* 3 Badges de Beneficios (.catalog-benefits) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[11px] w-full">
              <span className="min-h-[54px] text-[#12354a] bg-[#f8fafc] border border-[#e5edf2] rounded-[14px] flex items-center gap-[9px] p-[10px_13px] text-[12px] font-[700]">
                <div className="w-[34px] h-[34px] rounded-[10px] bg-[#fff0f1] text-[#fb5962] flex items-center justify-center shrink-0">
                  <IconClock className="w-[18px] h-[18px]" />
                </div>
                <span>Resultados rápidos</span>
              </span>

              <span className="min-h-[54px] text-[#12354a] bg-[#f8fafc] border border-[#e5edf2] rounded-[14px] flex items-center gap-[9px] p-[10px_13px] text-[12px] font-[700]">
                <div className="w-[34px] h-[34px] rounded-[10px] bg-[#fff0f1] text-[#fb5962] flex items-center justify-center shrink-0">
                  <IconShieldCheck className="w-[18px] h-[18px]" />
                </div>
                <span>Control de calidad</span>
              </span>

              <span className="min-h-[54px] text-[#12354a] bg-[#f8fafc] border border-[#e5edf2] rounded-[14px] flex items-center gap-[9px] p-[10px_13px] text-[12px] font-[700]">
                <div className="w-[34px] h-[34px] rounded-[10px] bg-[#e5f9f1] text-[#14b879] flex items-center justify-center shrink-0">
                  <IconHomeHeart className="w-[18px] h-[18px]" />
                </div>
                <span>Atención a domicilio</span>
              </span>
            </div>
          </div>

          {/* Tarjeta de Contacto Directo en Navy Deep (.catalog-contact) */}
          <div className="bg-[#09283c] text-white rounded-[24px] p-[28px_24px] sm:p-[32px_28px] shadow-[0_18px_45px_rgba(9,40,60,0.18)] flex flex-col items-center text-center relative overflow-hidden">
            <span className="w-[52px] h-[52px] rounded-[16px] bg-white/[0.1] border border-white/[0.15] text-[#25D366] flex items-center justify-center mb-[16px] shadow-sm">
              <WhatsAppIcon className="w-[28px] h-[28px]" />
            </span>
            <h2 className="font-manrope text-[18px] sm:text-[19px] font-[800] text-white mb-[8px] leading-snug">
              ¿Buscas un examen específico?
            </h2>
            <p className="font-manrope text-[12.5px] text-[#b9cad3] leading-[1.55] mb-[20px]">
              Escríbenos directamente y te brindamos precio, preparación y turno al instante.
            </p>
            <a
              href="https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20deseo%20consultar%20por%20un%20examen%20cl%C3%ADnico%20en%20Tacna"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[48px] px-[20px] bg-[#25D366] hover:bg-[#20ba5a] text-white font-manrope font-[800] text-[13px] rounded-[13px] shadow-[0_10px_22px_rgba(37,211,102,0.28)] transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-[9px] cursor-pointer"
            >
              <WhatsAppIcon className="w-[19px] h-[19px]" />
              <span>Consultar por WhatsApp</span>
            </a>
          </div>
        </section>

        {/* 2. PANEL DE ECOGRAFÍAS (.ultrasound-panel) */}
        <section className="bg-[linear-gradient(115deg,#fff8f8,#fff)] border border-[#f5bdc1] rounded-[24px] p-[24px_20px] sm:p-[38px_40px_32px] shadow-[0_14px_35px_rgba(23,55,74,0.05)]">
          <div className="border-b border-[#f4d9db] grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-[20px] md:gap-[35px] pb-[25px]">
            <div className="flex flex-col items-start text-left">
              <p className="inline-flex items-center gap-[9px] text-[11.5px] font-[800] uppercase tracking-[0.14em] text-[#e54550] mb-[8px]">
                <IconSparkles className="w-[14px] h-[14px] text-[#fb5962]" />
                <span>Servicio de Ecografías en Tacna</span>
              </p>
              <h2 className="font-manrope text-[clamp(24px,3vw,34px)] font-[800] text-[#09283c] tracking-[-0.03em] mb-[7px]">
                Ecografías especializadas
              </h2>
              <p className="font-manrope text-[13.5px] text-[#60788a] leading-[1.55] max-w-[680px]">
                Diagnóstico por ultrasonido de alta resolución. Toca cualquier órgano para cotizar directamente por WhatsApp:
              </p>
            </div>

            <a
              href="https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20deseo%20consultar%20por%20el%20servicio%20de%20Ecograf%C3%ADas%20en%20Tacna"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-h-[46px] px-[20px] bg-[#20ca70] hover:bg-[#16b963] text-white font-manrope font-[800] text-[13px] rounded-[13px] shadow-[0_10px_22px_rgba(20,184,121,0.24)] transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-[9px] cursor-pointer shrink-0"
            >
              <WhatsAppIcon className="w-[18px] h-[18px]" />
              <span>Cotizar ecografías</span>
            </a>
          </div>

          {/* Grilla de Órganos (.organ-grid) */}
          <div className="pt-[22px]">
            <p className="font-manrope text-[10.5px] font-[800] uppercase tracking-[0.13em] text-[#8aa0b1] mb-[12px] text-left">
              Órganos evaluados:
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-[10px]">
              {ECOGRAFIA_ORGANS.map((organ, i) => (
                <a
                  key={i}
                  href={`https://api.whatsapp.com/send/?phone=51952920616&text=${encodeURIComponent(organ.whatsappText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/80 hover:bg-white border border-[#f3d4d6] hover:border-[#ef9da3] rounded-[16px] flex flex-col items-center text-center min-h-[150px] p-[14px_8px_12px] shadow-2xs hover:shadow-[0_10px_22px_rgba(23,55,74,0.08)] hover:-translate-y-[3px] transition-all group cursor-pointer"
                >
                  <span className="w-[40px] h-[40px] rounded-[12px] bg-[#fff0f1] text-[#fb5962] group-hover:bg-[#fb5962] group-hover:text-white transition-colors flex items-center justify-center mb-[9px] shrink-0">
                    {organ.iconSvg}
                  </span>
                  <strong className="font-manrope text-[11px] font-[800] text-[#09283c] mb-[4px] leading-tight group-hover:text-[#fb5962] transition-colors truncate w-full">
                    {organ.name}
                  </strong>
                  <small className="font-manrope text-[8.5px] text-[#879cad] min-h-[30px] leading-[1.35] line-clamp-2">
                    {organ.desc}
                  </small>
                  <em className="font-manrope text-[8px] font-[800] uppercase tracking-[0.05em] text-[#10ad61] not-italic flex items-center gap-[2px] mt-auto">
                    <span>Consultar</span>
                    <IconChevronRight className="w-[10px] h-[10px]" />
                  </em>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 3. HERRAMIENTAS DE BÚSQUEDA Y CATEGORÍAS (.catalog-tools) */}
        <section className="border border-[#dce6ec] bg-white rounded-[22px] p-[24px_20px] sm:p-[29px_31px_27px] shadow-[0_14px_32px_rgba(23,55,74,0.07)]">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_minmax(270px,340px)] items-center gap-[20px] md:gap-[30px]">
            <div className="flex items-center gap-[14px] text-left">
              <div className="w-[44px] h-[44px] rounded-[13px] bg-[#fff0f1] text-[#fb5962] flex items-center justify-center shrink-0">
                <IconMicroscope className="w-[22px] h-[22px] stroke-[1.8]" />
              </div>
              <div>
                <h2 className="font-manrope text-[18px] sm:text-[20px] font-[800] text-[#09283c] leading-tight mb-[2px]">
                  Explora nuestros análisis clínicos
                </h2>
                <p className="font-manrope text-[12px] text-[#60788a] leading-[1.35]">
                  Selecciona una categoría o escribe el nombre del análisis:
                </p>
              </div>
            </div>

            {/* Input Buscador (.catalog-search) */}
            <div className="border border-[#dce6ec] bg-[#f8fafc] focus-within:border-[#f19aa0] focus-within:shadow-[0_0_0_4px_#fff0f1] rounded-[14px] flex items-center gap-[10px] h-[46px] px-[15px] transition-all">
              <IconSearch className="w-[18px] h-[18px] text-[#8ba0b3] shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar glucosa, hemograma, orina..."
                className="w-full font-manrope text-[13px] text-[#09283c] bg-transparent border-0 outline-none placeholder-[#8ba0b3]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-[#8ba0b3] hover:text-[#fb5962] p-1 cursor-pointer"
                >
                  <IconX className="w-[15px] h-[15px]" />
                </button>
              )}
            </div>
          </div>

          {/* Tabs de Categorías (.category-tabs) */}
          <div className="flex items-center gap-[8px] mt-[23px] overflow-x-auto pb-[4px] scrollbar-none">
            {CATEGORIES_LIST.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = getCategoryCount(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`min-h-[38px] rounded-full px-[15px] text-[11px] font-manrope font-[800] flex items-center gap-[8px] shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#fb5962] text-white shadow-[0_8px_18px_rgba(251,89,98,0.22)]'
                      : 'bg-[#f0f5f8] text-[#12354a] hover:bg-[#e4ecf1]'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[9px] px-[6px] py-[2px] rounded-full font-[800] ${
                    isSelected ? 'bg-white text-[#fb5962]' : 'bg-white text-[#7d91a0]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. LISTADO DE EXÁMENES (.exam-grid) */}
        <section className="space-y-[16px]">
          <div className="flex items-center justify-between px-[4px]">
            <p className="font-manrope text-[11px] font-[800] uppercase tracking-[0.13em] text-[#09283c]">
              Mostrando {filteredExams.length} análisis disponible(s)
            </p>
            {selectedCategory !== 'Todos' && (
              <button
                onClick={() => setSelectedCategory('Todos')}
                className="font-manrope text-[12px] font-[800] text-[#fb5962] hover:text-[#e54550] cursor-pointer"
              >
                Ver todos
              </button>
            )}
          </div>

          {filteredExams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
              {filteredExams.map((exam) => (
                <div
                  key={exam.id}
                  className="border border-[#dce6ec] bg-white rounded-[21px] p-[25px_24px_20px] shadow-[0_7px_18px_rgba(23,55,74,0.06)] hover:shadow-[0_14px_28px_rgba(23,55,74,0.1)] hover:border-[#efb3b7] hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[278px]"
                >
                  <div>
                    {/* Header de la tarjeta */}
                    <div className="flex items-center justify-between gap-[10px] min-h-[23px] mb-[12px]">
                      <span className="font-manrope text-[9px] font-[800] uppercase tracking-[0.06em] text-[#e54550] bg-[#fff4f5] border border-[#f7d1d4] rounded-full px-[9px] py-[5px]">
                        {exam.category}
                      </span>
                      {exam.popular && (
                        <span className="font-manrope text-[9px] font-[800] text-[#b67200] bg-[#fffaf0] border border-[#f3d486] rounded-full px-[9px] py-[5px]">
                          ★ Muy solicitado
                        </span>
                      )}
                    </div>

                    {/* Titular y Descripción */}
                    <h3 className="font-manrope text-[17px] font-[800] text-[#09283c] leading-[1.25] mb-[8px] text-left">
                      {exam.name}
                    </h3>
                    <p className="font-manrope text-[12px] text-[#60788a] leading-[1.55] min-h-[54px] mb-[13px] text-left">
                      {exam.summary}
                    </p>

                    {/* Muestra requerida (.sample) */}
                    <div className="border-y border-[#edf2f5] py-[11px] flex items-center gap-[7px] text-[10px] font-manrope font-[750] text-[#12354a]">
                      <IconDroplet className="w-[14px] h-[14px] text-[#fb5962]" />
                      <span>{exam.sampleType}</span>
                    </div>
                  </div>

                  {/* Acciones de la tarjeta (.exam-actions) */}
                  <div className="grid grid-cols-[1fr_39px] gap-[8px] pt-[14px] mt-auto">
                    <a
                      href={getWhatsappUrl(exam.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-[#dce6ec] hover:border-[#20ca70]/50 bg-[#f8fafc] hover:bg-[#20ca70]/10 text-[#12354a] hover:text-[#16b963] min-h-[40px] rounded-[13px] flex items-center justify-center gap-[8px] px-[14px] text-[11px] font-manrope font-[800] transition-all cursor-pointer group"
                    >
                      <WhatsAppIcon className="w-[16px] h-[16px] text-[#20ca70] shrink-0" />
                      <span>Consultar prueba</span>
                      <IconChevronRight className="w-[14px] h-[14px] text-[#99abb7] group-hover:text-[#20ca70] group-hover:translate-x-0.5 transition-all ml-auto" />
                    </a>

                    <button
                      onClick={() => setActiveModalExam(exam)}
                      title="Ver información del examen"
                      className="border border-[#dce6ec] hover:border-[#fb5962]/40 bg-white hover:bg-[#fff0f1] text-[#8da1af] hover:text-[#fb5962] rounded-[13px] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                    >
                      <IconInfoCircle className="w-[18px] h-[18px]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-[#cbd9e1] rounded-[22px] p-[60px_20px] text-center space-y-[14px]">
              <div className="w-[54px] h-[54px] rounded-[16px] bg-[#fff0f1] text-[#fb5962] flex items-center justify-center mx-auto">
                <IconSearch className="w-[24px] h-[24px]" />
              </div>
              <h3 className="font-manrope text-[17px] font-[800] text-[#09283c]">
                No encontramos resultados para &quot;{searchTerm}&quot;
              </h3>
              <p className="font-manrope text-[13px] text-[#60788a] max-w-[480px] mx-auto">
                Contamos con más de 300 análisis clínicos y pruebas especiales. Consúltanos directamente para orientarte.
              </p>
              <a
                href={`https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20busco%20informaci%C3%B3n%20sobre:%20${encodeURIComponent(searchTerm)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-[9px] min-h-[46px] px-[22px] bg-[#20ca70] hover:bg-[#16b963] text-white font-manrope font-[800] text-[13px] rounded-[13px] shadow-[0_10px_22px_rgba(20,184,121,0.24)] cursor-pointer transition-all"
              >
                <WhatsAppIcon className="w-[18px] h-[18px]" />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>
          )}
        </section>

        {/* 5. BANNER FINAL AZUL NAVY (.final-cta Fiel a la Principal) */}
        <section className="bg-[#09283c] rounded-[26px] p-[36px_26px] sm:p-[48px_52px] text-white shadow-[0_20px_50px_rgba(9,40,60,0.18)] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-[30px]">
          {/* Acento circular decorativo */}
          <div className="absolute -top-[120px] -right-[120px] w-[320px] h-[320px] rounded-full border-[60px] border-white/[0.03] pointer-events-none"></div>

          <div className="flex flex-col items-start text-left max-w-[680px] relative z-10">
            <p className="inline-flex items-center gap-[9px] text-[12px] font-[800] uppercase tracking-[0.14em] text-[#ff9da3] mb-[15px]">
              <span className="w-[7px] h-[7px] rounded-full bg-[#fb5962] shadow-[0_0_0_5px_rgba(251,89,98,0.15)] shrink-0"></span>
              <span>Atención a domicilio en Tacna</span>
            </p>
            <h2 className="font-manrope text-[clamp(24px,3vw,36px)] font-[800] text-white leading-[1.15] tracking-[-0.03em] mb-[12px]">
              ¿No puedes salir de casa? Vamos hacia ti.
            </h2>
            <p className="font-manrope text-[14px] sm:text-[15px] text-[#b9cad3] leading-[1.65]">
              Realizamos la toma de muestras de laboratorio en tu hogar con personal especializado, puntualidad y protocolos clínicos 100% seguros.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[12px] w-full lg:w-auto shrink-0 relative z-10">
            <a
              href="https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20deseo%20agendar%20una%20toma%20de%20muestra%20a%20domicilio%20en%20Tacna"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] px-[22px] bg-white hover:bg-slate-100 text-[#09283c] font-manrope font-[800] text-[13px] rounded-[13px] shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-[9px] cursor-pointer"
            >
              <WhatsAppIcon className="w-[18px] h-[18px] text-[#25D366]" />
              <span>Agendar por WhatsApp</span>
            </a>

            <a
              href="tel:51952920616"
              className="min-h-[48px] px-[22px] bg-transparent hover:bg-white/[0.08] border border-white/[0.22] hover:border-white/40 text-white font-manrope font-[800] text-[13px] rounded-[13px] transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-[9px] cursor-pointer"
            >
              <IconPhone className="w-[18px] h-[18px]" />
              <span>952 920 616</span>
            </a>
          </div>
        </section>

      </div>

      {/* 6. MODAL DE INFORMACIÓN RÁPIDA */}
      <AnimatePresence>
        {activeModalExam && (
          <div className="fixed inset-0 z-50 bg-[#071f2f]/80 backdrop-blur-[8px] flex items-center justify-center p-[16px]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="bg-white rounded-[24px] max-w-lg w-full p-[28px_24px] sm:p-[36px_32px] shadow-[0_30px_80px_rgba(0,0,0,0.35)] border border-[#dce6ec] relative space-y-[20px] max-h-[88vh] overflow-y-auto font-manrope"
            >
              
              {/* Header del Modal */}
              <div className="flex justify-between items-start border-b border-[#edf2f5] pb-[16px]">
                <div className="flex flex-col items-start text-left space-y-1">
                  <span className="text-[9.5px] font-[800] uppercase tracking-[0.08em] text-[#e54550] bg-[#fff4f5] border border-[#f7d1d4] px-[9px] py-[3px] rounded-full inline-block">
                    {activeModalExam.category}
                  </span>
                  <h3 className="font-manrope text-[20px] sm:text-[22px] font-[800] text-[#09283c] mt-1 leading-snug">
                    {activeModalExam.name}
                  </h3>
                </div>
                <button 
                  onClick={() => setActiveModalExam(null)}
                  className="w-[36px] h-[36px] rounded-[10px] border border-[#dce6ec] text-[#8da1af] hover:text-[#09283c] hover:bg-[#f8fafc] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <IconX className="w-[18px] h-[18px]" />
                </button>
              </div>

              {/* Resumen */}
              <div className="space-y-[14px] text-left">
                <div className="p-[16px] bg-[#f8fafc] rounded-[16px] border border-[#edf2f5] space-y-1">
                  <span className="font-manrope font-[800] text-[#09283c] uppercase tracking-[0.08em] text-[10.5px] block">
                    ¿Para qué sirve este examen?
                  </span>
                  <p className="font-manrope text-[13px] text-[#60788a] leading-[1.6]">
                    {activeModalExam.summary}
                  </p>
                </div>

                <div className="flex items-center gap-[12px] p-[14px_16px] rounded-[16px] bg-white border border-[#dce6ec]">
                  <div className="w-[36px] h-[36px] rounded-[11px] bg-[#fff0f1] text-[#fb5962] flex items-center justify-center shrink-0">
                    <IconDroplet className="w-[18px] h-[18px]" />
                  </div>
                  <div>
                    <span className="font-manrope font-[800] text-[#09283c] block text-[11px] uppercase tracking-wider">Muestra requerida</span>
                    <span className="font-manrope text-[#60788a] text-[13px] font-[600]">{activeModalExam.sampleType}</span>
                  </div>
                </div>
              </div>

              {/* Botón WhatsApp de Cotización Directa */}
              <div className="pt-[14px] border-t border-[#edf2f5] space-y-[12px] text-center">
                <p className="font-manrope text-[12px] text-[#60788a]">
                  Consulta precios, preparación y agenda tu turno al instante:
                </p>
                <a 
                  href={getWhatsappUrl(activeModalExam.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[48px] bg-[#20ca70] hover:bg-[#16b963] text-white font-manrope font-[800] text-[13px] rounded-[13px] shadow-[0_10px_22px_rgba(20,184,121,0.24)] flex items-center justify-center gap-[9px] cursor-pointer transition-all"
                >
                  <WhatsAppIcon className="w-[18px] h-[18px]" />
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Services;
